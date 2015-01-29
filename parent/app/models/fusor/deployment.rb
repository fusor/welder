module Fusor
  class Deployment < ActiveRecord::Base
    serialize :params, Hash
  end
end
