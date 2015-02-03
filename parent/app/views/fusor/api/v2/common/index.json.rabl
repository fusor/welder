collection @deployments


extends("fusor/api/v2/%s/show" % controller_name)

#child @deployments[:results] => :results do
#  extends("fusor/api/v2/%s/show" % controller_name)
#end
