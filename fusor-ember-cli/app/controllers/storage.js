import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  ovirt_storage_type: Ember.computed.alias("controllers.deployment.ovirt_storage_type"),
  ovirt_storage_address: Ember.computed.alias("controllers.deployment.ovirt_storage_address"),
  ovirt_share_path: Ember.computed.alias("controllers.deployment.ovirt_share_path"),
  step3RouteName: Ember.computed.alias("controllers.deployment.step3RouteName"),

  isNFS: function() {
    return (this.get('ovirt_storage_type') === 'NFS');
  }.property('ovirt_storage_type'),

});
