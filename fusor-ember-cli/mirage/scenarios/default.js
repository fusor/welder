import ENV from 'fusor-ember-cli/config/environment';

export default function(server) {

  // Seed your development database using your factories. This
  // data will not be loaded in your tests.
  server.loadFixtures();

if (ENV.environment === 'mocks-enabled') {

  var org = server.create('organization', {name: 'Default Organization'});
  var env = server.create('lifecycle-environment', {name: 'Library',
                                                    label: 'Library',
                                                    library: true});

  var engine = server.create('discovered-host', {isVirtual: true});
  var hypervisor1 = server.create('discovered-host', {name: 'hypervisor1', isVirtual: false, memory_human_size: '21.8 GB'});
  var hypervisor2 = server.create('discovered-host', {name: 'hypervisor2', isVirtual: true, memoryHumanSize: '21.8 GB'});

  server.createList('discovered-host', 2, {isVirtual: true});
  server.createList('discovered-host', 2, {isVirtual: false});

  var domain = server.create('domain', {name: 'example.com'});
  var hostgroup = server.create('hostgroup', {name: 'Fusor Base', domain_id: domain.id});

  server.create('deployment', { name: 'rhev_only',
                                deployRhev: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                discoveredHost: engine,
                                discoveredHosts: [hypervisor1, hypervisor2]
                              });

  var osp_d1 = server.create('openstack-deployment');
  var osp_d2 = server.create('openstack-deployment');

  server.create('deployment', { name: 'osp_only',
                                deployRhev: false,
                                deployOpenstack: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                openstackDeployment: osp_d1
                              });

  server.create('deployment', { name: 'rhev_and_cfme_deployment',
                                deployRhev: true,
                                deployCfme: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                discoveredHost: engine,
                                discoveredHosts: [hypervisor1, hypervisor2]
                              });

  server.create('deployment', { name: 'osp_and_cfme_deployment',
                                deployRhev: false,
                                deployOpenstack: true,
                                deployCfme: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                openstackDeployment: osp_d2
                              });

  server.create('deployment', { name: 'rhev_and_openshift_deployment',
                                deployRhev: true,
                                deployOpenshift: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                discoveredHost: engine,
                                discoveredHosts: [hypervisor1, hypervisor2]
                              });

  server.create('deployment', { name: 'rhev_openshift_cfme_deployment',
                                deployRhev: true,
                                deploy_openshift: true,
                                deployCfme: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                discoveredHost: engine,
                                discoveredHosts: [hypervisor1, hypervisor2]
                              });

  server.create('deployment', {  name: 'all 4 products',
                                deployRhev: true,
                                deployOpenstack: true,
                                deploy_openshift: true,
                                deployCfme: true,
                                organization: org,
                                lifecycleEnvironment: env,
                                openstackDeployment: osp_d1,
                                openshiftInstallLoc: 'RHEV',
                                discoveredHost: engine,
                                discoveredHosts: [hypervisor1, hypervisor2]
                              });

  server.createList('deployment', 50, { deployRhev: true,
                                        organization: org,
                                        lifecycleEnvironment: env
                                       });

//  server.createList('subscription', 2);
}

}
