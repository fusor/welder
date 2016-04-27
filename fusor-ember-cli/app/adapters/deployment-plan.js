import DS from 'ember-data';
import Ember from 'ember';

export default DS.ActiveModelAdapter.extend({

    // 'overcloud' is harded
    // ex. /fusor/api/openstack/deployments/:id/deployment_plans/overcloud
    urlForFindRecord(id, modelName, snapshot) {
        return '/fusor/api/openstack/deployments/' + id + '/deployment_plans/overcloud';
    }

});
