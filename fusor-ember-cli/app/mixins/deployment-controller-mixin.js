import Ember from 'ember';

export default Ember.Mixin.create({

  needs: ['application', 'subscriptions',
          'configure-organization', 'configure-environment',
          'subscriptions/select-subscriptions'],

  isOvirt: Ember.computed.alias("deploy_ovirt"),
  isOpenStack: Ember.computed.alias("deploy_openstack"),
  isCloudForms: Ember.computed.alias("deploy_cfme"),

  // default is downstream
  isUpstream: false,
  hideSubscriptions: true,
  isSubscriptions: function () {
    return (!(this.get('hideSubscriptions') && !(this.get('isUpstream'))));
  }.property('isUpstream', 'hideSubscriptions'),

  // will be overwritten be routes
  isHideWizard: null,

  // declared in controllers, and not in mixin
  // isOvirt
  // isOpenStack
  // isCloudForms

  // route names will be overwrriten by active hook in routes/deployment.js
  // and routes/deployment-new.js and routes/start.js and routes/deployment-new/start.js
  satelliteTabRouteName: null,
  organizationTabRouteName: null,
  lifecycleEnvironmentTabRouteName: null,

  // nameSelectSubscriptions: function() {
  //   if (this.get('isUpstream')) { return "Select Content Source"; } else { return "Select Subscriptions"; }
  // }.property('isUpstream'),

  disableNextOnStart: function () {
    return (!(this.get('isOvirt') || this.get('isOpenStack') || this.get('isCloudForms')));
  }.property('isOvirt', 'isOpenStack', 'isCloudForms'),

  // names
  nameRHCI: function() {
    if (this.get('isUpstream')) { return "Fusor"; } else { return "RHCI"; }
  }.property('isUpstream'),

  nameRedHat: function() {
    if (this.get('isUpstream')) { return ""; } else { return "Red Hat"; }
  }.property('isUpstream'),

  nameSatellite: function() {
    if (this.get('isUpstream')) { return "Foreman"; } else { return "Satellite"; }
  }.property('isUpstream'),

  nameOvirt: function() {
    if (this.get('isUpstream')) { return "Ovirt"; } else { return "Ovirt"; }
  }.property('isUpstream'),

  nameOpenStack: function() {
    if (this.get('isUpstream')) { return "RDO"; } else { return "RHELOSP"; }
  }.property('isUpstream'),

  nameCloudForms: function() {
    if (this.get('isUpstream')) { return "ManageIQ"; } else { return "CloudForms"; }
  }.property('isUpstream'),

  // logo
  logoPath: function() {
    if (this.get('isUpstream')) { return "assets/foreman.png"; } else { return "assets/Header-logotype.png"; }
  }.property('isUpstream'),

  // steps
  stepNumberOvirt: 2,

  stepNumberOpenstack: function() {
    if (this.get('isOvirt')) {
      return 3;
    } else {
      return 2;
    }
  }.property('isOvirt'),

  stepNumberCloudForms: function() {
    if (this.get('isOvirt') && this.get('isOpenStack')) {
      return 4;
    } else if (this.get('isOvirt') || this.get('isOpenStack'))  {
      return 3;
    } else {
      return 2;
    }
  }.property('isOvirt', 'isOpenStack'),

  stepNumberSubscriptions: function() {
    if (this.get('isOvirt') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return 5;
    } else if ((this.get('isOvirt') && this.get('isOpenStack')) || (this.get('isOvirt') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return 4;
    } else if (this.get('isOvirt') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return 3;
    } else {
      return 2;
    }
  }.property('isOvirt', 'isOpenStack', 'isCloudForms'),

  // calculate temporary without isSubscriptions
  stepNumberReviewTemp: function() {
    if (this.get('isOvirt') && this.get('isOpenStack') && this.get('isCloudForms')) {
      return 6;
    } else if ((this.get('isOvirt') && this.get('isOpenStack')) || (this.get('isOvirt') && this.get('isCloudForms')) ||  (this.get('isOpenStack') && this.get('isCloudForms')))  {
      return 5;
    } else if (this.get('isOvirt') || this.get('isOpenStack') || this.get('isCloudForms')) {
      return 4;
    } else {
      return 3;
    }
  }.property('isOvirt', 'isOpenStack', 'isCloudForms'),

  stepNumberReview: function() {
    if (this.get('isSubscriptions')) {
      return this.get('stepNumberReviewTemp');
    } else {
      return (this.get('stepNumberReviewTemp') - 1);
    }
  }.property('stepNumberReviewTemp', 'isSubscriptions'),

  step2RouteName: function() {
    if (this.get('isOvirt')) {
      return 'ovirt';
    } else if (this.get('isOpenStack')) {
      return 'openstack';
    } else if (this.get('isCloudForms')) {
      return 'cloudforms';
    }
  }.property('isOvirt', 'isOpenStack', 'isCloudForms'),

  step3RouteName: function() {
    if (this.get('step2RouteName') === 'ovirt') {
      if (this.get('isOpenStack')) {
        return 'openstack';
      } else if (this.get('isCloudForms')) {
        return 'cloudforms';
      } else if (this.get('isSubscriptions')) {
        return 'subscriptions';
      } else {
        return 'review'
      }
    } else if (this.get('step2RouteName') === 'openstack') {
      if (this.get('isCloudForms')) {
        return 'cloudforms';
      } else if (this.get('isSubscriptions')) {
        return 'subscriptions';
      } else {
        return 'review'
      }
    } else if (this.get('step2RouteName') === 'cloudforms') {
      if (this.get('isSubscriptions')) {
        return 'subscriptions';
      } else {
        return 'review'
      }
    }
  }.property('step2RouteName', 'isOpenStack', 'isCloudForms', 'isSubscriptions'),

});
