import Ember from 'ember';
import DiscoveredHostRouteMixin from "../../mixins/discovered-host-route-mixin";
import PaginationRouteMixin from "../../mixins/pagination-route-mixin";
import request from 'ic-ajax';
import _ from 'lodash/lodash';

export default Ember.Route.extend(DiscoveredHostRouteMixin, PaginationRouteMixin, {

  model(params) {
    const hypervisor_hosts = this.modelFor('deployment').get('discovered_hosts');
    const discovered_hosts = this.getDiscoveredHosts(params);
    return Ember.RSVP.hash({
      hypervisor_hosts,
      discovered_hosts
    });
  },

  getDiscoveredHosts(params) {
    // note, this function does NOT set isLoadingHosts to true and then false
    // otherwise, it would show the loading spinner for each search and sort
    var controller = this.controllerFor('hypervisor/discovered_host');
    if (this.modelFor('deployment').get('isNotStarted')) {
      // set query params
      let sort_by = params['sort_by'] || 'name';
      let dir = params['dir'] || 'ASC';
      let page = params['page'] || 1;
      params['order'] = sort_by + ' ' + dir;
      // params to back server backend
      params['deployment_id'] = this.modelFor('deployment').get('id');
      params['type'] = 'hypervisor';
      return this.store.query('discovered-host', params).then(function(results) {
        controller.set('allDiscoveredHosts', results.filterBy('is_discovered', true));
        controller.set('totalCnt', results.get('meta.total'));
        controller.set('pageNumber', results.get('meta.page'));
        controller.set('totalPages', results.get('meta.total_pages'));
        controller.set('pageRange', _.range(1, results.get('meta.total_pages') + 1));
      });
    }
  },

  deactivate() {
    return this.send('saveHyperVisors', null);
  },

  actions: {
    saveHyperVisors(redirectPath) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var hypervisorModelIds = this.controllerFor('hypervisor/discovered-host').get('hypervisorModelIds');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      request({
        url: '/fusor/api/v21/deployments/' + deployment.get('id'),
        type: "PUT",
        data: JSON.stringify({'deployment': { 'discovered_host_ids': hypervisorModelIds } }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
          "Authorization": "Basic " + self.get('session.basicAuthToken')
        }
      }).then(function(response) {
        if (redirectPath) {
          self.transitionTo('rhev-options');
        }
      }, function(error) {
        console.log(error);
      });
    }
  }

});
