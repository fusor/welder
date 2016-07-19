import Ember from 'ember';
import ConfigureEnvironmentMixin from "../../../mixins/configure-environment-mixin";
import NeedsDeploymentNewMixin from "../../../mixins/needs-deployment-new-mixin";
import {
  AllValidator,
  PresenceValidator,
  AlphaNumericDashUnderscoreValidator
} from '../../../utils/validators';

export default Ember.Controller.extend(ConfigureEnvironmentMixin, NeedsDeploymentNewMixin, {

  satelliteTabRouteName: Ember.computed.alias("deploymentNewController.satelliteTabRouteName"),

  selectedOrganization: Ember.computed.alias("deploymentNewController.model.organization"),

  step2RouteName: Ember.computed.alias("deploymentNewController.step2RouteName"),

  nullifyLifecycleEnvIfSelected: Ember.observer('useDefaultOrgViewForEnv', function(){
    this.set('showAlertMessage', false);
    if (this.get('useDefaultOrgViewForEnv')) {
      this.set('selectedEnvironment', null);
      this.get('deploymentNewController.model').set('lifecycle_environment', null);
    }
  }),

  hasLifecycleEnvironment: Ember.computed.alias("deploymentNewController.hasLifecycleEnvironment"),
  hasNoLifecycleEnvironment: Ember.computed.alias("deploymentNewController.hasNoLifecycleEnvironment"),
  disableNextOnLifecycleEnvironment: Ember.computed.alias("deploymentNewController.disableNextOnLifecycleEnvironment"),
  openNewEnvironmentModal: false,

  deployment: Ember.computed.alias("deploymentNewController"),

  envNameValidator: PresenceValidator.create({}),

  actions: {
    selectEnvironment(environment) {
      this.set('showAlertMessage', false);
      this.set('selectedEnvironment', environment);
      return this.get('deploymentNewController.model').set('lifecycle_environment', environment);
    },

    createEnvironment(fields_env) {
      var self = this;

      var nameAlreadyExists =  self.get('lifecycleEnvironments').findBy('name', fields_env.name);
      if (nameAlreadyExists) {
        return self.get('deploymentNewController').set('errorMsg', fields_env.name + ' is not a unique name. Environment not saved.');
      }

      var selectedOrganization = this.get('selectedOrganization');
      this.set('fields_env', fields_env);
      this.set('fields_env.organization', selectedOrganization);

      var library = this.get('libraryEnv');
      // assign library to prior db attribute
      this.set('fields_env.prior', library.get('id'));
      var environment = this.store.createRecord('lifecycle-environment', this.get('fields_env'));
      environment.save().then(function(result) {
        //success
        self.get('lifecycleEnvironments').addObject(result._internalModel);
        self.set('selectedEnvironment', environment);
        self.get('deploymentNewController.model').set('lifecycle_environment', environment);
        self.get('deploymentNewController').set('errorMsg', null);
        return self.set('showAlertMessage', true);
      }, function(error) {
        self.get('deploymentNewController').set('errorMsg', 'error saving environment' + error);
      });

    }
  }

});
