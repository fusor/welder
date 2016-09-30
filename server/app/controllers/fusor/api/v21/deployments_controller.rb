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
require "sys/filesystem"
require "uri"
require "json"
require 'fusor/password_filter'
require 'fusor/deployment_logger'

module Fusor
  class Api::V21::DeploymentsController < Api::V21::BaseController

    before_filter :find_deployment, :only => [:destroy, :show, :update, :check_mount_point,
                                              :deploy, :redeploy, :validate, :log,
                                              :openshift_disk_space, :compatible_cpu_families]

    rescue_from Encoding::UndefinedConversionError, :with => :ignore_it

    def index
      @deployments = Deployment.includes(:organization, :lifecycle_environment, :discovered_host,
                                         :discovered_hosts, :ose_master_hosts, :ose_worker_hosts, :subscriptions,
                                         :introspection_tasks, :foreman_task, :openstack_deployment)
                                .search_for(params[:search], :order => params[:order]).by_id(params[:id])
                                .paginate(:page => params[:page])
      cnt_search = Deployment.search_for(params[:search], :order => params[:order]).count
      render :json => @deployments,
             :include => [:organization, :lifecycle_environment, :discovered_host,
                                         :discovered_hosts, :ose_master_hosts, :ose_worker_hosts, :subscriptions,
                                         :introspection_tasks, :foreman_task, :openstack_deployment],
             :each_serializer => Fusor::DeploymentSerializer,
             :meta => {:total => cnt_search,
                       :page => params[:page].present? ? params[:page].to_i : 1,
                       :total_pages => (cnt_search / 20.0).ceil
                      }
    end

    def show
      render :json => @deployment,
                          :include => [:organization, :lifecycle_environment, :discovered_host,
                                         :discovered_hosts, :ose_master_hosts, :ose_worker_hosts, :subscriptions,
                                         :introspection_tasks, :foreman_task, :openstack_deployment],
             :serializer => Fusor::DeploymentSerializer
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

        save_deployment_attributes

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
          @deployment.foreman_task_uuid = task.id
          @deployment.save
        end

        raise "ManageManifest task failed" unless task

        render :json => @deployment, :serializer => Fusor::DeploymentSerializer
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
      @deployment.valid?
      error_messages = @deployment.errors.full_messages
      error_messages += @deployment.openstack_deployment.errors.full_messages if @deployment.deploy_openstack?
      warning_messages = @deployment.warnings
      warning_messages += @deployment.openstack_deployment.warnings if @deployment.deploy_openstack?

      render json: {
        :validation => {
          :deployment_id => @deployment.id,
          :errors => error_messages,
          :warnings => warning_messages
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

    def compatible_cpu_families
      rhv_hypervisors = @deployment.discovered_hosts
      cpu_families = Utils::Fusor::CpuCompatDetector.rhv_cpu_families(rhv_hypervisors)
      render json: cpu_families, status: 200
    end


    def check_mount_point
      mount_address = params['address']
      mount_path = params['path']
      mount_type = params['type']

      begin
        mount_result = mount_storage(mount_address, mount_path, mount_type)
        render json: { :mounted => true, :is_empty => mount_result[:is_empty] }, status: 200
      rescue
        render json: { :mounted => false, :is_empty => false }, status: 200
      end
    end

    # mount_storage will return in megabytes the amount of free space left on the storage mount
    def mount_storage(address, path, type)
      deployment_id = @deployment.id
      if type == "GFS"
        type = "glusterfs"
      else
        type = "nfs"
      end

      cmd = "sudo safe-mount.sh '#{deployment_id}' '#{address}' '#{path}' '#{type}'"
      status, _output = Utils::Fusor::CommandUtils.run_command(cmd)

      raise 'Unable to mount NFS share at specified mount point' unless status == 0

      files = Dir["/tmp/fusor-test-mount-#{deployment_id}/*"]

      stats = Sys::Filesystem.stat("/tmp/fusor-test-mount-#{deployment_id}")
      mb_available = stats.block_size * stats.blocks_available / 1024 / 1024

      Utils::Fusor::CommandUtils.run_command("sudo safe-umount.sh #{deployment_id}")
      return {
        :mb_available => mb_available,
        :is_empty => files.size == 0
      }
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

    def openshift_disk_space
      # Openshift deployments need to know how much disk space is available on the NFS storage pool
      # This method mounts the specifed NFS share and gets the available disk space
      address = @deployment.rhev_storage_address
      path = @deployment.rhev_share_path
      storage_type = @deployment.rhev_storage_type

      begin
        mount_response = mount_storage(address, path, storage_type)
        render json: { :openshift_disk_space => mount_response[:mb_available]}, status: 200
      rescue Exception => error
        message = 'Unable to retrieve Openshift disk space'
        message = error.message if error.respond_to?(:message)

        render json: { :error => message}, status: 500
      end
    end

    def resource_name
      'deployment'
    end

    private

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
              :description, :rhev_is_self_hosted, :rhev_self_hosted_engine_hostname, :rhev_engine_admin_password, :foreman_task_uuid,
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

    def find_deployment
      id = params[:deployment_id] || params[:id]
      not_found and return false if id.blank?
      @deployment = Deployment.includes(:organization, :lifecycle_environment, :discovered_host, :discovered_hosts,
                                        :ose_master_hosts, :ose_worker_hosts, :subscriptions, :introspection_tasks,
                                        :foreman_task, :openstack_deployment).find(id)
    end

    def ignore_it
      true
    end

    def create_log_reader(log_type_param)
      case log_type_param
        when 'fusor_log'
          ::Fusor::Logging::FusorLogReader.new
        when 'foreman_log'
          ::Fusor::Logging::ForemanLogReader.new
        when 'candlepin_log'
          ::Fusor::Logging::JavaLogReader.new
        when 'foreman_proxy_log'
          ::Fusor::Logging::ProxyLogReader.new
        when 'foreman_proxy_log'
          ::Fusor::Logging::ProxyLogReader.new
        when 'ansible_log'
          ::Fusor::Logging::AnsibleLogReader.new
        else
          ::Fusor::Logging::LogReader.new
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
          File.join(dir, "var/log/foreman/#{Rails.env}.log")
        when 'foreman_proxy_log'
          File.join(dir, 'var/log/foreman-proxy/proxy.log')
        when 'ansible_log'
          File.join(dir, 'ansible.log')
        else
          ::Fusor.log_file_path(@deployment.label, @deployment.id)
      end
    end
  end
end
