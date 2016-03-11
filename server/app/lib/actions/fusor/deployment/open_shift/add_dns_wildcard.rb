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
      module OpenShift
        class AddDnsWildcard < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.debug '====== AddDnsWildcard run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            master = {"name" => "master",
                      "ip"   =>
                      "hostgroup_id" => hg_id,
                      "location_id" => 1,
                      "organization_id" => deployment["organization_id"],
                      "build" => "1",
                      "enabled" => "1",
                      "compute

            subdomain = Net::DNS::ARecord.new(:ip => ose_master.ip,
                                              :hostname => "*.#{openshift_subdomain_name}.#{Domain.find(Host.find(ose_master.domain_id).name}",
                                              :proxy => Domain.find(1).proxy)
            subdomain.create
            Rails.logger.debug '=== Leaving AddOspHostnames run method ==='
          end

        end
      end
    end
  end
end
