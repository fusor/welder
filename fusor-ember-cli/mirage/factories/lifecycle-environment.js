/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return 'env ' + i;
  },
  label(i) {
    return 'env ' + i;
  },
  description: null,
  library: false,
  priorId: null,
  createdAt: "2016-05-19",
  updatedAt: "2016-05-19"

});
