#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

require "net/http"
require "uri"

module Fusor
  class Api::V3::DeploymentsController < Api::V3::BaseController

    #include Api::Version3

    before_filter :find_deployment, :only => [:destroy, :show, :update,
                                              :deploy, :redeploy, :validate, :log]

    rescue_from Encoding::UndefinedConversionError, :with => :ignore_it

    def index
      @deployments = Deployment.search_for(params[:search], :order => params[:order]).by_id(params[:id])
      render :json => @deployments, :include => :organization, :each_serializer => Fusor::DeploymentSerializer
    end

    def show
      begin
        sync_openstack if params[:sync_openstack] == 'true'
      rescue => e
        Rails.logger.error "Error syncing openstack for deployment #{e.message}"
      end

      render :json => @deployment, :include => :organization, :serializer => Fusor::DeploymentSerializer
    end

    def create
      @deployment = Deployment.new(deployment_params)
      if @deployment.save
        render :json => @deployment, :serializer => Fusor::DeploymentSerializer
      else
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def update
      # OpenStack Undercloud attributes should only be set by the undercloud
      # controller (after it has validated them), never by directly updating
      # the deployment object.

      params[:deployment].delete :openstack_undercloud_password
      params[:deployment].delete :openstack_undercloud_ip_addr
      params[:deployment].delete :openstack_undercloud_user
      params[:deployment].delete :openstack_undercloud_user_password
      @deployment.attributes = deployment_params
      @deployment.save(:validate => false)
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    def deploy
      begin
        # If we're deploying then the deployment object needs to be valid.
        # This should be the only time we run the DeploymentValidator.
        if @deployment.invalid?
          raise ::ActiveRecord::RecordInvalid.new @deployment
        end

        ::Fusor.log_change_deployment(@deployment)

        # update the provider with the url
        ::Fusor.log.debug "setting provider url to [#{@deployment.cdn_url}]"
        provider = @deployment.organization.redhat_provider
        # just in case save it on the @deployment.org as well
        @deployment.organization.redhat_provider.repository_url = @deployment.cdn_url
        provider.repository_url = @deployment.cdn_url
        provider.save!

        manifest_task = sync_task(::Actions::Fusor::Subscription::ManageManifest,
                                  @deployment,
                                  customer_portal_credentials)

        # If the manifest action failed, there is no need to continue with
        # the deploy actions, since it requires subscriptions & content
        # both of which are enabled by the manifest.
        unless manifest_task["result"] == "error"
          task = async_task(::Actions::Fusor::Deploy,
                            @deployment,
                            params[:skip_content])
        end
        respond_for_async :resource => task
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def redeploy
      begin
        if @deployment.invalid?
          raise ::ActiveRecord::RecordInvalid.new @deployment
        end
        ::Fusor.log.warn "Attempting to redeploy deployment with id [ #{@deployment.id} ]"
        new_deploy_task = async_task(::Actions::Fusor::Deploy, @deployment)
        respond_for_async :resource => new_deploy_task
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def validate
      error_syncing_openstack = nil
      begin
        sync_openstack
      rescue => e
        error_syncing_openstack =  _("Error contacting Openstack undercloud #{e.message}")
      end
      @deployment.valid?
      errors = @deployment.errors.full_messages
      errors << error_syncing_openstack unless error_syncing_openstack.nil?

      render json: {
        :validation => {
          :deployment_id => @deployment.id,
          :errors => errors,
          :warnings => @deployment.warnings
        }
      }
    end

    def validate_cdn
      begin
        if params.key?('cdn_url')
          ad_hoc_req = lambda do |uri_str|
            uri = URI.parse(uri_str)
            http = Net::HTTP.new(uri.host, uri.port)
            request = Net::HTTP::Head.new(uri.request_uri)
            http.request(request)
          end

          unescaped_uri_str = URI.unescape(params[:cdn_url])
          # Best we can reasonably do here is to check to make sure we get
          # back a 200 when we hit $URL/content, since we can be reasonably
          # certain a repo needs to have the /content path
          full_uri_str = "#{unescaped_uri_str}/content"
          full_uri_str = "#{unescaped_uri_str}content" if unescaped_uri_str =~ /\/$/

          response = ad_hoc_req.call(full_uri_str)
          # Follow a 301 once in case redirect /content -> /content/
          final_code = response.code
          final_code = ad_hoc_req.call(response['location']).code if response.code == '301'

          render json: { :cdn_url_code => final_code }, status: 200
        else
          raise 'cdn_url parameter missing'
        end
      rescue => error
        message = 'Malformed request'
        message = error.message if error.respond_to?(:message)
        render json: { :error => message }, status: 400
      end
    end

    def log
      log_type_param = params[:log_type] || 'fusor_log'
      reader = create_log_reader(log_type_param)
      log_path = get_log_path(log_type_param)

      if !File.exist? log_path
        render :json => {log_type_param => nil}
      elsif params[:line_number_gt]
        render :json => {log_type_param => reader.tail_log_since(log_path, (params[:line_number_gt]).to_i)}
      else
        render :json => {log_type_param => reader.read_full_log(log_path)}
      end
    end

    def resource_name
      'deployment'
    end

    private

    def find_deployment
      id = params[:deployment_id] || params[:id]
      not_found and return false if id.blank?
      @deployment = Deployment.find(id)
    end

    def ignore_it
      true
    end

    def customer_portal_credentials
      { :username => session[:portal_username], :password => session[:portal_password] }
    end

    def deployment_params

      # add belongs_to attributes: organization_id, lifecycle_environment_id, rhev_engine_host_id
      if params[:data][:relationships]
        if (org = params[:data][:relationships][:organization])
          org_id = org[:data] ? org[:data][:id] : nil
          params[:data][:attributes][:organization_id] = org_id
        end
        if (env = params[:data][:relationships][:lifecycle_environment])
          env_id = env[:data] ? env[:data][:id] : nil
          params[:data][:attributes][:lifecycle_environment_id] = env_id
        end
        if (engine = params[:data][:relationships][:discovered_host])
          engine_id = engine[:data] ? engine[:data][:id] : nil
          params[:data][:attributes][:rhev_engine_host_id] = engine_id
        end
      end

      # add discovered_host_ids => [] as permitted in addition to model attrs
      # Note: config.action_dispatch.perform_deep_munge = false, so [] is passed as [] and not null
      params.require(:data).require(:attributes).permit(:name, :lifecycle_environment_id,
              :organization_id, :deploy_rhev, :deploy_cfme, :deploy_openstack, :rhev_engine_host_id,
              :rhev_data_center_name, :rhev_cluster_name, :rhev_storage_name, :rhev_storage_type,
              :rhev_storage_address, :rhev_cpu_type, :rhev_share_path, :cfme_install_loc,
              :description, :rhev_is_self_hosted, :rhev_engine_admin_password, :foreman_task_uuid,
              :upstream_consumer_uuid, :rhev_root_password, :cfme_root_password,
              :upstream_consumer_name, :rhev_export_domain_name, :rhev_export_domain_address,
              :rhev_export_domain_path, :rhev_local_storage_path, :host_naming_scheme,
              :custom_preprend_name, :enable_access_insights, :cfme_address, :cfme_admin_password,
              :openstack_undercloud_password, :openstack_undercloud_ip_addr,
              :openstack_undercloud_user, :openstack_undercloud_user_password, :cdn_url,
              :manifest_file, :is_disconnected, :openstack_overcloud_address,
              :openstack_overcloud_password, :openstack_overcloud_private_net,
              :openstack_overcloud_float_net, :openstack_overcloud_float_gateway,
              :openstack_overcloud_hostname, :openstack_undercloud_hostname, :cfme_hostname,
              :label, :has_content_error,
              :discovered_host_ids => [])
    end

    def create_log_reader(log_type_param)
      case log_type_param
        when 'fusor_log', 'foreman_log'
          Fusor::Logging::RailsLogReader.new
        when 'candlepin_log'
          Fusor::Logging::JavaLogReader.new
        when 'foreman_proxy_log'
          Fusor::Logging::ProxyLogReader.new
        else
          Fusor::Logging::LogReader.new
      end
    end

    def get_log_path(log_type_param)
      dir = ::Fusor.log_file_dir(@deployment.label, @deployment.id)
      case log_type_param
        when 'messages_log'
          File.join(dir, 'var/log/messages')
        when 'candlepin_log'
          File.join(dir, 'var/log/candlepin/candlepin.log')
        when 'foreman_log'
          File.join(dir, 'var/log/foreman/production.log')
        when 'foreman_proxy_log'
          File.join(dir, 'var/log/foreman-proxy/proxy.log')
        else
          ::Fusor.log_file_path(@deployment.label, @deployment.id)
      end
    end

    def undercloud_handle
      Overcloud::UndercloudHandle.new('admin', @deployment.openstack_undercloud_password, @deployment.openstack_undercloud_ip_addr, 5000)
    end

    def get_openstack_param_value(plan, param_name)
      param = plan.parameters.find { |p| p['name'] == param_name }
      param['value'] if param
    end

    def sync_openstack
      return unless @deployment.deploy_openstack?
      plan = undercloud_handle.get_plan('overcloud')

      @deployment.openstack_overcloud_ext_net_interface = get_openstack_param_value(plan, 'Controller-1::NeutronPublicInterface')
      @deployment.openstack_overcloud_libvirt_type = get_openstack_param_value(plan, 'Compute-1::NovaComputeLibvirtType')
      @deployment.openstack_overcloud_compute_flavor = get_openstack_param_value(plan, 'Compute-1::Flavor')
      @deployment.openstack_overcloud_compute_count = get_openstack_param_value(plan, 'Compute-1::count')
      @deployment.openstack_overcloud_controller_flavor = get_openstack_param_value(plan, 'Controller-1::Flavor')
      @deployment.openstack_overcloud_controller_count = get_openstack_param_value(plan, 'Controller-1::count')
      @deployment.openstack_overcloud_ceph_storage_flavor = get_openstack_param_value(plan, 'Ceph-Storage-1::Flavor')
      @deployment.openstack_overcloud_ceph_storage_count = get_openstack_param_value(plan, 'Ceph-Storage-1::Flavor')
      @deployment.openstack_overcloud_cinder_storage_flavor = get_openstack_param_value(plan, 'Cinder-Storage-1::Flavor')
      @deployment.openstack_overcloud_cinder_storage_count = get_openstack_param_value(plan, 'Cinder-Storage-1::Flavor')
      @deployment.openstack_overcloud_swift_storage_flavor = get_openstack_param_value(plan, 'Swift-Storage-1::Flavor')
      @deployment.openstack_overcloud_swift_storage_count = get_openstack_param_value(plan, 'Swift-Storage-1::Flavor')

      @deployment.save(:validate => false)
    end
  end
end
