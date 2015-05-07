import Ember from 'ember';
import StartControllerMixin from "../../mixins/start-controller-mixin";

export default Ember.ObjectController.extend(StartControllerMixin, {

  needs: ['deployment'],

  isOvirt: Ember.computed.alias("controllers.deployment.deploy_ovirt"),
  isOpenStack: Ember.computed.alias("controllers.deployment.deploy_openstack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.deploy_cfme"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.isSubscriptions"),

});
