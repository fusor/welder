import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import PaginationControllerMixin from "../../mixins/pagination-controller-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, PaginationControllerMixin, {

  rhevController: Ember.inject.controller('rhev'),

  selectedRhevEngineHost: Ember.computed.alias("model.engine_host"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  hypervisorModelIds: Ember.computed('deploymentController.model.discovered_hosts.[]', function() {
    return this.get('deploymentController.model.discovered_hosts').getEach('id');
  }),

  engineNextRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-options';
    } else {
      return 'hypervisor.discovered-host';
    }
  }),

  filteredHosts: Ember.computed('allDiscoveredHosts.[]', 'search', 'isStarted', function(){
    var search = this.get('search');
    var rx = new RegExp(search, 'gi');
    var allDiscoveredHosts = this.get('allDiscoveredHosts');

    if (this.get('isStarted')) {
      return Ember.A([this.get('model')]);
    } else if (allDiscoveredHosts.get('length') > 0) {
      return allDiscoveredHosts.filter(function(record) {
        return (record.get('name').match(rx) || record.get('memory_human_size').match(rx) ||
                record.get('disks_human_size').match(rx) || record.get('subnet_to_s').match(rx) ||
                record.get('mac').match(rx)
               );
      });
    } else {
      return allDiscoveredHosts;
    }
  }),

  numSelected: Ember.computed('model.engine_host.id', function() {
    return (this.get('model.engine_host.id')) ? 1 : 0;
  }),

  isSelectedEngineHostnameInvalid: false,

  disableNextOnEngine: Ember.computed(
    'isSelectedEngineHostnameInvalid',
    'deploymentController.hasNoEngine',
    function() {
      return this.get('deploymentController.hasNoEngine') ||
        this.get('isSelectedEngineHostnameInvalid');
    }
  ),

  actions: {
    onEngineChanged(newlySelectedHost, isInvalidHostname) {
      this.set('isSelectedEngineHostnameInvalid', isInvalidHostname);
      this.set('deploymentController.model.discovered_host', newlySelectedHost);
    },
    setIfHostnameInvalid(bool, hostId) {
      let discoveredHost = this.get('deploymentController.model.discovered_host');
      if(discoveredHost && discoveredHost.get('id') === hostId) {
        this.set('isSelectedEngineHostnameInvalid', bool);
      }
    }
  }
});
