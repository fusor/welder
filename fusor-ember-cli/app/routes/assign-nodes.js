import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model() {
    var deploymentId = this.modelFor('deployment').get('id');
    return Ember.RSVP.hash({
      plan: this.store.findRecord('deployment-plan', deploymentId),
      images: this.store.query('image', {deployment_id: deploymentId}),
      nodes: this.store.query('node', {deployment_id: deploymentId}),
      profiles: this.store.query('flavor', {deployment_id: deploymentId}),
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    this.updateRoles();
    this.fixBadDefaults();
  },

  actions: {
    updateRoles() {
      this.updateRoles();
    }
  },

  updateRoles() {
    var params, roles, roleParams, controller, unassignedRoles = [], assignedRoles = [];

    controller = this.get('controller');
    params = controller.get('model.plan.parameters');
    roles = controller.get('model.plan.roles');

    if (!params) {
      return;
    }

    roleParams = params.filter(function (param) {
      return !!param.get('id').match(/.*::Flavor/);
    });

    if (!roleParams) {
      return;
    }

    roleParams.forEach(function (rp) {
      var role = roles.find(function (role) {
        return rp.get('id') === role.get('flavorParameterName');
      });

      if (!role) {
        return;
      }

      if (!rp.get('value') || rp.get('value') === 'baremetal') {
        unassignedRoles.pushObject(role);
      } else {
        assignedRoles.pushObject(role);
      }
    });

    controller.set('unassignedRoles', unassignedRoles);
    controller.set('assignedRoles', assignedRoles);
    controller.set('roleParams', roleParams);
  },

  fixBadDefaults() {
    var newParams = [], existingParams = this.get('controller').get('model.plan.parameters');

    if (!existingParams) {
      return;
    }

    existingParams.forEach(function (param) {
      var id = param.get('id'), value = param.get('value');

      if (id === 'Controller-1::NeutronPublicInterface' &&
        (!value || value === 'nic1')) {
        param.set('value', 'eth1');
        newParams.push({name: id, value: 'eth1'});
      }

      if (id === 'Compute-1::NovaComputeLibvirtType' &&
        (!value || value === 'qemu')) {
        param.set('value', 'kvm');
        newParams.push({name: id, value: 'kvm'});
      }
    });

    if (newParams.length > 0) {
      this.send('updatePlanParameters', newParams);
    }
  }
});
