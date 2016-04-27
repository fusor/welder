module Fusor
  class ForemanTaskSerializer < ActiveModel::Serializer

    type :foreman_tasks

    attributes :id, :type, :label, :started_at, :ended_at, :state, :result,
               :external_id, :parent_task_id

  end
end
