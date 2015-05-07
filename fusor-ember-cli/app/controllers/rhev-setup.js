import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  ovirt_is_self_hosted: Ember.computed.alias("controllers.deployment.ovirt_is_self_hosted"),

  ovirtSetup: function() {
    return (this.get('ovirt_is_self_hosted') ? "selfhost" : "ovirthost")
  }.property('ovirt_is_self_hosted'),

  ovirtSetupTitle: function() {
    return (this.get('ovirt_is_self_hosted') ? "Self Hosted" : "Host + Engine")
  }.property('ovirt_is_self_hosted'),

  isSelfHosted: function() {
    return (this.get('ovirtSetup') === 'selfhost')
  }.property('ovirtSetup'),

  actions: {
    ovirtSetupChanged: function(value) {
      return this.get('controllers.deployment').set('ovirt_is_self_hosted', this.get('isSelfHosted'));
    }
  }

});
