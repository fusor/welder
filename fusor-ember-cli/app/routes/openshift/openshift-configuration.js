import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    if (Ember.isEmpty(model.get('openshift_storage_type'))) {
      model.set('openshift_storage_type', 'NFS');
    }
    if (Ember.isEmpty(model.get('openshift_username'))) {
      model.set('openshift_username', 'cloudsuite-install');
    }
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
