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
      module Rhev
        class Deploy < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Deploy Red Hat Enterprise Virtualization")
          end

          def plan(deployment)
            super(deployment)

            if deployment.rhev_is_self_hosted
              require 'apipie-bindings'
              @foreman = ApipieBindings::API::new({:uri => 'https://sat61devg.example.com', :username => 'admin', :password => 'changeme'})
              host = {
                :name => 'rhevm',
                :environment_id => 1, # deployment.rhev_engine_host.environment_id,
                :location_id => 1, # deployment.rhev_engine_host.location_id,
                :organization_id => 1, # deployment.rhev_engine_host.organization_id,
                :root_pass =>  'dog8code', # deployment.rhev_root_password,
                :subnet_id => @foreman.resource(:subnets).action(:show).call({:id => 'default', :encoding => 'utf-8'})['id'],
                :mac => '00:11:22:33:44:55',
                :architecture_id => 1,
                :domain_id => 1,
                :puppet_proxy_id => 1,
                :operatingsystem_id => 3,
                :ptable_id => 7,
                :medium_id => 7,
                :build => 0
              }
              response = @foreman.resource(:hosts).action(:create).call({:host => host, :encoding => 'utf-8'})
              fail _("Unable to locate a RHEV Hypervisor Host") unless deployment.rhev_engine_host
              # Do self-hosted stuff
              sequence do
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Self-hosted",
                            deployment.rhev_engine_host)
                concurrence do
                  plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                              deployment.rhev_engine_host)
                end
              end
            else
              fail _("Unable to locate a RHEV Engine Host") unless deployment.rhev_engine_host
              sequence do
                deployment.discovered_hosts.each do |host|
                  plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                              deployment,
                              "RHEV-Hypervisor",
                              host)
                end

                concurrence do
                  deployment.discovered_hosts.each do |host|
                    plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                                host)
                  end
                end

                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Engine",
                            deployment.rhev_engine_host)

                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            deployment.rhev_engine_host)

              end
            end
            plan_action(::Actions::Fusor::Deployment::Rhev::WaitForDataCenter,
                          deployment)

            plan_action(::Actions::Fusor::Deployment::Rhev::CreateCr, deployment)

          end

          private

          def hosts_to_provision(deployment)
            deployment.discovered_hosts + [deployment.rhev_engine_host]
          end
        end
      end
    end
  end
end
