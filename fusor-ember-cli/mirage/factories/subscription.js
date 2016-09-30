/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  deploymentId: 1,
  contractNumber: 10908981,
  productName: "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
  quantityAttached: 0,
  startDate: "2016-03-17T06:00:00.000+02:00",
  endDate: "2017-03-17T05:59:59.000+02:00",
  totalQuantity: 90,
  source: "added",
  quantityToAdd: 2
});
