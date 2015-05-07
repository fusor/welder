module Fusor
  class DeploymentSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :name, :description,
               :deploy_ovirt, :deploy_cfme, :deploy_openstack,
               :ovirt_engine_admin_password,
               :ovirt_database_name, :ovirt_cluster_name, :ovirt_storage_name,
               :ovirt_storage_type, :ovirt_storage_address, :ovirt_cpu_type, :ovirt_share_path,
               :ovirt_is_self_hosted, :cfme_install_loc, :foreman_task_uuid,
               :created_at, :updated_at
    has_one :organization, serializer: ::OrganizationSerializer
    has_one :lifecycle_environment, serializer: ::LifecycleEnvironmentSerializer
    # has one engine
    has_one :discovered_host, serializer: ::HostSerializer
    # has many hypervisors
    has_many :discovered_hosts, serializer: ::HostSerializer

  end
end
