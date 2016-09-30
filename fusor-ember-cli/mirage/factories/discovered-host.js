/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return 'mac' + i + '254000f6568';
  },
  type: 'Host::Discovered',
  ip(i) {
    return '192.168.152. ' + i;
  },
  mac(i) {
    return i + '2:54:00:0f:65:68';
  },
  cpus: 4,
  memoryHumanSize: "7.8 GB",
  disksHumanSize: "10 GB",
  diskCount: 1,
  subnetToS: "default (192.168.152.0/24)",
  isVirtual: true,
  isManaged: false,
  isDiscovered: true

});
