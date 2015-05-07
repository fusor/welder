import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['deployment', 'hypervisor/discovered-host', 'engine/discovered-host'],

  cssHostHostId: function () {
    return ('host_' + this.get('id'));
  }.property('id'),

  cssIdHostId: function () {
    return ('id_' + this.get('id'));
  }.property('id'),

  allDiscoveredHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.allDiscoveredHosts"),
  // same as controllers.deployment.discovered_hosts
  selectedOvirtHypervisorHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.model"),
  // same as controllers.deployment.discovered_host
  selectedOvirtEngineHost: Ember.computed.alias("controllers.engine/discovered-host.model"),

  isAllChecked: Ember.computed.alias("controllers.hypervisor/discovered-host.isAllChecked"),
  allChecked: Ember.computed.alias("controllers.hypervisor/discovered-host.allChecked"),

  addOrRemoveHypervisor: function(row){
    if (row.get('isSelectedAsHypervisor')) {
      this.get('controllers.hypervisor/discovered-host.model').addObject(row.get('model'));
    } else {
      this.get('controllers.hypervisor/discovered-host.model').removeObject(row.get('model'));
    }
  }.observes('isSelectedAsHypervisor'),

  isSelectedAsHypervisor: function () {
    if (this.get('selectedOvirtHypervisorHosts')) {
      var selectedIds = this.get('selectedOvirtHypervisorHosts').getEach("id")
      return selectedIds.contains(this.get('id'))
    } else {
      return false
    }
  }.property('selectedOvirtHypervisorHosts.[]'),

  isSelectedAsEngine: function () {
    return (this.get('selectedOvirtEngineHost.id') === this.get('id'));
  }.property('selectedOvirtEngineHost'),

  actions: {
    engineHostChanged: function(host) {
      var engine_hostname = host.get('name');
      var controller = this.get('controllers.deployment');
      return this.store.find('discovered-host', host.get('id')).then(function (result) {
        return controller.set('discovered_host', result);
        //TODO save hostname on discovered host on save deploy
      });
    }
  }

});
