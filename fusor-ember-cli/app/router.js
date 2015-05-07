import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  // log when Ember generates a controller or a route from a generic class
  LOG_ACTIVE_GENERATION: true,
  // log when Ember looks up a template or a view
  LOG_VIEW_LOOKUPS: true
});

export default Router.map(function() {
  this.route('login');
  this.route('loggedin');

  this.resource('rhci', { path: '/old-deployments/new-old' }, function() {
    this.route('satellite', function() {
      this.route('configure-organization');
      this.route('configure-environment');
    });
  });

  this.resource('deployments');

  this.resource("deployment-new", { path: '/deployments/new' }, function() {
    this.route("start");
    this.route('satellite', function() {
      this.route('configure-environment');
      this.route("configure-organization");
    });
  });

  this.resource('deployment', { path: '/deployments/:deployment_id' }, function() {

    this.route("start");

    this.resource('satellite', function() {
      this.resource('configure-organization');
      this.resource('configure-environment');
    });

    this.resource('ovirt', function() {
      this.resource('ovirt-setup', { path: 'setup' });
      this.resource('hypervisor', function() {
        this.route('discovered-host');
        this.route('existing-host');
        this.route('new-host');
      });
      this.resource('engine', function() {
        this.route('hypervisor');
        this.route('discovered-host');
        this.route('existing-host');
        this.route('new-host');
      });
      this.resource('ovirt-options', { path: 'configuration' });
      this.resource('storage');
      this.resource('networking');
    });

    this.resource('openstack', function() {
      this.resource('register-nodes');
      this.resource('assign-nodes');
    });
    this.resource('cloudforms', function() {
      this.resource('where-install');
      this.resource('cloudforms-storage-domain', {path: 'storage-domain'});
      this.resource('cloudforms-vm', {path: 'vm'});
    });
    this.resource('subscriptions', function() {
      this.route('credentials');
      this.route('select-subscriptions', {path: 'select'});
    });
    this.resource('products');
    this.resource('review', function() {
      this.route('installation');
      this.route('progress', function() {
        this.route('overview');
        this.route('details', function() {
          this.route('task', {path: '/:task_id' }, function () {
            this.route('running_steps');
            this.route('task_errors');
            this.route('task_locks');
            this.route('task_raw');
          });
        });
      });
    });
  });

  this.resource('hostgroups', function() {
    this.resource('hostgroup', { path: '/:hostgroup_id' }, function() {
      this.route('edit');
    });
  });

  this.route('hostgroup/edit');
  this.route('review/installation');
  this.resource("discovered-hosts", function() {
    this.resource("discovered-host", { path: '/:discovered_hosts_id' });
  });
});
