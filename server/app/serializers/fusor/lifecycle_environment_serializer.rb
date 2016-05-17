module Fusor
  class LifecycleEnvironmentSerializer < ActiveModel::Serializer

    type :lifecycle_environments

    attributes :id, :name

  end
end
