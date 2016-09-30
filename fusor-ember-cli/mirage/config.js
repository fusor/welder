//import Mirage from 'ember-cli-mirage';
import Mirage, { faker } from 'ember-cli-mirage';
import ENV from 'fusor-ember-cli/config/environment';

export default function() {

  this.timing = 5; // default is 400

  // These routes to SAT6 or FUSOR WILL run using --environment mocks-enabled,
  // but WILL NOT run using --environment partial-mocks-enabled
  if (ENV.environment === 'mocks-enabled') {

    this.get('/fusor/api/v21/deployments');
    this.get('/fusor/api/v21/deployments/:id');

    this.put('/fusor/api/v21/deployments/:id');
    this.patch('/fusor/api/v21/deployments/:id');

    this.post('/fusor/api/v21/deployments', (schema, request) => {
      var attrs = JSON.parse(request.requestBody);
      attrs['data']['id'] = faker.random.number({min:150, max:1000});
      return attrs;
    });

    this.del('/fusor/api/v21/deployments/:id');

    this.get('/api/v21/organizations');
    this.get('/api/v21/organizations/:id');

    this.get('/fusor/api/v21/lifecycle_environments');
    this.get('/fusor/api/v21/lifecycle_environments/:id');

    this.post('/fusor/api/v21/lifecycle_environments', (schema, request) => {
      var attrs = JSON.parse(request.requestBody);
      attrs['data']['id'] = faker.random.number({min:2, max:100});
      attrs['data']['attributes']['prior_id'] = 1;
      return attrs;
    });

    this.get('/fusor/api/v21/discovered_hosts');
    this.get('/fusor/api/v21/discovered_hosts/:id');

    this.patch('/fusor/api/v21/discovered_hosts/:id/rename', (schema, request) => {
      var id = request.params.id;
      return schema.db.discoveredHosts.find(id);
    });

    this.get('/katello/api/v2/organizations/:id', 'katello-organization');

    this.get('/katello/api/v2/organizations/:id/subscriptions', (schema, request) => {
      return {"results": []};
    });

    this.get('/fusor/api/v21/subscriptions');
    this.post('/fusor/api/v21/subscriptions');
    this.patch('/fusor/api/v21/subscriptions/:id');
    this.put('/fusor/api/v21/subscriptions/:id');

    this.get('/api/v21/hostgroups');
    this.get('/api/v21/hostgroups/:id');

    this.get('/api/v21/domains');
    this.get('/api/v21/domains/:id');

    this.get('/api/v2/settings', (schema, request) => {
      return schema.db.settings;
    });

    this.get('/fusor/api/v21/openstack_deployments');

    this.get('/fusor/api/v21/openstack_deployments/:id');
    this.patch('/fusor/api/v21/openstack_deployments/:id');
    this.post('/fusor/api/v21/openstack_deployments');
    this.put('/fusor/api/v21/openstack_deployments/:id');
    this.del('/fusor/api/v21/openstack_deployments/:id');

    this.get('/api/v21/foreman_tasks');
    this.get('/api/v21/foreman_tasks/:id');

  } /* END if (ENV.environment === 'mocks-enabled') */

  //////////////////////////////////////////////////////////////
  // These routes WILL run in EITHER mode
  // using --environment mocks-enabled OR --environment partial-mocks-enabled
  // Routes are related to OSP, subscriptions, and validations

  this.get('/fusor/api/v21/subscriptions/validate', (schema, request) => {
    return {valid: true};
  });
  this.put('/fusor/api/v21/subscriptions/upload', (schema, request) => {
    return {manifest_file: '/file/path/to/manifest'};
  });

  this.get('/fusor/api/v21/deployments/:id/validate_cdn', (schema, request) => {
    return {cdn_url_code: '200'};
  });

  this.get('/fusor/api/v21/deployments/:id/validate', (schema, request) => {
    var id = request.params.id;
    return {validation:{deployment_id: id, errors:[], warnings:[]}};
  });

  this.post('/fusor/api/openstack/deployments/:id/undercloud', (schema, request) => {
    let od = schema.db.openstackDeployments.insert({
    undercloud_admin_password: 'undercloudAdminPassword',
    undercloud_ip_address: '192.168.234.254',
    undercloud_ssh_username: 'root',
    undercloud_ssh_password: 'vagrant'});
    return {'undercloud': request.params.id};
  });

  this.get('/fusor/api/openstack/deployments/:id/undercloud', (schema, request) => {
    return {
      'deployed': true,
      'failed': false
    };
  });
  this.get('/fusor/api/openstack/deployments/:id/stacks', (schema, request) => {
    return {'stacks': []};
  });

  this.get('/fusor/api/openstack/deployments/:id/nodes', (schema, request) => {
    return {nodes: schema.db.nodes};
  });

  this.post('/fusor/api/openstack/deployments/:id/nodes', (schema, request) => {
    var attrs = JSON.parse(request.requestBody);
    attrs['node']['uuid'] = 'abcde12314asdf';
    return attrs;
  });

  this.get('/fusor/api/openstack/deployments/:id/node_ports', (schema, request) => {
    return {ports: schema.db.ports};
  });

  this.post('/fusor/api/openstack/deployments/:id/node_mac_addresses', (schema, request) => {
    return {nodes: schema.db.node_mac_addresses};
  });

  this.get('/fusor/api/openstack/deployments/:id/flavors', (schema, request) => {
    // NOTE root node is flavor and not flavors
    return {flavor: schema.db.flavors};
  });

  this.get('/fusor/api/openstack/deployments/:id/images', (schema, request) => {
    return {images: schema.db.images};
  });

  this.get('/fusor/api/openstack/deployments/:id/deployment_plans/overcloud', (schema, request) => {
    return {deployment_plan: schema.db.deploymentPlans[0]};
  });

  this.put('/fusor/api/openstack/deployments/:id/deployment_plans/overcloud/:update_action', (schema, request) => {
    // return deployment plan even though UI should update not based on response
    return {deployment_plan: schema.db.deploymentPlans[0]};
  });

  this.post('/fusor/api/v21/openstack_deployments/:id/sync_openstack');

  this.get('/fusor/api/v21/unlogged/deployments/:id/log', (schema, request) => {
    return {
      "fusor_log": {path: ''},
      "foreman_log": {path: ''},
      "foreman_proxy_log": {path: ''},
      "candlepin_log": {path: ''},
      "messages_log": {path: ''}
    };
  });

  this.get('/fusor/api/v21/deployments/:id/check_mount_point', (schema, request) => {
    return {mounted: true, is_empty: true};
  });

  this.get('/customer_portal/owners/:owner_key/consumers', (schema, request) => {
    return schema.db.managementApplications;
  });

  this.get('/customer_portal/consumers/:uuid/entitlements', 'entitlement');
  this.get('/customer_portal/users/:username/owners', (schema, request) => {
    return [
        {
        "parentOwner": null,
        "id": "8a85f9814a192108014a1adef5826b38",
        "key": "7473998",
        "displayName": "7473998",
        "contentPrefix": null,
        "defaultServiceLevel": null,
        "upstreamConsumer": null,
        "logLevel": null,
        "href": "/owners/7473998",
        "created": "2014-12-05T14:33:47.000+0000",
        "updated": "2014-12-05T14:33:47.000+0000"
        }
      ];
  });

  this.get('/customer_portal/pools', 'pool');
  this.post('/customer_portal/login', (schema, request) => {
    return {};
  });
  this.post('/customer_portal/logout', (schema, request) => {
    return {};
  });
  this.post('/customer_portal/consumers/:uuid/entitlements', (schema, request) => {
    return {};
  });

  // route to prevent js console error by ember-cli-blanket
  this.post('/write-blanket-coverage', (schema, request) => {
    return {};
  });

  this.put('/fusor/api/v21/deployments/:id/deploy', (schema, request) => {
    let dep = schema.db.deployments.find(request.params.id);
    let task = schema.db.foremanTasks[0];
    // fusor/server saves foreman_task_uuid to deployment
    // but mirage doesn't have access to ember-data store,
    // so mirage can't save the foreman_task_uuid to the deployment and
    // transition to review/progress/overview
    // fusor/server returns deployment
    return dep;
  });

  // All route NOT defined in mirage/config.js
  // will passthrough to real backend server
  this.passthrough();
}
