import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  // Maybe this taste, but I would probably do this depending on which object is the "main"
  model: function () {
    return this.store.find('deployment-plan', 'overcloud');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('nodes', this.store.find('node'));
    controller.set('profiles', this.store.find('flavor'));
  },

});
