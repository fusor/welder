import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  step2RouteName: Ember.computed.alias("controllers.deployment.step2RouteName"),
  isStarted: Ember.computed.alias("model.isStarted"),

  contentProviderType: function() {
    return (this.get('model.is_disconnected') ? "disconnected" : "redhat_cdn");
  }.property('model.is_disconnected'),

  contentProviderTitle: function() {
    return (this.get('model.is_disconnected') ? "Disconnected" : "Red Hat CDN");
  }.property('model.is_disconnected'),

  isDisconnected: function() {
    return (this.get('contentProviderType') === 'disconnected');
  }.property('contentProviderType'),

  actions: {
    providerTypeChanged: function() {
      return this.set('model.is_disconnected', this.get('isDisconnected'));
    }
  }

});
