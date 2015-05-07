class CreateDeployments < ActiveRecord::Migration
  def change
    create_table :fusor_deployments do |t|
      t.string :name,                      :null => false
      t.integer :lifecycle_environment_id, :null => false
      t.integer :organization_id,          :null => false
      t.boolean :deploy_ovirt,              :default => false
      t.boolean :deploy_cfme,              :default => false
      t.boolean :deploy_openstack,         :default => false
      t.integer :ovirt_hypervisor_host_id
      t.integer :ovirt_engine_host_id
      t.string :ovirt_hypervisor_hostname
      t.string :ovirt_engine_hostname
      t.string :ovirt_database_name
      t.string :ovirt_cluster_name
      t.string :ovirt_storage_name
      t.string :ovirt_storage_type
      t.string :ovirt_storage_address
      t.string :ovirt_cpu_type
      t.string :ovirt_share_path
      t.string :cfme_install_loc

      t.timestamps
    end
  end
end
