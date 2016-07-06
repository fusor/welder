import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Mixin.create({

  actions: {
    refreshDiscoveredHosts() {
      console.log('refresh allDiscoveredHosts');
      var controller = this.get('controller');
      controller.set('isLoadingHosts', true);
      this.store.query('discovered-host', {page: 1, search: ''}).then(function(results) {
        controller.set('page', 1);
        controller.set('search', '');
        controller.set('allDiscoveredHosts', results.filterBy('is_discovered', true));
        controller.set('totalCnt', results.get('meta.total'));
        controller.set('pageNumber', results.get('meta.page'));
        controller.set('totalPages', results.get('meta.total_pages'));
        controller.set('pageRange', _.range(1, results.get('meta.total_pages') + 1));
        controller.set('isLoadingHosts', false);
      });
    }
  }

});
