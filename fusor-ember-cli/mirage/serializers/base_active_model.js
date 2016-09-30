import { ActiveModelSerializer } from 'ember-cli-mirage';
const { underscore } = Ember.String;

export default ActiveModelSerializer.extend({

  keyForAttribute(attr) {
    return underscore(attr);
  },

  keyForRelationship(relationship) {
    return underscore(relationship);
  },

  keyForRelationshipIds(relationship) {
    return underscore(relationship) + '_ids';
  }

});