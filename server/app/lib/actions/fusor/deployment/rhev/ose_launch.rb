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
require 'securerandom'

module Actions
  module Fusor
    module Deployment
      module Rhev
        #Setup and Launch OSE VM
        class OseLaunch < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Setup and Launch OSE VM')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          # rubocop:disable MethodLength
          # rubocop:disable AbcSize
          def run
            ::Fusor.log.info '====== OSE Launch run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            generate_root_password(deployment)
            repos = SETTINGS[:fusor][:content][:openshift].map { |p| p[:repository_set_label] if p[:repository_set_label] =~ /rpms$/ }.compact

            generate_vars(deployment)
          end

          private

          def generate_vars(deployment)
            return {
              :foo => 'bar',
              :vms => get_ose_vms(deployment)
            }
          end

          def get_ose_vms(deployment)
            ose_vms_to_create = []
            bootable_image_path = '/usr/share/rhel-guest-image-7/rhel-guest-image-7.3-32.x86_64.qcow2'
            hostgroup = find_hostgroup(deployment, 'OpenShift')

            common_host_params = {
              :hostgroup_id => hostgroup.id,
              :location_id => Location.find_by_name('Default Location').id,
              :environment_id => Environment.where(:name => "production").first.id,
              :organization_id => deployment["organization_id"],
              :subnet_id => Subnet.find_by_name('default').id,
              :enabled => "1",
              :managed => "1",
              :architecture_id => Architecture.find_by_name('x86_64')['id'],
              :operatingsystem_id => hostgroup.os.id,
              :ptable_id => Ptable.find { |p| p["name"] == "Kickstart default" }.id,
              :domain_id => 1,
              :root_pass => deployment.openshift_root_password,
              :build => "0",
              :provider => deployment.openshift_install_loc
            }

            def create_satellite_host_entry(hostname, mac)
              unique_host_params = {
                :hostname => hostname,
                :mac => mac
              }

              host_params = common_host_params.merge(unique_host_params)
              host = ::Host.create(host_params)

              unless host.errors.empty?
                fail _("OCP Node Host Record creation with mac #{mac} and hostname #{hostname} failed with errors: #{host.errors.messages}")
              end

              return host
            end

            def create_ose_vm_hostname(deployment, vm_tag)
              # vm_tag is an identifier such as ose-master or ose-node
              return "#{deployment.label.tr('_', '-')}-#{vm_tag}#{i}"
            end

            def create_ose_vm_definition(vm_params, index)
              ose_vm = {
                :name => vm_params[:hostname],
                :memory => vm_params[:memory].to_s + "MiB",
                :cpus => vm_params[:cpus],
                :disks => [
                  {
                    :name => "#{deployment.label.tr('_', '-')}-#{vm_params[:disk_tag]}#{index}-disk1",
                    :size => bootable_size,
                    :image_path => bootable_image_path,
                    :bootable => "True"
                  },
                  {
                    :name => "#{deployment.label.tr('_', '-')}-#{vm_params[:disk_tag]}#{index}-disk#{index+2}",
                    :size => vm_params[:storage_size],
                  }
                ],
                :nic => {
                  :boot_protocol => "dhcp",
                  :mac => vm_params[:mac]
                }
              }
              return ose_vm
            end

            # ===================
            # CREATE MASTER NODES
            # ===================
            for i in 1..deployment.openshift_number_master_nodes do
              vm_tag = "ose-master"
              hostname = create_ose_hostname(deployment, vm_tag)
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses

              # Create Satellite host entry
              create_satellite_host_entry(hostname, mac)

              # Arrange parameters so that Ansible can create OSE VM's
              vm_params = {
                  :hostname => hostname,
                  :mac => mac,
                  :memory => deployment.openshift_master_ram,
                  :cpus => deployment.openshift_master_vcpu,
                  :vda_size => deployment.openshift_master_disk,
                  :storage_size => deployment.openshift_storage_size,
                  :disk_tag => vm_tag
              }

              ose_vm = create_ose_vm_definition(vm_params, i)
              ose_vms_to_create << ose_vm
            end

            # ===================
            # CREATE WORKER NODES
            # ===================
            for i in 1..deployment.openshift_number_worker_nodes do
              vm_tag = "ose-node"
              hostname = create_ose_hostname(deployment, vm_tag)
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses

              # Create Satellite host entry
              create_satellite_host_entry(hostname, mac)

              # Arrange parameters so that Ansible can create OSE VM's
              vm_params = {
                  :hostname => hostname,
                  :mac => mac,
                  :memory => deployment.openshift_node_ram,
                  :cpus => deployment.openshift_node_vcpu,
                  :vda_size => deployment.openshift_node_disk,
                  :storage_size => deployment.openshift_storage_size,
                  :disk_tag => vm_tag
              }

              ose_vm = create_ose_vm_definition(vm_params, i)
              ose_vms_to_create << ose_vm
            end

            # ==================
            # CREATE INFRA NODES
            # ==================
            for i in 1 + deployment.openshift_number_worker_nodes..deployment.openshift_number_infra_nodes + deployment.openshift_number_worker_nodes do
              vm_tag = "ose-node"
              hostname = create_ose_hostname(deployment, vm_tag)
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses

              # Create Satellite host entry
              create_satellite_host_entry(hostname, mac)

              # Arrange parameters so that Ansible can create OSE VM's
              vm_params = {
                  :hostname => hostname,
                  :mac => mac,
                  :memory => deployment.openshift_node_ram,
                  :cpus => deployment.openshift_node_vcpu,
                  :vda_size => deployment.openshift_node_disk,
                  :storage_size => deployment.openshift_storage_size,
                  :disk_tag => vm_tag
              }

              ose_vm = create_ose_vm_definition(vm_params, i)
              ose_vms_to_create << ose_vm
            end

            # ===============
            # CREATE HA NODES
            # ===============
            for i in 1..deployment.openshift_number_ha_nodes do
              vm_tag = "ose-ha"
              hostname = create_ose_hostname(deployment, vm_tag)
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses

              # Create Satellite host entry
              create_satellite_host_entry(hostname, mac)

              # Arrange parameters so that Ansible can create OSE VM's
              vm_params = {
                  :hostname => hostname,
                  :mac => mac,
                  :memory => deployment.openshift_node_ram,
                  :cpus => deployment.openshift_node_vcpu,
                  :vda_size => deployment.openshift_node_disk,
                  :storage_size => deployment.openshift_storage_size,
                  :disk_tag => vm_tag
              }

              ose_vm = create_ose_vm_definition(vm_params, i)
              ose_vms_to_create << ose_vm
            end

            return ose_vms_to_create
          end

          def find_hostgroup(deployment, name)
            # locate the top-level hostgroup for the deployment...
            # currently, we'll create a hostgroup with the same name as the
            # deployment...
            # Note: you need to scope the query to organization
            parent = ::Hostgroup.where(:name => deployment.label).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first

            # generate the ancestry, so that we can locate the hostgroups
            # based on the hostgroup hierarchy, which assumes:
            #  "Fusor Base"/"My Deployment"
            # Note: there may be a better way in foreman to locate the hostgroup
            if parent
              if parent.ancestry
                ancestry = [parent.ancestry, parent.id.to_s].join('/')
              else
                ancestry = parent.id.to_s
              end
            end

            # locate the engine hostgroup...
            ::Hostgroup.where(:name => name).
                where(:ancestry => ancestry).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first
          end

          def generate_root_password(deployment)
            ::Fusor.log.info '====== Generating randomized password for root access ======'
            deployment.openshift_root_password = SecureRandom.hex(10)
            deployment.save!
          end

        end
      end
    end
  end
end
