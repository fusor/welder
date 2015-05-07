class RemoveHypervisorFromDeployments < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :ovirt_hypervisor_hostname
    remove_column :fusor_deployments, :ovirt_hypervisor_host_id
  end

  def down
    add_column :fusor_deployments, :ovirt_hypervisor_hostname, :string
    add_column :fusor_deployments, :ovirt_hypervisor_host_id, :string
  end
end
