import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model: function () {
    return this.modelFor('deployment-new').get('organization');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    this.store.find('organization').then(function(results) {
      controller.set('organizations', results);
      if (results.get('length') === 1) {
        var defaultOrg = results.get('firstObject');
        controller.set('organization', defaultOrg);
        controller.set('selectedOrganization', defaultOrg);
      }
    });
  }

});
