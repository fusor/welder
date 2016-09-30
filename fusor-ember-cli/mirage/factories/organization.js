/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return 'org ' + i;
  },
  title(i) {
    return 'org ' + i;
  },
  label(i) {
    return 'org_' + i;
  },
  createdAt: "2016-05-19",
  updatedAt: "2016-05-19",
  description: null

});
