import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['ovirt'],
  engineTabName: Ember.computed.alias("controllers.ovirt.engineTabName"),
  engineTabNameLowercase: function () {
    return this.get('engineTabName').toLowerCase();
  }.property('engineTabName')
});
