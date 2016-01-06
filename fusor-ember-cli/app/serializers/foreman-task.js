import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,
  attrs: {
    humanized: { embedded: 'always' }
  }
});
