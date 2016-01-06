import Ember from 'ember';

export default Ember.Component.extend({

    openCloseModal: Ember.observer('openModal', function() {
        if (this.get('openModal')) {
            return Ember.$('#'+this.get('idModal')).modal('show');
        } else {
            return Ember.$('#'+this.get('idModal')).modal('hide');
        }
    }),

    actions: {
        closeModal: function() {
            this.set('openModal', false);
            return Ember.$('#'+this.get('idModal')).modal('hide');
        }
    }


});
