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

require 'fog'

module Actions
  module Fusor
    module Deployment
      module Rhev
        # Create a RHEV Engine Host Record
        class CreateEngineHostRecord < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Create Host Record for RHEV Engine for self-hosted')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== CreateEngineHostRecord run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            # ignoring return value for now
            create_host(deployment)
            ::Fusor.log.debug '====== Leaving CreateEngineHostRecord run method ======'
          end

          private

          def create_host(deployment)
            rhevm = {"name" => "#{deployment.label.tr('_', '-')}-rhev-engine",
                    "location_id" => Location.find_by_name('Default Location').id,
                    "environment_id" => Environment.where(:katello_id => "Default_Organization/Library/Fusor_Puppet_Content").first.id,
                    "organization_id" => deployment["organization_id"],
                    "subnet_id" => Subnet.find_by_name('default').id,
                    "enabled" => "1",
                    "managed" => "1",
                    "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                    "operatingsystem_id" => Operatingsystem.find_by_title('RedHat 7.1')['id'],
                    "ptable_id" => Ptable.find { |p| p["name"] == "Kickstart default" }.id,
                    "domain_id" => 1,
                    "root_pass" => deployment.rhev_root_password,
                    "mac" => "00:11:22:33:44:55",
                    "build" => "0"}
            host = ::Host.create(rhevm)

            if host.errors.empty?
              ::Fusor.log.info 'RHEV Engine Host Record Created'
              return host
            else
              fail _('RHEV Engine Host Record creation failed')
            end
          end
        end
      end
    end
  end
end
