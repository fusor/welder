class RemoveEngineHostname < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :ovirt_engine_hostname
  end

  def down
    add_column :fusor_deployments, :ovirt_engine_hostname, :string
  end
end
