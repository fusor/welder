import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    saveGlobalServiceConfig() {
      this.set('openModal', false);
      this.sendAction('saveGlobalServiceConfig', this.get('edittedPlanParameters'));
    }
  }

});


