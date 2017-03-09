import Ember from 'ember';
import request from 'ic-ajax';
import NeedsExistingManifestHelpers from '../../mixins/needs-existing-manifest-helpers';

export default Ember.Route.extend(NeedsExistingManifestHelpers, {

  beforeModel() {
    // Ensure the models have been persisted so that we're validating/syncing up to date data.
    let deployment = this.modelFor('deployment');

    if (deployment.get('isStarted')) {
      return;
    }

    let promises = {
      deployment: deployment.save()
    };

    if (deployment.get('deploy_openstack')) {
      promises.openstack_deployment = deployment.get('openstack_deployment')
        .then(openstack_deployment => openstack_deployment.save());
    }

    return Ember.RSVP.hash(promises);
  },

  model() {
    const reviewModel = this.modelFor('review');
    const subModel = this.modelFor('subscriptions');
    let modelHash = {reviewModel};

    modelHash.subscriptionPools = this.loadSubscriptionPools();

    if(subModel) {
      // Use subscriptions model if the loading has already been done
      modelHash.sessionPortal = subModel.sessionPortal;
      modelHash.useExistingManifest = subModel.useExistingManifest;
      if(modelHash.useExistingManifest) {
        modelHash.subscriptions = subModel.subscriptions;
      }

      return Ember.RSVP.hash(modelHash);
    } else {
      modelHash.sessionPortal = this.loadSessionPortal();

      // subscriptions model isn't available, maybe because of a page refresh
      // Need to load this data independently
      return this.shouldUseExistingManifest().then(useExistingManifest => {

        modelHash.useExistingManifest = useExistingManifest;

        if(useExistingManifest) {
          modelHash.subscriptions = this.loadSubscriptions();
        }

        return Ember.RSVP.hash(modelHash);
      });
    }
  },

  setupController(controller, modelHash) {
    const model = this.modelFor('review');
    controller.set('model', model);
    controller.set('showErrorMessage', false);
    controller.set('useExistingManifest', modelHash.useExistingManifest);
    if (model.get('deploy_rhev')) {
      this.store.findAll('hostgroup').then(function(results) {
        var fusorBaseHostgroup = results.filterBy('name', 'Fusor Base').get('firstObject');
        var fusorBaseDomain = fusorBaseHostgroup.get('domain.name');
        controller.set('engineDomain', fusorBaseDomain);
        controller.set('hypervisorDomain', fusorBaseDomain);
      });
    }

    if(modelHash.useExistingManifest) {
      controller.set('useExistingManifest', true);
      controller.set('reviewSubscriptions', modelHash.subscriptions);
    } else if (model.get('is_disconnected')) {
      controller.set('reviewSubscriptions', this.modelFor('subscriptions/review-subscriptions'));
    } else {
      const reviewSubscriptions = model.get('subscriptions').filter(function(sub) {
        return (sub.get('source') == 'added');
      });

      const hasSubs = reviewSubscriptions.reduce((prev, sub) => {
        return prev || sub.get('quantity_to_add') > 0;
      }, false); // initial val

      controller.set('reviewSubscriptions', reviewSubscriptions);
      controller.set('hasSubscriptionsToAttach', hasSubs);
      controller.set('hasSessionPortal', Ember.isPresent(modelHash.sessionPortal));
      controller.set('hasSubscriptionPools', Ember.isPresent(modelHash.subscriptionPools));
    }

    controller.set('validationErrors', []);
    controller.set('validationWarnings', []);

    if (!model.get('isStarted')) {
      controller.set('showSpinner', true);
      this.validate()
        .then(() => this.validateDiscoveredHostsPoweredOn())
        .then(() => this.syncOpenStack())
        .catch(error => {
          console.log('error', error);
          controller.set('errorMsg', error.jqXHR.responseText);
          controller.set('showErrorMessage', true);
        })
        .finally(() => {
          controller.set('showSpinner', false);
        });
    }
  },

  validate() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.model.id');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');
    let validationErrors = controller.get('validationErrors');

    controller.set('spinnerTextMessage', "Validating deployment...");

    return request({
      url: `/fusor/api/v21/deployments/${deploymentId}/validate`,
      type: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: {}
    }).then(response => {
      if (Ember.isPresent(response.validation)) {
        controller.set('validationErrors', response.validation.errors);
        controller.set('validationWarnings', response.validation.warnings);
      }
    });
  },

  validateDiscoveredHostsPoweredOn() {
    let controller = this.get('controller');
    let deployment = this.get('controller.model');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');
    let hostsPromises = {};

    if (!deployment.get('deploy_rhev') || Ember.isPresent(controller.get('validationErrors'))) {
      return Ember.RSVP.Promise.resolve('all discovered hosts are powered on');
    }

    hostsPromises.hypervisors = deployment.get('discovered_hosts');
    if (!deployment.get('rhev_is_self_hosted')) {
      hostsPromises.engine = deployment.get('discovered_host');
    }

    return Ember.RSVP.hash(hostsPromises).then(results => {
      let powerValidationPromises = {};

      controller.set('showSpinner', true);
      controller.set('spinnerTextMessage', 'Validating discovered hosts are powered on');

      results.hypervisors.forEach(discoveredHost => {
        powerValidationPromises[discoveredHost.get('name')] = this.hostIsPoweredOn(discoveredHost);
      });

      if (results.engine) {
        powerValidationPromises[results.engine.get('name')] = this.hostIsPoweredOn(results.engine);
      }

      return Ember.RSVP.hash(powerValidationPromises).then(results => {
        let powerValidationErrors = [];

        for (let hostname in results) {
          if (results.hasOwnProperty(hostname) && !results[hostname]) {
            powerValidationErrors.push(`Discovered host ${hostname} selected for RHEV deployment is turned off`);
          }
        }

        controller.set('validationErrors', powerValidationErrors);
      });
    });
  },

  hostIsPoweredOn(host) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      request({
        url: `/api/v2/discovered_hosts/${host.get('id')}/refresh_facts`,
        type: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
        },
        data: {}
      }).then(result => {
        resolve(true);
      }).catch(error => {
        resolve(false);
      });
    });
  },

  syncOpenStack() {
    let controller = this.get('controller');
    let deployment = this.get('controller.model');
    let openstack_deployment = this.get('controller.model.openstack_deployment');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');

    if (!deployment.get('deploy_openstack') || !openstack_deployment || Ember.isPresent(controller.get('validationErrors'))) {
      return Ember.RSVP.Promise.resolve('no OpenStack sync needed');
    }

    controller.set('spinnerTextMessage', 'Syncing OpenStack...');

    return request({
      url: `/fusor/api/v21/openstack_deployments/${openstack_deployment.get('id')}/sync_openstack`,
      type: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }
    });
  },

  loadSessionPortal() {
    return this.store.findAll('session-portal')
      .then(results => results.get('firstObject'));
  },

  loadSubscriptionPools() {
    const deployment = this.modelFor('deployment');
    return this.store.query('subscription', {
      deployment_id: deployment.get('id'),
      source: 'added'
    });
  }
});
