import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  ovirt_engine_admin_password: Ember.computed.alias("controllers.deployment.ovirt_engine_admin_password"),
  ovirt_database_name: Ember.computed.alias("controllers.deployment.ovirt_database_name"),
  ovirt_cluster_name: Ember.computed.alias("controllers.deployment.ovirt_cluster_name"),
  ovirt_storage_name: Ember.computed.alias("controllers.deployment.ovirt_storage_name"),
  ovirt_cpu_type: Ember.computed.alias("controllers.deployment.ovirt_cpu_type"),

  applicationModes: ['Both', 'Virt', 'Gluster'],
  engineLocation: ['Local', 'Remote'],
  dbSetup: ['Automatic', 'Manual'],
  yesNo: ['Yes', 'No'],
  applicationModes2: [
       {
          id: 1,
          name: 'Both',
       },
       {
          id: 2,
          name: 'Virt',
       },
       {
          id: 3,
          name: 'Gluster',
       }
  ],

});

