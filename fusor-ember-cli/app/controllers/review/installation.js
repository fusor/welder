import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application','rhci', 'deployment', 'satellite', 'configure-organization',
          'configure-environment', 'ovirt-setup', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'networking', 'ovirt-options', 'where-install',
          'cloudforms-storage-domain', 'cloudforms-vm', 'review'],

  // TODO - DRY and update while deployment is finished and button should say "Deployed"
  buttonDeployTitle: function() {
    if (this.get('controllers.deployment.isStarted')) {
      return 'Deploying ...';
    } else {
      return 'Deploy';
    }
  }.property('controllers.deployment.isStarted'),

  ovirtValidated: function() {
    if (this.get('isOvirt')) {
      return Ember.isPresent(this.get('controllers.deployment.ovirt_engine_admin_password')) &&
             Ember.isPresent(this.get('selectedOvirtEngine')) &&
             Ember.isPresent(this.get('selectedHypervisorHosts')) &&
             Ember.isPresent(this.get('controllers.deployment.ovirt_storage_type'));
    } else {
      return true;
    }
  }.property('controllers.deployment.ovirt_engine_admin_password', 'controllers.deployment.ovirt_storage_type',
             'selectedOvirtEngine', 'selectedHypervisorHosts'),

  cfmeValidated: function() {
    if (this.get('isCloudForms')) {
      return Ember.isPresent(this.get('controllers.deployment.cfme_install_loc'));
    } else {
      return true;
    }
  }.property('controllers.deployment.cfme_install_loc'),

  buttonDeployDisabled: function() {
    return (this.get('controllers.deployment.isStarted') || !(this.get('ovirtValidated')) || !(this.get('cfmeValidated')));
  }.property('controllers.deployment.isStarted', 'ovirtValidated', 'cfmeValidated'),

  showErrorMessage: false,
  errorMsg: null,
  foremanTasksURL: null,
  skipContent: Ember.computed.alias("controllers.deployment.skipContent"),

  isOvirtOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,

  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("controllers.ovirt-options.hostAddress"),
  engineHostName: Ember.computed.alias("controllers.ovirt-options.engineHostName"),

  nameDeployment: Ember.computed.alias("controllers.deployment.name"),
  selectedOrganization: Ember.computed.alias("controllers.deployment.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.deployment.selectedEnvironment"),
  ovirtSetup: Ember.computed.alias("controllers.deployment.ovirtSetup"),

  isOvirt: Ember.computed.alias("controllers.deployment.isOvirt"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  isSelfHosted: Ember.computed.alias("controllers.deployment.ovirt_is_self_hosted"),
  selectedHypervisorHosts: Ember.computed.alias("controllers.deployment.discovered_hosts"),

  ovirt_engine_host: Ember.computed.alias("controllers.deployment.discovered_host"),
  selectedOvirtEngine: Ember.computed.alias("controllers.deployment.discovered_host"),

  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
  nameOvirt: Ember.computed.alias("controllers.rhci.nameOvirt"),
  nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

});
