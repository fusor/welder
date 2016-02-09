import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'fusor-ember-cli/tests/helpers/start-app';
var application;

module('Acceptance | deployment', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('click edit button for deployment on deployments page', function(assert) {
  server.loadFixtures();
  var org = server.create('organization');
  var env = server.create('lifecycle_environment');

  var engine = server.create('discovered_host', {is_virtual: true});
  var hypervisor1 = server.create('discovered_host', {is_virtual: false, memory_human_size: '7.8 GB'});
  var hypervisor2 = server.create('discovered_host', {is_virtual: true, memory_human_size: '7.8 GB'});

  server.createList('discovered_host', 2, {is_virtual: true});
  server.createList('discovered_host', 2, {is_virtual: false});

  var domain = server.create('domain', {name: 'example.com'});
  var hostgroup = server.create('hostgroup', {name: 'Fusor Base', domain_id: domain.id});

  server.create('deployment', {name: 'rhev_only',
                                      deploy_rhev: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      discovered_host_id: engine.id,
                                      discovered_host_ids: [hypervisor1.id, hypervisor2.id]
                                     });

  Ember.run(function(){
      visit('/deployments');
      click('tr.deployment-row:first-child > td:last-child > a');

      andThen(function() {
          assert.equal(currentURL(), '/deployments/1/satellite');
          assert.equal($.trim(find('h1').text()), 'New RHCI Deployment:  rhev_only');
      });
  });
});
