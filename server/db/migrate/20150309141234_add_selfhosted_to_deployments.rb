class AddSelfhostedToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :ovirt_is_self_hosted, :boolean, :default => false
    add_column :fusor_deployments, :ovirt_engine_admin_password, :string
  end
end
