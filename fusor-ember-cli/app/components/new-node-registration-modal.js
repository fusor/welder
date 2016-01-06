import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    registerNodes() {
      this.set('openModal', false);
      this.set('fields_env.name', this.get('name'));
      this.set('fields_env.label', this.get('label'));
      this.set('fields_env.description', this.get('description'));
      this.sendAction('registerNodes', this.get('fields_env'));
    }
  }

});
