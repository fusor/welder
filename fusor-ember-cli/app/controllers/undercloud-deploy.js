import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  deploymentId: Ember.computed.alias("controllers.deployment.model.id"),
  undercloudIP: Ember.computed.alias("controllers.deployment.model.openstack_undercloud_ip_addr"),
  sshUser: Ember.computed.alias("controllers.deployment.model.openstack_undercloud_user"),
  sshPassword: Ember.computed.alias("controllers.deployment.model.openstack_undercloud_user_password"),

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),

  undercloudIPHelp: "The IP address that the already-installed Red Hat Enterprise Linux OpenStack Platform undercloud is running on.",

  deployed: false,

  deployDisabled: function() {
    return this.get('deployed') && !this.get('isDirty');
  }.property('deployed', 'isDirty'),

  disableDeployUndercloudNext: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabRegisterNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),

  disableTabAssignNodes: function() {
    return !this.get('deployed');
  }.property('deployed'),

  isDirty: false,

  watchModel: function() {
    this.set('isDirty', true);
  }.observes('model.undercloudIP', 'model.sshUser',
             'model.sshPassword'),

  backRouteNameUndercloud: function() {
    if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'configure-environment';
    }
  }.property('isRhev'),

  actions: {
    deployUndercloud: function () {
      var self = this;
      var model = this.get('model');
      console.log('detectUndercloud');
      console.log("host " + this.get('undercloudIP'));
      console.log("user " + this.get('sshUser'));
      var data = { 'underhost': this.get('undercloudIP'),
        'underuser': this.get('sshUser'),
        'underpass': this.get('sshPassword'),
        'deployment_id': this.get('deploymentId')};

      var promiseFunction = function (resolve) {
        self.set('deploymentError', null);
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      Ember.$.ajax({
          url: '/fusor/api/openstack/deployments/' + self.get('deploymentId') + '/underclouds',
          type: 'POST',
          data: JSON.stringify(data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
          },
          success: function(response) {
            promise.then(fulfill);
            console.log('create success');
            console.log(response);
            Ember.run.later(checkForDone, 3000);
          },
          error: function(error) {
            self.set('deploymentError', error.responseJSON.errors);
            self.set('showLoadingSpinner', false);
            console.log('create failed');
            console.log(error);
          }
      });

      var checkForDone = function () {
        console.log("running check for done for id " + self.get('deploymentId'));
        Ember.$.ajax({
          url: '/fusor/api/openstack/deployments/' + self.get('deploymentId') + '/underclouds/' + self.get('deploymentId'),
          type: 'GET',
          contentType: 'application/json',
          success: function(response) {
            console.log('api check success');
            console.log(response);
            if (response['deployed'] || response['failed']) {
              console.log('detection finished');
              if (response['failed']) {
                console.log('detection failed');
                self.set('deploymentError', 'Please check foreman logs.');
                self.set('showLoadingSpinner', false);
              } else {
                console.log('detection success');
                self.set('deploymentError', null);
                resolve(true);
              }
            } else {
              console.log('detection ongoing');
              Ember.run.later(checkForDone, 3000);
            }
          },
          error: function(error) {
            console.log('api check error');
            console.log(error);
            self.set('deploymentError', 'Status check failed');
            self.set('showLoadingSpinner', false);
          }
        });
      };
    };

    var fulfill = function (isDone) {
      if (isDone) {
        console.log("fulfill");
        self.set('showLoadingSpinner', false);
        self.set('deployed', true);
        self.set('isDirty', false);
      }
    };

    var promise = new Ember.RSVP.Promise(promiseFunction);
    self.set('loadingSpinnerText', "Detecting Undercloud...");
    self.set('showLoadingSpinner', true);

    }
  }
});
