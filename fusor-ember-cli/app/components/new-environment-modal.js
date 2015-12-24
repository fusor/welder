import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement() {
    this.set('name', null);
    this.set('label', null);
  },

  fields_env: {},

  actions: {
    createEnvironment() {
      this.set('openModal', false);
      this.set('fields_env.name', this.get('name'));
      this.set('fields_env.label', this.get('label'));
      this.set('fields_env.description', this.get('description'));
      this.sendAction('createEnvironment', this.get('fields_env'));
    }
  }
});
