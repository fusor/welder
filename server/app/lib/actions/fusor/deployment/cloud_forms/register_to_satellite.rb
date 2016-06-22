#
# Copyright 2016 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
require 'stringio'

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class RegisterToSatellite < Actions::Fusor::FusorBaseAction

          def humanized_name
            _("Register CloudForms Appliance to Satellite")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ RegisterToSatellite run method ===================="
            begin

              ::Fusor.log.info("Registering to Satellite")

              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              ssh_user = "root"
              ssh_password = deployment.cfme_root_password

              cfme_address = deployment.cfme_address
              @success = false
              @retry = false
              @retries = 30
              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(cfme_address, ssh_user, ssh_password)
              client.on_complete(lambda { register_to_satellite_completed })
              client.on_failure(lambda { register_to_satellite_failed })
              cmd = "rpm -ivh http://#{::SmartProxy.first.hostname}/pub/katello-ca-consumer-latest.noarch.rpm ;
                     subscription-manager register --org='Default_Organization' --name='#{deployment.cfme_hostname}' --activationkey='#{get_activation_key(deployment, 'Cloudforms')}'"
              client.execute(cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

              # retry if necessary
              sleep_seconds = 30
              while !@success && @retry
                ::Fusor.log.info "RegisterToSatellite will retry again in #{sleep_seconds} seconds."

                # pause for station identification, actually pausing to give
                # cfme time to start ssh or whatever caused the original timeout
                # to be ready for use
                sleep sleep_seconds

                @io = StringIO.new
                client.execute(cmd, @io)
                if !@success
                  @io.close unless @io.closed?
                end
              end
            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to register to Satellite on appliance. Error message: #{e.message}")
            else
              if !@success && @retries <= 0
                fail _("Failed to register to Satellite on appliance. Retries exhausted. Error: #{@io.string}")
              elsif !@success
                fail _("Failed to register to Satellite on appliance. Unhandled error: #{@io.string}")
              end
            ensure
              @io.close if @io && !@io.closed?
            end
            ::Fusor.log.debug "================ Leaving RegisterToSatellite run method ===================="
          end

          def register_to_satellite_completed
            ::Fusor.log.debug "=========== completed entered ============="
            if @io.string.include? "The system has been registered with ID: "
              @success = true
              @retry = false
              ::Fusor.log.info "Appliance registered successfully. #{@io.string}"
            else
              @success = false
              ::Fusor.log.error "Appliance was not registered. Error: #{@io.string}"
            end
            ::Fusor.log.debug "=========== completed exited ============="
          end

          def register_to_satellite_failed
            ::Fusor.log.debug "=========== failed entered ============="
            @retries -= 1
            if !@success && @retries >= 0
              @retry = true
            else
              @retry = false
              # SSH connection assumes if something is written to stderr it's a
              # problem. We only care about that if we actually failed.
              ::Fusor.log.error "Probable error. Will we retry? #{@retry}. Error message: #{@io.string}"
            end
            ::Fusor.log.debug "=========== failed exited ============="
          end

          def get_activation_key(deployment, hostgroup_name)
            parent = ::Hostgroup.where(:name => deployment.label).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first

            # generate the ancestry, so that we can locate the hostgroups based on the hostgroup hierarchy, which assumes:
            # "Fusor Base"/"My Deployment"
            # Note: there may be a better way in foreman to locate the hostgroup
            if parent
              if parent.ancestry
                ancestry = [parent.ancestry, parent.id.to_s].join('/')
              else
                ancestry = parent.id.to_s
              end
            end

            # locate the engine hostgroup...
            cfme_hostgroup = ::Hostgroup.where(:name => hostgroup_name).
                where(:ancestry => ancestry).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first

            cfme_hostgroup.group_parameters.where(:name => 'kt_activation_keys').first.value
          end
        end
      end
    end
  end
end
