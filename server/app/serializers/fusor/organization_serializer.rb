module Fusor
  class OrganizationSerializer < ActiveModel::Serializer

    type :organizations

    attributes :id, :name

  end
end
