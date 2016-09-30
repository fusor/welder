/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  undercloudAdminPassword: 'undercloudAdminPassword',
  undercloudIpAddress: '192.168.234.254',
  undercloudSshUsername: 'root',
  undercloudSshPassword: 'vagrant',
  overcloudDeployed: false,
  overcloudAddress: null,
  overcloudExtNetInterface: 'nic2',
  overcloudPrivateNet: '192.168.254.0/24',
  overcloudFloatNet: '192.168.253.0/24',
  overcloudFloatGateway: '192.168.253.1',
  overcloudPassword: 'overcloudAdminPassword',
  overcloudLibvirtType: 'kvm',
  overcloudNodeCount: 2,
  overcloudComputeFlavor: 'Flavor-16-x86_64-16384-99',
  overcloudComputeCount: 1,
  overcloudControllerFlavor: 'Flavor-16-x86_64-16384-99',
  overcloudControllerCount: 1,
  overcloudCephStorageFlavor: 'Flavor-16-x86_64-16384-99',
  overcloudCephStorageCount: 0,
  overcloudBlockStorageFlavor: 'Flavor-16-x86_64-16384-99',
  overcloudBlockStorageCount: 0,
  overcloudObjectStorageFlavor: 'Flavor-16-x86_64-16384-99',
  overcloudObjectStorageCount: 0,
  overcloudHostname: null,
  undercloudHostname: null,
  externalCephStorage: false,
  cephExtMonHost: null,
  cephClusterFsid: null,
  cephClientUsername: null,
  cephClientKey: null,
  novaRbdPoolName: null,
  cinderRbdPoolName: 'cinder',
  glanceRbdPoolName: 'glance'
});


