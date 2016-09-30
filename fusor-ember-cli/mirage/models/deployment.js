import { Model, hasMany, belongsTo} from 'ember-cli-mirage';

export default Model.extend({
  organization: belongsTo(),
  lifecycleEnvironment: belongsTo(),
  discoveredHost: belongsTo(),
  foremanTask: belongsTo(),
  openstackDeployment: belongsTo(),

  discoveredHosts: hasMany(),
  subscriptions: hasMany(),
  introspectionTasks: hasMany(),
  openshiftHosts: hasMany()

});
