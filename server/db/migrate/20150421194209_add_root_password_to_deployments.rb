class AddRootPasswordToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :root_password, :string
  end
end
