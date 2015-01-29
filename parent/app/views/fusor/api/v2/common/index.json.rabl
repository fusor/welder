collection @collection

#extends "fusor/api/v2/common/metadata"

child @collection[:results] => :results do
  extends("fusor/api/v2/%s/show" % controller_name)
end
