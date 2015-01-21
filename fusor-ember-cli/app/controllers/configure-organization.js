import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['organization', 'organizations', 'satellite/index'],

  fields_org: {},

  deploymentName: Ember.computed.alias("controllers.satellite/index.name"),
  defaultOrgName: function () {
    return this.getWithDefault('defaultOrg', this.get('deploymentName'));
  }.property(),

  selectedOrganzation: "Default_Organization",

  rhciModalButtons: [
      Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'}),
      Ember.Object.create({title: 'Create', clicked:"createOrganization", type: 'primary'})
  ],

  actions: {
    createOrganization: function() {
      //if (this.get('fields.isDirty')) {
        this.set('fields_org.name', this.get('defaultOrgName'));
        var organization = this.store.createRecord('organization', this.get('fields_org'));
        this.set('selectedOrganzation', organization.get('name'));
        this.set('fields_org',{});
      //}
      return Bootstrap.ModalManager.hide('newOrganizationModal');
    },
  }

});
