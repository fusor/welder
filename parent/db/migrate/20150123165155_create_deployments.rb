class CreateDeployments < ActiveRecord::Migration
  def change
    create_table :fusor_deployments do |t|
      t.text :params

      t.timestamps
    end
  end
end
