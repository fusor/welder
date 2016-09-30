import { JSONAPISerializer } from 'ember-cli-mirage';
import Ember from 'ember';
const { underscore } = Ember.String;

export default JSONAPISerializer.extend({

  keyForAttribute(attr) {
    return underscore(attr);
  },

  keyForRelationship(relationship) {
    return underscore(relationship);
  },

  keyForRelationshipIds(relationship) {
    return underscore(relationship) + '_ids';
  },

  keyForModel(modelName) {
    return underscore(modelName);
  },

  typeKeyForModel(model) {
    return underscore(Ember.String.pluralize(model.modelName));
  }

});
