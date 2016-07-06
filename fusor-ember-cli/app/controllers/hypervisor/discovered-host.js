import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import PaginationControllerMixin from "../../mixins/pagination-controller-mixin";
import {
  AllValidator,
  PresenceValidator,
  AlphaNumericDashUnderscoreValidator
} from '../../utils/validators';

export default Ember.Controller.extend(NeedsDeploymentMixin, PaginationControllerMixin, {

  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  hostNamingScheme: Ember.computed.alias("deploymentController.model.host_naming_scheme"),
  customPreprendName: Ember.computed.alias("deploymentController.model.custom_preprend_name"),

  namingOptions: ['Freeform', 'MAC address', 'hypervisorN', 'Custom scheme'],

  isFreeform: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Freeform');
  }),

  isMac: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'MAC address');
  }),

  isCustomScheme: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Custom scheme');
  }),

  isHypervisorN: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'hypervisorN');
  }),

  // same as Engine. TODO. put it mixin
  filteredHosts: Ember.computed('allDiscoveredHosts.[]', 'search', 'isStarted', function(){
    var search = this.get('search');
    var rx = new RegExp(search, 'gi');
    var allDiscoveredHosts = this.get('allDiscoveredHosts');

    if (this.get('isStarted')) {
      return this.get('model.hypervisor_hosts');
    } else if (allDiscoveredHosts.get('length') > 0) {
      return allDiscoveredHosts.filter(function(record) {
        return record.get('name').match(rx) ||
          record.get('memory_human_size').match(rx) ||
          record.get('disks_human_size').match(rx) ||
          record.get('subnet_to_s').match(rx) ||
          record.get('mac').match(rx);
      });
    } else {
      return allDiscoveredHosts;
    }
  }),

  hypervisorModelIds: Ember.computed('model.hypervisor_hosts.[]', function() {
    if (Ember.isPresent(this.get('model.hypervisor_hosts'))) {
      return this.get('model.hypervisor_hosts').getEach('id');
    } else {
      return [];
    }
  }),

  cntSelectedHypervisorHosts: Ember.computed.alias('hypervisorModelIds.length'),

  hostInflection: Ember.computed('cntSelectedHypervisorHosts', function() {
    return this.get('cntSelectedHypervisorHosts') === 1 ? 'host' : 'hosts';
  }),

  isAllChecked: Ember.computed('allDiscoveredHosts.[]', 'cntSelectedHypervisorHosts', function() {
    return (this.get('cntSelectedHypervisorHosts') === this.get('allDiscoveredHosts.length'));
  }),

  observeAllChecked: Ember.observer('allChecked', function(row) {
    // TODO
    if (this.get('allChecked')) {
      this.send('setCheckAll');
    } else {
      this.send('setUncheckAll');
    }
  }),

  hypervisorBackRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-setup';
    } else {
      return 'engine.discovered-host';
    }
  }),

  hostnameValidity: Ember.Object.create({
    updated: Date.now(),
    state: Ember.Object.create()
  }),
  disableNextOnHypervisor: Ember.computed(
    'hypervisorModelIds',
    'hostnameValidity.updated',
    function() {
      if(this.get('hypervisorModelIds').get('length') === 0) {
        return true;
      }

      let vState = this.get('hostnameValidity').get('state');
      let trackedHostIds = Object.keys(vState);
      return trackedHostIds.length === 0 ||
        !trackedHostIds
          .filter((hostId) => this.get('hypervisorModelIds').contains(hostId))
          .map((k) => vState.get(k))
          .reduce((lhs, rhs) => lhs && rhs);
    }
  ),

  customPrefixValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      AlphaNumericDashUnderscoreValidator.create({})
    ]
  }),

  actions: {

    setCheckAll() {
      this.get('model.hypervisor_hosts').setObjects([]);
      this.set('checkAll', true);
      this.set('uncheckAll', false);
      this.get('model.hypervisor_hosts').addObjects(this.get('allDiscoveredHosts'));
    },

    setUncheckAll() {
      this.set('uncheckAll', true);
      this.set('checkAll', false);
      this.get('model.hypervisor_hosts').setObjects([]);
    },

    openNamingSchemeModal() {
      this.set('openModalNamingScheme', true);
    },

    cancelNamingScheme() {
      this.get('deploymentController.model').rollbackAttributes();
    },

    saveNamingScheme() {
      this.get('deploymentController.model').save();
    },

    setIfHostnameInvalid(isInvalid, hostId) {
      this.get('hostnameValidity').get('state').set(hostId, !isInvalid);
      this.get('hostnameValidity').set('updated', Date.now());
    },
    setSelectValue(fieldName, selectionValue) {
      this.get('deploymentController').set(fieldName, selectionValue);
    }
  }
});
