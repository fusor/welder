import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);

    var isOvirt = this.controllerFor('deployment').get('isOvirt');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isOvirt && !(isOpenStack)) {
      this.controllerFor('where-install').set('disableOvirt', false);
      this.controllerFor('where-install').set('disableOpenStack', true);
      return this.controllerFor('deployment').set('cfme_install_loc', 'Ovirt');
    } else if (!(isOvirt) && isOpenStack) {
      this.controllerFor('where-install').set('disableOvirt', true);
      this.controllerFor('where-install').set('disableOpenStack', false);
      return this.controllerFor('deployment').set('cfme_install_loc', 'OpenStack');
    } else {
      this.controllerFor('where-install').set('disableOvirt', false);
      this.controllerFor('where-install').set('disableOpenStack', false);
    }
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

});
