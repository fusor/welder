import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],

  getParamValue: function(paramName, params) {
    var paramValue = null;
    var numParams = params.get('length');
    // can you do forEach here?
    for (var i=0; i<numParams; i++) {
      var param = params.objectAt(i);
      if (param.get('id') === paramName) {
        paramValue = param.get('value');
        break;
      }
    }
    return paramValue;
  },

  unassignedRoles: function() {
    var unassignedRoles = [];
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role, index) {
      // use Empty.isBlank or Empty.isEmpty
      if ( self.getParamValue(role.get('flavorParameterName'), params) == null ) {
        unassignedRoles.pushObject(role);
      }
    });
    return unassignedRoles;
  }.property('model.plan.roles', 'model.plan.parameters'),

  allRolesAssigned: function() {
    return (this.get('unassignedRoles').length === 0);
  }.property('unassignedRoles'),

  noRolesAssigned: function() {
    return (this.get('unassignedRoles').length === this.get('model.plan.roles').length);
  }.property('unassignedRoles'),

  profiles: function() {
    return this.get('model.profiles');
  // why model.profiles.length?  use model.profiles.[] if this needs to compute if a record is added/removed
  }.property('model.profiles', 'model.profiles.length'),

  numProfiles: function() {
    var profiles = this.get('model.profiles');
    return profiles.length;
  }.property('model.profiles', 'model.profiles.length'),

  // not needed if in setupController
  nodes: function() {
    return this.get('model.nodes');
  }.property('model.nodes'),

  nodeCount: function() {
    return this.get('model.nodes').length;
  }.property('model.nodes'),

  assignedNodeCount: function() {
    var count = 0;
    var params = this.get('model.plan.parameters');
    var self = this;
    this.get('model.plan.roles').forEach(function(role, index) {
      count += self.getParamValue(role.get('countParameterName'), params);
    });
    return count;
  }.property('model.plan.roles', 'model.plan.parameters'),

  isDraggingRole: false,

  droppableClass: function() {
    if (this.isDraggingRole) {
      return 'deployment-roles-active';
    }
    else {
      return '';
    }
  }.property('isDraggingRole'),

  doAssignRole: function(plan, role, profile) {
    var data;
    if (profile == null ) {
      data = { 'role_name': role.get('name'), 'flavor_name': null };
    } else {
      data = { 'role_name': role.get('name'), 'flavor_name': profile.get('name') };
    }

    // I would use an ember-data adapter here
    Ember.$.ajax({
      url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/update_role_flavor',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
        console.log('SUCCESS');
      },
      error: function(error) {
        console.log('ERROR');
        console.log(error);
      }
    });
  },

  actions: {
    editRole: function(role) {
      console.log("EDIT: " + role);
    },

    assignRole: function(plan, role, profile) {
      this.doAssignRole(plan, role, profile);
    },

    unassignRole: function(role) {
      var plan = this.get('model.plan');
      this.doAssignRole(plan, role, null);
    },

    doShowSettings: function() {
      this.set('showSettings', true);
    },

    doShowConfig: function() {
      this.set('showSettings', false);
    },

    // I would use an ember-data adapter here
    deployPlan: function() {
      var plan = this.get('model.plan');
      Ember.$.ajax({
        url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/deploy',
        type: 'POST',
        contentType: 'application/json',
        success: function(response) {
          console.log('SUCCESS');
        },
        error: function(error) {
          console.log('ERROR');
          console.log(error);
        }
      });
    },
  },

  /// always false???
  disableAssignNodesNext: function() {
    return false;
  }.property('profiles'),

  nextStepRouteName: function() {
    return ('');
  }.property('step2RouteName', 'step3RouteName')
});
