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

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class RunApplianceConsole < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Run CloudForms Appliance Console")
          end

          def plan(deployment, vm_ip)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      vm_ip: vm_ip)
          end

          def run
            #Rails.logger.info "================ RunApplianceConsole run method ===================="
            ::Fusor.log.info "================ RunApplianceConsole run method ===================="

            script_dir = "/usr/share/fusor_ovirt/bin/"
            db_password = "changeme" # TODO: we may want to make this configurable in the future
            ssh_user = "root"

            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            #
            # JWM 6/9/2015, We are not yet setting the CloudForms VM root password
            # We need to use the default password of 'smartvm' until we add support.
            #
            #ssh_password = "smartvm" # TODO: need to update to use deployment.cfme_root_password; however, that means it must also be set on VM during/after creation
            #Rails.logger.warn "XXX using cfme_root_password"
            ::Fusor.log.warn "XXX using cfme_root_password"
            ssh_password = deployment.cfme_root_password

            cmd = "#{script_dir}miq_run_appliance_console.py "\
                "--miq_ip #{input[:vm_ip]} "\
                "--ssh_user #{ssh_user} "\
                "--ssh_pass #{ssh_password} "\
                "--db_password #{db_password}"

            status, output = run_command(cmd)
            fail _("Unable to run appliance console: %{output}") % { :output => output.join('; ') } unless status == 0

            # TODO: observing issues with running the appliance console using SSHConnection; therefore, temporarily
            # commenting out and using the approach above which will run it from a python script
            #client = Utils::Fusor::SSHConnection.new(input[:vm_ip], ssh_user, ssh_password)
            #client.on_complete(lambda { run_appliance_console_completed })
            #client.on_failure(lambda { run_appliance_console_failed })
            #cmd = "appliance_console_cli --region 1 --internal --force-key -p #{db_password} --verbose"
            #client.execute(cmd)

            #Rails.logger.info "================ Leaving RunApplianceConsole run method ===================="
            ::Fusor.log.info "================ Leaving RunApplianceConsole run method ===================="
          end

          # TODO: temporarily commenting out the SSHConnection callbacks.  See above.
          #def run_appliance_console_completed
          #  Rails.logger.warn "XXX the appliance console successfully ran on the node"
          #  puts "XXX the appliance console successfully ran on the node"
          #  sleep 300 # TODO: pause while the appliance web ui comes up...
          #end
          #
          #def run_appliance_console_failed
          #  fail _("Failed to run appliance console")
          #end

          private

          def run_command(cmd)
            #Rails.logger.info "Running: #{cmd}"
            ::Fusor.log.info "Running: #{cmd}"
            status, output = Utils::Fusor::CommandUtils.run_command(cmd)
            #Rails.logger.debug "Status: #{status}, output: #{output}"
            ::Fusor.log.debug "Status: #{status}, output: #{output}"
            return status, output
          end
        end
      end
    end
  end
end
