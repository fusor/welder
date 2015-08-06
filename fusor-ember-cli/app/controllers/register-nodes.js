import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment'],

  init: function() {
    this._super();
    this.Node = Ember.Object.extend({
      name: function () {
        var ipAddress = this.get('ipAddress');
        if (!Ember.isEmpty(ipAddress))
        {
          return ipAddress;
        }
        else
        {
          return 'Undefined node';
        }
      }.property('ipAddress'),
      driver: null,
      ipAddress: null,
      ipmiUsername: '',
      ipmiPassword: '',
      nicMacAddress: '',
      architecture: null,
      cpu: 0,
      ram: 0,
      disk: 0,

      isSelected: false,
      isActiveClass: function() {
        if (this.get('isSelected') === true)
        {
          return 'active';
        }
        else
        {
          return 'inactive';
        }
      }.property('isSelected'),
      isError: false,
      errorMessage: ''
    });
  },

  newNodes: [],
  errorNodes: [],
  edittedNodes: [],

  drivers: ['pxe_ipmitool', 'pxe_ssh'],
  architectures: ['amd64', 'x86', 'x86_64'],
  selectedNode: null,


  registrationInProgress: false,
  registerNodesModalOpened: false,
  registerNodesModalClosed: true,
  modalOpen: false,
  isUploadVisible: false,

  registrationError: function() {
    return this.get('errorNodes').length > 0;
  }.property('errorNodes', 'errorNodes.length'),

  registrationErrorMessage: function() {
    var count = this.get('errorNodes').length;
    if (count === 1) {
      return '1 node not registered';
    }
    else if (count > 1) {
      return count + ' nodes not registered';
    }
    else {
      return '';
    }
  }.property('errorNodes.length'),

  registrationErrorTip: function() {
    var tip = '';
    var errorNodes = this.get('errorNodes');

    errorNodes.forEach(function(item, index) {
      if (index > 0) {
        tip += '\n';
      }
      tip += item.errorMessage;
    });
    return tip;
  }.property('errorNodes', 'errorNodes.length'),

  preRegistered: 0,

  nodeRegComplete: function() {
    return  this.get('model').nodes.get('length') - 1 + this.get('errorNodes').length - this.get('preRegistered');
  }.property('model.nodes.length', 'errorNodes.length', 'preRegistered'),

  nodeRegTotal: function() {
    var total = this.get('nodeRegComplete') + this.get('newNodes').length;
    if (this.get('registrationInProgress') && !this.get('registrationPaused')) {
      total++;
    }
    return total;
  }.property('nodeRegComplete', 'newNodes.length', 'registrationInProgress', 'registrationPaused'),

  nodeRegPercentComplete: function() {
    var nodeRegComplete = this.get('nodeRegComplete');
    var nodeRegTotal = this.get('nodeRegTotal');
    var numSteps = nodeRegTotal * 2;
    var stepsComplete = nodeRegComplete * 2;
    if (this.get('currentNodeInitRegComplete')) {
      stepsComplete++;
    }
    return Math.round(stepsComplete / numSteps * 100);
  }.property('nodeRegComplete', 'nodeRegTotal', 'currentNodeInitRegComplete'),

  noRegisteredNodes: function() {
      return (this.get('model').nodes.get('length') < 1);
  }.property('model.nodes', 'model.nodes.length'),

  hasSelectedNode: function() {
    return this.get('selectedNode') != null;
  }.property('selectedNode'),

  nodeFormStyle:function() {
    if (this.get('edittedNodes').length > 0 && this.get('hasSelectedNode') === true)
    {
      return 'visibility:visible;';
    }
    else {
      return 'visibility:hidden;';
    }
  }.property('edittedNodes.length', 'hasSelectedNode'),

  updateNodeSelection: function(profile) {
    var oldSelection = this.get('selectedNode');
    if (oldSelection) {
      oldSelection.set('isSelected', false);
    }

    if (profile)
    {
      profile.set('isSelected', true);
    }
    this.set('selectedNode', profile);
  },

  openRegDialog: function() {
    this.set('registerNodesModalOpened', true);
    this.set('registerNodesModalClosed', false);
    this.set('modalOpen', true);
  },

  closeRegDialog: function() {
    this.set('registerNodesModalOpened', false);
    this.set('registerNodesModalClosed', true);
    this.set('modalOpen', false);
  },

  doCancelUpload: function(fileInput) {
    if (fileInput)
    {
      fileInput.value = null;
    }
    this.set('isUploadVisible', false);
  },

  actions: {
    showNodeRegistrationModal: function() {
      var newNodes = this.get('newNodes');
      var errorNodes = this.get('errorNodes');
      var edittedNodes = this.get('edittedNodes');

      edittedNodes.setObjects(errorNodes);
      newNodes.forEach(function(item) {
        edittedNodes.pushObject(item);
      });

      // Always start with at least one profile
      if (edittedNodes.length === 0) {
        var newNode = this.Node.create({});
        newNode.isDefault = true;
        edittedNodes.pushObject(newNode);
      }

      this.set('edittedNodes', edittedNodes);
      this.updateNodeSelection(edittedNodes[0]);
      this.openRegDialog();
    },

    registerNodes: function() {
      this.closeRegDialog();
      var edittedNodes = this.get('edittedNodes');
      var errorNodes = this.get('errorNodes');
      var newNodes = this.get('newNodes');
      edittedNodes.forEach(function(item) {
        item.isError = false;
        item.errorMessage = '';
        errorNodes.removeObject(item);
      });

      newNodes.setObjects(edittedNodes);
      this.set('edittedNodes', []);
      this.set('newNodes', newNodes);
      this.registerNewNodes();
    },

    cancelRegisterNodes: function() {
      this.closeRegDialog();
      this.set('edittedNodes', []);
      // Unpause if necessary
      if (this.get('registrationPaused'))
      {
        this.doNextNodeRegistration();
      }
    },

    selectNode: function(node) {
      this.updateNodeSelection(node);
    },

    addNode: function() {
      var edittedNodes = this.get('edittedNodes');
      var newNode = this.Node.create({});
      edittedNodes.insertAt(0, newNode);
      this.updateNodeSelection(newNode);
    },

    removeNode: function(node) {
      var nodes = this.get('edittedNodes');
      nodes.removeObject(node);
      this.set('edittedNodes', nodes);

      if (this.get('selectedNode') === node) {
        this.updateNodeSelection(nodes[0]);
      }
    },

    toggleUploadVisibility: function() {
      if (this.get('isUploadVisible')) {
        this.doCancelUpload();
      }
      else {
        this.set('isUploadVisible', true);
      }
    },

    readCSVFile: function(file, fileInput) {
      var me = this;
      if (file) {
        var reader = new FileReader();
        reader.onload = function() {
          var text = reader.result;
          var data = $.csv.toArrays(text);
          var edittedNodes = me.get('edittedNodes');

          // If the default added node is still listed, remove it
          if (edittedNodes.length === 1 && edittedNodes[0].isDefault && Ember.isEmpty(edittedNodes[0].get('ipAddress'))) {
            edittedNodes.removeObject(edittedNodes[0]);
          }

          for (var row in data) {
            var node_data = data[row];
            if (Array.isArray(node_data) && node_data.length >=9) {
              var memory_mb = node_data[0].trim();
              var local_gb = node_data[1].trim();
              var cpus = node_data[2].trim();
              var cpu_arch = node_data[3].trim();
              var driver = node_data[4].trim();
              var ipmi_address = node_data[5].trim();
              var ipmi_username = node_data[6].trim();
              var ipmi_password = node_data[7].trim();
              var mac_address = node_data[8].trim();

              var newNode = me.Node.create({
                driver: driver,
                ipAddress: ipmi_address,
                ipmiUsername: ipmi_username,
                ipmiPassword: ipmi_password,
                nicMacAddress: mac_address,
                architecture: cpu_arch,
                cpu: cpus,
                ram: memory_mb,
                disk: local_gb
              });
              edittedNodes.insertAt(0, newNode);
              me.updateNodeSelection(newNode);
            }
          }
          me.doCancelUpload(fileInput);
        };
        reader.onloadend = function() {
          if (reader.error) {
            console.log(reader.error.message);
          }
        };

        reader.readAsText(file);
      }
    },

    cancelUpload: function(fileInput) {
      this.doCancelUpload(fileInput);
    }
  },

  disableRegisterNodesNext: function() {
    var nodeCount = this.get('model').nodes.length;
    return (nodeCount < 2);
  }.property('model.profiles', 'model.profiles.length'),

  registerNewNodes: function() {
    var newNodes = this.get('newNodes');
    if (newNodes && newNodes.length > 0) {
      if (!this.get('registrationInProgress'))
      {
        this.set('totalProgressCount', newNodes.length * 2);
        this.set('preRegistered', this.get('model').nodes.get('length'));
        this.doNextNodeRegistration();
      }
      else if (this.get('registrationPaused')) {
        this.doNextNodeRegistration();
      }
    }
  },

  doNextNodeRegistration: function() {
    if (this.get('modalOpen') === true) {
      this.set('registrationPaused', true);
    }
    else
    {
      this.set('registrationPaused', false);

      var remaining = this.get('newNodes');
      if (remaining && remaining.length > 0)
      {
        this.set('registrationInProgress', true);
        var lastIndex = remaining.length - 1;
        var nextNode = remaining[lastIndex];
        this.set('newNodes', remaining.slice(0, lastIndex));
        this.registerNode(nextNode);
      }
      else
      {
        this.set('registrationInProgress', false);
      }
    }
  },

  getImage: function(imageName) {
    return Ember.$.getJSON('/fusor/api/openstack/images/show_by_name/' + imageName);
  },

  registerNode: function(node) {
    var me = this;
    var driverInfo = {};
    if ( node.driver === 'pxe_ssh' ) {
      driverInfo = {
        ssh_address: node.ipAddress,
        ssh_username: node.ipmiUsername,
        ssh_key_contents: node.ipmiPassword,
        ssh_virt_type: 'virsh',
        deploy_kernel: this.get('model').bmDeployKernelImage.image.id,
        deploy_ramdisk: this.get('model').bmDeployRamdiskImage.image.id
      };
    } else if (node.driver === 'pxe_ipmitool')  {
      driverInfo = {
        ipmi_address: node.ipAddress,
        ipmi_username: node.ipmiUsername,
        ipmi_password: node.ipmiPassword,
        pxe_deploy_kernel: this.get('model').bmDeployKernelImage.image.id,
        pxe_deploy_ramdisk: this.get('model').bmDeployRamdiskImage.image.id
      };
    }
    var createdNode = me.store.createRecord('node', {
      driver: node.driver,
      driver_info: driverInfo,
      properties: {
        memory_mb: node.ram,
        cpus: node.cpu,
        local_gb: node.disk,
        cpu_arch: node.architecture,
        capabilities: 'boot_option:local'
      },
      address: node.nicMacAddress
    });

    var handleSuccess = function(node) {
      this.set('currentNodeInitRegComplete', true);
      me.checkForNodeRegistrationComplete(node);

    };
    var handleFailure = function(reason) {
      me.set('currentNodeInitRegComplete', true);
      // TODO: Remove this, should not continue if initial save fails
      me.checkForNodeRegistrationComplete(node, reason);

      // TODO: Uncomment this
      /*
      me.get('model').nodes.get('content').removeObject(createdNode);
      node.errorMessage = node.ipAddress + ": " + me.getErrorMessageFromReason(reason);
      me.get('errorNodes').pushObject(node);
      me.doNextNodeRegistration();
      */
    };

    this.set('currentNodeInitRegComplete', false);
    createdNode.save().then(handleSuccess).catch(handleFailure);
  },

  getErrorMessageFromReason: function(reason) {
    try {
      var displayMessage = reason.responseJSON.displayMessage;
      displayMessage = displayMessage.substring(displayMessage.indexOf('{'),displayMessage.indexOf('}') + 1) + "}";
      displayMessage = displayMessage.replace(/\\/g, "");
      displayMessage = displayMessage.replace(/"\{/g, "{");

      var errorObj = JSON.parse(displayMessage);
      return errorObj.error_message.faultstring;
    }
    catch (e) {
      return reason.statusText;
    }
  },

  // TODO: remove failed param
  checkForNodeRegistrationComplete: function(node, reason) {
    var me = this;
    var iterationCount = 0;

    var promiseFunction = function(resolve) {
      var checkForDone = function() {
        /* TODO: Update this code to make approprate call and check results appropriately
        Ember.$.ajax({
          url: '/fusor/api/openstack/deployment_plans/' + plan.get('id') + '/update_parameters',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({ 'parameters': params }),
          success: function() {
            // check if return status indicates the node registration completed and was successful
            if (status === SUCCESS) {
              resolve(true);
            }
            else if (status === PENDING) {
              resolve(false)
            }
            else if (status === FAILURE) {
              resolve(true, reason);
            }
          },
          error: function(error) {
            resolve(true, error);
          }
        });
        ***************************************************************/
        if (iterationCount === 5) {
          resolve(true, reason);
        }
        else {
          resolve(false);
        }
      };

      Ember.run.later(checkForDone, 3000);
    };

    var fulfill = function(isDone, failReason) {
      if (isDone)
      {
        if (failReason) {
          me.get('model').nodes.get('content').removeObject(node);
          node.errorMessage = node.ipAddress + ": " + me.getErrorMessageFromReason(reason);
          me.get('errorNodes').pushObject(node);
        }
        else {
          me.get('model').nodes.pushObject(node);
        }
        me.doNextNodeRegistration();
      }
      else {
        iterationCount++;
        var promise = new Ember.RSVP.Promise(promiseFunction);
        promise.then(fulfill);
      }
    };

    var promise = new Ember.RSVP.Promise(promiseFunction);
    promise.then(fulfill);
  }
});
