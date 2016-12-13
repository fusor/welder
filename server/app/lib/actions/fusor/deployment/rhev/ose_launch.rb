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
            # ==============================================================
            # CREATE NEW SATELLITE HOST RECORDS WITH MAC ADDRESSES AND NAMES
            # ==============================================================
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

            ose_vms_to_create = []

            # ===================
            # CREATE MASTER NODES
            # ===================
            for i in 1..deployment.openshift_number_master_nodes do
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses
              hostname = "#{deployment.label.tr('_', '-')}-ose-master#{i}"

              # Create Satellite host entry
              unique_host_params = {
                :mac => mac,
                :hostname => hostname
              }

              host_params = common_host_params.merge(unique_host_params)
              host = ::Host.create(host_params)

              unless host.errors.empty?
                fail _("OSE Master Node Host Record creation with mac #{mac} failed with errors: #{host.errors.messages}")
              end

              # Arrange parameters so that Ansible can create OSE VM's
              ose_vm = {
                :name => hostname,
                :memory => deployment.openshift_master_ram.to_s + "MiB",
                :cpus => deployment.openshift_master_vcpu,
                :disks => [{
                  :name => "#{deployment.label.tr('_', '-')}-ose-master1-disk1",
                  :size => deployment.openshift_master_disk,
                  :image_path => bootable_image_path,
                  :bootable => "True"
                }],
                :nic => {
                  :boot_protocol => "dhcp",
                  :mac => mac
                }
              }

              # Create additional N disks
              [deployment.openshift_storage_size].each_with_index do |disk_size, index|
                ose_vm[:disks] << {
                  :name => "#{deployment.label.tr('_', '-')}-ose-master1-disk#{index+2}",
                  :size => disk_size,
                }
              end

              ose_vms_to_create << ose_vm
            end

            # ===================
            # CREATE WORKER NODES
            # ===================
            for i in 1..deployment.openshift_number_worker_nodes do
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses
              hostname = "#{deployment.label.tr('_', '-')}-ose-node#{i}"

              # Create Satellite host entry
              unique_host_params = {
                :mac => mac,
                :hostname => hostname
              }

              host_params = common_host_params.merge(unique_host_params)
              host = ::Host.create(host_params)

              unless host.errors.empty?
                fail _("OSE Worker Node Host Record creation with mac #{mac} failed with errors: #{host.errors.messages}")
              end

              # Arrange parameters so that Ansible can create OSE VM's
              ose_vm = {
                :name => hostname,
                :memory => deployment.openshift_node_ram.to_s + "MiB",
                :cpus => deployment.openshift_node_vcpu,
                :disks => [{
                  :name => "#{deployment.label.tr('_', '-')}-ose-node#{i}-disk1",
                  :size => deployment.openshift_node_disk,
                  :image_path => bootable_image_path,
                  :bootable => "True"
                }],
                :nic => {
                  :boot_protocol => "dhcp",
                  :mac => mac
                }
              }

              # Create additional N disks
              [deployment.openshift_storage_size].each_with_index do |disk_size, disk_index|
                ose_vm[:disks] << {
                  :name => "#{deployment.label.tr('_', '-')}-ose-node#{i}-disk#{disk_index+2}",
                  :size => disk_size,
                }
              end

              ose_vms_to_create << ose_vm

            end

            # ==================
            # CREATE INFRA NODES
            # ==================
            for i in 1 + deployment.openshift_number_worker_nodes..deployment.openshift_number_infra_nodes + deployment.openshift_number_worker_nodes do
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses
              hostname = "#{deployment.label.tr('_', '-')}-ose-node#{i}"

              # Create Satellite host entry
              unique_host_params = {
                :mac => mac,
                :hostname => hostname
              }

              host_params = common_host_params.merge(unique_host_params)
              host = ::Host.create(host_params)

              unless host.errors.empty?
                fail _("OSE Infra Node Host Record creation with mac #{mac} failed with errors: #{host.errors.messages}")
              end

              # Arrange parameters so that Ansible can create OSE VM's
              ose_vm = {
                :name => hostname,
                :memory => deployment.openshift_node_ram.to_s + "MiB",
                :cpus => deployment.openshift_node_vcpu,
                :disks => [{
                  :name => "#{deployment.label.tr('_', '-')}-ose-node#{i}-disk1",
                  :size => deployment.openshift_node_disk,
                  :image_path => bootable_image_path,
                  :bootable => "True"
                }],
                :nic => {
                  :boot_protocol => "dhcp",
                  :mac => mac
                }
              }

              # Create additional N disks
              [deployment.openshift_storage_size].each_with_index do |disk_size, disk_index|
                ose_vm[:disks] << {
                  :name => "#{deployment.label.tr('_', '-')}-ose-node#{i}-disk#{disk_index+2}",
                  :size => disk_size,
                }
              end

              ose_vms_to_create << ose_vm
            end

            # ===============
            # CREATE HA NODES
            # ===============
            for i in 1..deployment.openshift_number_ha_nodes do
              mac = Utils::Fusor::MacAddresses.generate_mac_address # TODO generate from pool of safe addresses
              hostname = "#{deployment.label.tr('_', '-')}-ose-node#{i}"

              # Create Satellite host entry
              unique_host_params = {
                :mac => mac,
                :hostname => hostname
              }

              host_params = common_host_params.merge(unique_host_params)
              host = ::Host.create(host_params)

              unless host.errors.empty?
                fail _("OSE HA Node Host Record creation with mac #{mac} failed with errors: #{host.errors.messages}")
              end

              # Arrange parameters so that Ansible can create OSE VM's
              ose_vm = {
                :name => hostname,
                :memory => deployment.openshift_node_ram.to_s + "MiB",
                :cpus => deployment.openshift_node_vcpu,
                :disks => [{
                  :name => "#{deployment.label.tr('_', '-')}-ose-ha#{i}-disk1",
                  :size => deployment.openshift_node_disk,
                  :image_path => bootable_image_path,
                  :bootable => "True"
                }],
                :nic => {
                  :boot_protocol => "dhcp",
                  :mac => mac
                }
              }

              # Create additional N disks
              [deployment.openshift_storage_size].each_with_index do |disk_size, disk_index|
                ose_vm[:disks] << {
                  :name => "#{deployment.label.tr('_', '-')}-ose-ha#{i}-disk#{disk_index+2}",
                  :size => disk_size,
                }
              end
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

          def ensure_vda_only_ptable(ptable_name)
            default_name = "Kickstart default"

            if !Ptable.exists?(:name => default_name)
              fail _("====== The expected '#{default_name}' ptable does not exist! ======")
            end

            if Ptable.exists?(:name => ptable_name)
              ::Fusor.log.debug "====== Partition table '#{ptable_name}' already exists! Nothing to do. ====== "
              return
            end

            defaultptable = Ptable.find_by_name(default_name)
            oseptable = defaultptable.dup

            layoutstring = oseptable.layout.clone
            layoutstring.sub! default_name, ptable_name
            layoutstring.sub! "autopart", "ignoredisk --only-use=vda\nautopart"

            oseptable.layout = layoutstring
            oseptable.name = ptable_name
            oseptable.save!
            ::Fusor.log.debug "====== Created a new Partition table '#{ptable_name}' ====== "
          end

          def update_ptable_for_os(ptable_name, os_name)
            ptable = Ptable.find_by_name(ptable_name)
            if ptable.nil?
              fail _("====== ptable name '#{ptable_name}' does not exist! ======")
            end

            os = Operatingsystem.find_by_to_label(os_name)
            if os.nil?
              fail _("====== OS name '#{os_name}' does not exist! ======")
            end

            if os.ptables.exists?(ptable)
              ::Fusor.log.debug "====== The '#{ptable_name}' ptable already exists as option in '#{os_name}'! Nothing to do. ====== "
              return
            end
            os.ptables << ptable
            os.save!
            ::Fusor.log.debug "====== Added '#{ptable_name}' ptable option to '#{os_name}' ====== "
          end

          def update_hostgroup_ptable(hostgroup, ptable_name)
            ptable = Ptable.find_by_name(ptable_name)
            if ptable.nil?
              fail _("====== ptable name '#{ptable_name}' does not exist! ======")
            end

            if hostgroup.nil?
              fail _("====== Hostgroup is nill ======")
            end
            hostgroup.ptable_id = ptable.id
            hostgroup.save!
            ::Fusor.log.debug "====== Updated host group '#{hostgroup}' to use '#{ptable_name}' ptable ====== "
          end
        end
      end
    end
  end
end
