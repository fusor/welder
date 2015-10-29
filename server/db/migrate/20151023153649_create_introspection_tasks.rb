class CreateIntrospectionTasks < ActiveRecord::Migration
  def change
    create_table :fusor_introspection_tasks do |t|
      t.belongs_to :deployment, index: true
      t.string :task_id
    end
  end
end
