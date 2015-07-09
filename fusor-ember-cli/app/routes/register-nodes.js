import Ember from 'ember';

export default Ember.Route.extend({

  // Maybe this taste, but I would probably do this
  model: function () {
      return this.store.find('node');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('profiles', this.store.find('flavor'));
    controller.set('showAlertMessage', false);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
