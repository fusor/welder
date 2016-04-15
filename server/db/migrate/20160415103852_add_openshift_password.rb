class AddOpenshiftPassword < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openshift_userpass, :string
  end
end
