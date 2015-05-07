import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('allDiscoveredHosts', this.store.find('discovered-host'));
  },

  deactivate: function() {
    var model = this.modelFor('deployment')
    return this.send('saveHyperVisors', null);
  },

  actions: {
    saveHyperVisors: function(redirectPath) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var hypervisorModelIds = this.controllerFor('hypervisor/discovered-host').get('hypervisorModelIds');
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/fusor/api/v21/deployments/' + deployment.get('id'),
            type: "PUT",
            data: JSON.stringify({'deployment': { 'discovered_host_ids': hypervisorModelIds } }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
              if (redirectPath) {
                self.transitionTo('ovirt-options');
              }
            },

            error: function(response){
              reject(response);
            }
        });
      });
    }
  }

});
