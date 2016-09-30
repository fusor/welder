/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return 'deployment_number_' + i;
  },
  isDisconnected: false,
  rhevIsSelfHosted: false,
  rhevEngineAdminPassword: '12345678',
  rhevDataCenterName: 'Default',
  rhevClusterName: 'Default',
  rhevStorageName: 'myStorage',
  rhevStorageType: 'NFS',
  rhevStorageAddress: '10.2.132.4',
  rhevRootPassword: "12345678",
  // rhevCpuType: null,
  rhevSharePath: '/share/path',
  rhevExportDomainName: 'myExport',
  rhevExportDomainAddress: '10.22.17.4',
  rhevExportDomainPath: '/export/path',
  cfmeInstallLoc: "RHEV",
  cfmeRootPassword: "12345678",
  cfmeAdminPassword: "12345678",
  cfmeDbPassword: "12345678",
  hostNamingScheme: "Freeform",
  customPreprendName: null,
  enableAccessInsights: true,
  openstackUndercloudPassword: "dummy password",
  upstreamConsumerUuid: null,
  upstreamConsumer_name: null,
  openshiftStorage_host: "1.2.3.4",
  openshiftStorageType: "NFS",
  openshiftExportPath: "/share/openshift/path",
  openshiftUserPassword: 'openshiftPassword',
  openshiftSubdomain_name: 'app123',
  cloudformsVcpu: 4,
  cloudformsRam: 8,
  cloudformsVmDiskSize: 40,
  cloudformsDbDiskSize: 40,
  createdAt: "2016-09-09"

});

  //       "cdnUrl": "10.35.3.63",
  //       "manifest_file": "/usr/share/foreman/tmp/import_10c9a9f7cc20541de373.zip",
  //       "createdAt": "2015-11-30T09:31:03Z",
  //       "updatedAt": "2015-12-03T13:18:19Z",
  //       "organization_id": 1,
  //       "lifecycleEnvironment_id": null,
  //       "discovered_host_id": 2,
  //       "discovered_host_ids": [
  //           4
  //       ],
  //       "subscription_ids": [
  //           4,
  //           3
  //       ],
  //       "introspectionTask_ids": []

  // rhev_rootPassword: DS.attr('string'),
  // cfme_rootPassword: DS.attr('string'),
  // cfmeAdminPassword: DS.attr('string'),

  // foremanTaskUuid: DS.attr('string'),
  // upstreamConsumerUuid: DS.attr('string'),
  // upstreamConsumer_name: DS.attr('string'),

  // rhevExport_domain_name: DS.attr('string'),
  // rhevExport_domainAddress: DS.attr('string'),
  // rhevExport_domainPath: DS.attr('string'),

  // rhev_localStoragePath: DS.attr('string'),

  // host_namingScheme: DS.attr('string'),
  // customPreprend_name: DS.attr('string'),
  // enableAccess_insights: DS.attr('boolean'),
  // cfmeAddress: DS.attr('string'),

  // cdnUrl: DS.attr('string'),
  // manifest_file: DS.attr('string'),

  // createdAt: DS.attr('date'),
  // updatedAt: DS.attr('date'),

  // // has one Engine - discovered_host is an alias for rhevEngine_host_id
  // discovered_host: DS.belongsTo('discovered-host', {async: true}),
  // rhevEngine_host_id: DS.attr('number'),

  // // has many Hypervisors
  // discovered_hosts: DS.hasMany('discovered-host', {async: true}),

  // // has many Subscriptions
  // subscriptions: DS.hasMany('subscription', {inverse: 'deployment', async: true}),
  // introspectionTasks: DS.hasMany('introspection-task', {async: true}),
