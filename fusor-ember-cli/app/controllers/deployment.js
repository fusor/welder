import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.ObjectController.extend(DeploymentControllerMixin, DisableTabMixin, {

  // disable Steps 2, 3, 4, etc on wizard
  isDisabledOvirt: Ember.computed.alias("satelliteInvalid"),
  isDisabledOpenstack: Ember.computed.alias("satelliteInvalid"),
  isDisabledCloudForms: Ember.computed.alias("satelliteInvalid"),
  isDisabledSubscriptions: Ember.computed.alias("satelliteInvalid"),
  isDisabledReview: Ember.computed.alias("satelliteInvalid"),

  hasLifecycleEnvironment: function() {
    return (!!(this.get('lifecycle_environment').get('id')) || this.get('useDefaultOrgViewForEnv')); // without .get('id') returns promise that is true
  }.property('lifecycle_environment', 'useDefaultOrgViewForEnv'),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment'),

  validations: {
    name: {
      presence: true,
      length: { minimum: 2 }
    },
  },

  selectedOvirtEngine: null,

  satelliteInvalid: Ember.computed.or('hasNoName', 'hasNoOrganization', 'hasNoLifecycleEnvironment'),

  skipContent: false,

  isStarted: function() {
    return !!(this.get('model.foreman_task_uuid'));
  }.property('model.foreman_task_uuid'),

});
