import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  organization: DS.belongsTo('organization', {async: true}),
  lifecycle_environment: DS.belongsTo('lifecycle-environment', {async: true}),
  foreman_task_uuid: DS.attr('string'),

  deploy_ovirt: DS.attr('boolean'),
  deploy_cfme: DS.attr('boolean'),
  deploy_openstack: DS.attr('boolean'),

  ovirt_is_self_hosted: DS.attr('boolean'),

  ovirt_engine_admin_password: DS.attr('string'),
  ovirt_database_name: DS.attr('string'),
  ovirt_cluster_name: DS.attr('string'),
  ovirt_storage_name: DS.attr('string'),
  ovirt_storage_type: DS.attr('string'),
  ovirt_storage_address: DS.attr('string'),
  ovirt_cpu_type: DS.attr('string'),
  ovirt_share_path: DS.attr('string'),

  cfme_install_loc: DS.attr('string'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  useDefaultOrgViewForEnv: function() {
    return !!(this.get('discovered_host.id'));
  }.property('discovered_host'),

  // has one Engine
  discovered_host: DS.belongsTo('discovered-host', {inverse: 'deployment', async: true}),

  // has many Hypervisors
  discovered_hosts: DS.hasMany('discovered-host', {inverse: 'deployments', async: true}),

});
