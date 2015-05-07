import Ember from 'ember';

export default Ember.Mixin.create({

  isUpstream: false,

  // declared in controllers, and not in mixin
  // isOvirt
  // isOpenStack
  // isCloudForms

  // route of Next button. It will be overwrriten by active hook in routes/start.js and routes/deployment-new/start.js
  satelliteTabRouteName: null,

  // disable Next button if none selected
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

  // images
  imgOvirt: function() {
    if (this.get('isUpstream')) { return "/assets/r/ovirt-640-210.png"; } else { return "/assets/r/rhci-ovirt-640-210.png"; }
  }.property('isUpstream'),

  imgOpenStack: function() {
    if (this.get('isUpstream')) { return "/assets/r/rdo-640-210.png"; } else { return "/assets/r/rhci-openstack-640-210.png"; }
  }.property('isUpstream'),

  imgCloudForms: function() {
    if (this.get('isUpstream')) { return "/assets/r/manageiq-640-210.png"; } else { return "/assets/r/rhci-cloudforms-640-210.png"; }
  }.property('isUpstream'),


});
