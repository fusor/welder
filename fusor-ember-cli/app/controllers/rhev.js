import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application', 'ovirt-setup', 'side-menu'],

  ovirtSetup: Ember.computed.alias("controllers.ovirt-setup.ovirtSetup"),

  isSelfHost: function() {
    return (this.get('ovirtSetup') === 'selfhost');
  }.property('ovirtSetup'),

  engineTabName: function() {
    if (this.get('isSelfHost')) {
      return 'Hypervisor/engine';
    } else {
      return 'Engine';
    }
  }.property('isSelfHost'),

});
