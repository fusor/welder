export default [{
    "name": "overcloud",
    "parameters": {
      "AdminPassword": {
        "Default": "dog8code",
        "Description": "The password for the keystone admin account, used for monitoring, querying neutron etc.",
        "Label": "AdminPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "dog8code"
      },
      "AdminToken": {
        "Default": "3c82c0c4e07cc3231700b9862bc5c27c",
        "Description": "The keystone auth secret and db password.",
        "Label": "AdminToken",
        "NoEcho": "true",
        "Type": "String",
        "Value": "3c82c0c4e07cc3231700b9862bc5c27c"
      },
      "BlockStorageCount": {
        "Default": 0,
        "Description": "",
        "Label": "BlockStorageCount",
        "NoEcho": "false",
        "Type": "Number"
      },
      "BlockStorageExtraConfig": {
        "Default": {},
        "Description": "BlockStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
        "Label": "BlockStorageExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "BlockStorageHostnameFormat": {
        "Default": "%stackname%-blockstorage-%index%",
        "Description": "Format for BlockStorage node hostnames",
        "Label": "BlockStorageHostnameFormat",
        "NoEcho": "false",
        "Type": "String"
      },
      "BlockStorageImage": {
        "Default": "overcloud-full",
        "Description": "",
        "Label": "BlockStorageImage",
        "NoEcho": "false",
        "Type": "String"
      },
      "BlockStorageRemovalPolicies": {
        "Default": [],
        "Description": "List of resources to be removed from BlockStorageResourceGroup when doing an update which requires removal of specific resources.\n",
        "Label": "BlockStorageRemovalPolicies",
        "NoEcho": "false",
        "Type": "Json"
      },
      "BlockStorageSchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "BlockStorageSchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CeilometerBackend": {
        "Default": "mongodb",
        "Description": "The ceilometer backend type.",
        "Label": "CeilometerBackend",
        "NoEcho": "false",
        "Type": "String",
        "Value": "mongodb"
      },
      "CeilometerComputeAgent": {
        "AllowedValues": [
          "",
          "Present"
        ],
        "Default": "",
        "Description": "Indicates whether the Compute agent is present and expects nova-compute to be configured accordingly",
        "Label": "CeilometerComputeAgent",
        "NoEcho": "false",
        "Type": "String"
      },
      "CeilometerMeteringSecret": {
        "Default": "1acb6c4477838038af1e9fa98ce36162",
        "Description": "Secret shared by the ceilometer services.",
        "Label": "CeilometerMeteringSecret",
        "NoEcho": "true",
        "Type": "String",
        "Value": "1acb6c4477838038af1e9fa98ce36162"
      },
      "CeilometerPassword": {
        "Default": "9903bfaaa0bbc9f1fb815b200048b368",
        "Description": "The password for the ceilometer service  and db account.",
        "Label": "CeilometerPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "9903bfaaa0bbc9f1fb815b200048b368"
      },
      "CephAdminKey": {
        "Default": "",
        "Description": "The Ceph admin client key. Can be created with ceph-authtool --gen-print-key.",
        "Label": "CephAdminKey",
        "NoEcho": "true",
        "Type": "String"
      },
      "CephClientKey": {
        "Default": "",
        "Description": "The Ceph client key. Can be created with ceph-authtool --gen-print-key. Currently only used for external Ceph deployments to create the openstack user keyring.",
        "Label": "CephClientKey",
        "NoEcho": "true",
        "Type": "String"
      },
      "CephClusterFSID": {
        "Default": "",
        "Description": "The Ceph cluster FSID. Must be a UUID.",
        "Label": "CephClusterFSID",
        "NoEcho": "false",
        "Type": "String"
      },
      "CephExternalMonHost": {
        "Default": "",
        "Description": "List of externally managed Ceph Mon Host IPs. Only used for external Ceph deployments.",
        "Label": "CephExternalMonHost",
        "NoEcho": "false",
        "Type": "String"
      },
      "CephMonKey": {
        "Default": "",
        "Description": "The Ceph monitors key. Can be created with ceph-authtool --gen-print-key.",
        "Label": "CephMonKey",
        "NoEcho": "true",
        "Type": "String"
      },
      "CephStorageCount": {
        "Default": 0,
        "Description": "",
        "Label": "CephStorageCount",
        "NoEcho": "false",
        "Type": "Number"
      },
      "CephStorageExtraConfig": {
        "Default": {},
        "Description": "CephStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
        "Label": "CephStorageExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CephStorageHostnameFormat": {
        "Default": "%stackname%-cephstorage-%index%",
        "Description": "Format for CephStorage node hostnames",
        "Label": "CephStorageHostnameFormat",
        "NoEcho": "false",
        "Type": "String"
      },
      "CephStorageImage": {
        "Default": "overcloud-full",
        "Description": "",
        "Label": "CephStorageImage",
        "NoEcho": "false",
        "Type": "String"
      },
      "CephStorageRemovalPolicies": {
        "Default": [],
        "Description": "List of resources to be removed from CephStorageResourceGroup when doing an update which requires removal of specific resources.\n",
        "Label": "CephStorageRemovalPolicies",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CephStorageSchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "CephStorageSchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CinderEnableIscsiBackend": {
        "Default": true,
        "Description": "Whether to enable or not the Iscsi backend for Cinder",
        "Label": "CinderEnableIscsiBackend",
        "NoEcho": "false",
        "Type": "Boolean",
        "Value": true
      },
      "CinderEnableNfsBackend": {
        "Default": false,
        "Description": "Whether to enable or not the NFS backend for Cinder",
        "Label": "CinderEnableNfsBackend",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "CinderEnableRbdBackend": {
        "Default": false,
        "Description": "Whether to enable or not the Rbd backend for Cinder",
        "Label": "CinderEnableRbdBackend",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "CinderISCSIHelper": {
        "Default": "lioadm",
        "Description": "The iSCSI helper to use with cinder.",
        "Label": "CinderISCSIHelper",
        "NoEcho": "false",
        "Type": "String",
        "Value": "lioadm"
      },
      "CinderLVMLoopDeviceSize": {
        "Default": 10280,
        "Description": "The size of the loopback file used by the cinder LVM driver.",
        "Label": "CinderLVMLoopDeviceSize",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 10280
      },
      "CinderNfsMountOptions": {
        "Default": "",
        "Description": "Mount options for NFS mounts used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
        "Label": "CinderNfsMountOptions",
        "NoEcho": "false",
        "Type": "String"
      },
      "CinderNfsServers": {
        "Default": "",
        "Description": "NFS servers used by Cinder NFS backend. Effective when CinderEnableNfsBackend is true.\n",
        "Label": "CinderNfsServers",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "CinderPassword": {
        "Default": "710e6ee5d9a574e1db27573f9d445b1a",
        "Description": "The password for the cinder service and db account, used by cinder-api.",
        "Label": "CinderPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "710e6ee5d9a574e1db27573f9d445b1a"
      },
      "CloudDomain": {
        "Default": "",
        "Description": "The DNS domain used for the hosts. This should match the dhcp_domain configured in the Undercloud neutron. Defaults to localdomain.\n",
        "Label": "CloudDomain",
        "NoEcho": "false",
        "Type": "String",
        "Value": "localdomain"
      },
      "CloudName": {
        "Default": "overcloud",
        "Description": "The DNS name of this cloud. e.g. ci-overcloud.tripleo.org",
        "Label": "CloudName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "overcloud"
      },
      "ComputeCount": {
        "Default": 1,
        "Description": "",
        "Label": "ComputeCount",
        "NoEcho": "false",
        "Type": "Number"
      },
      "ComputeHostnameFormat": {
        "Default": "%stackname%-compute-%index%",
        "Description": "Format for Compute node hostnames",
        "Label": "ComputeHostnameFormat",
        "NoEcho": "false",
        "Type": "String"
      },
      "ComputeRemovalPolicies": {
        "Default": [],
        "Description": "List of resources to be removed from ComputeResourceGroup when doing an update which requires removal of specific resources.\n",
        "Label": "ComputeRemovalPolicies",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ControlFixedIPs": {
        "Default": [],
        "Description": "Should be used for arbitrary ips.",
        "Label": "ControlFixedIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ControlVirtualInterface": {
        "Default": "br-ex",
        "Description": "Interface where virtual ip will be assigned.",
        "Label": "ControlVirtualInterface",
        "NoEcho": "false",
        "Type": "String",
        "Value": "br-ex"
      },
      "ControllerCount": {
        "Default": 1,
        "Description": "",
        "Label": "ControllerCount",
        "MinValue": 1,
        "NoEcho": "false",
        "Type": "Number"
      },
      "ControllerEnableCephStorage": {
        "Default": false,
        "Description": "Whether to deploy Ceph Storage (OSD) on the Controller",
        "Label": "ControllerEnableCephStorage",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "ControllerEnableSwiftStorage": {
        "Default": true,
        "Description": "Whether to enable Swift Storage on the Controller",
        "Label": "ControllerEnableSwiftStorage",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "ControllerHostnameFormat": {
        "Default": "%stackname%-controller-%index%",
        "Description": "Format for Controller node hostnames",
        "Label": "ControllerHostnameFormat",
        "NoEcho": "false",
        "Type": "String"
      },
      "ControllerRemovalPolicies": {
        "Default": [],
        "Description": "List of resources to be removed from ControllerResourceGroup when doing an update which requires removal of specific resources.\n",
        "Label": "ControllerRemovalPolicies",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ControllerSchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "ControllerSchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CorosyncIPv6": {
        "Default": false,
        "Description": "Enable IPv6 in Corosync",
        "Label": "CorosyncIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "Debug": {
        "Default": "",
        "Description": "Set to True to enable debugging on all services.",
        "Label": "Debug",
        "NoEcho": "false",
        "Type": "String"
      },
      "DeployIdentifier": {
        "Description": "Setting this to a unique value will re-run any deployment tasks which perform configuration on a Heat stack-update.\n",
        "Label": "DeployIdentifier",
        "NoEcho": "false",
        "Type": "String"
      },
      "EnableFencing": {
        "Default": false,
        "Description": "Whether to enable fencing in Pacemaker or not.",
        "Label": "EnableFencing",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "EnableGalera": {
        "Default": true,
        "Description": "Whether to use Galera instead of regular MariaDB.",
        "Label": "EnableGalera",
        "NoEcho": "false",
        "Type": "Boolean",
        "Value": true
      },
      "ExtraConfig": {
        "Default": {},
        "Description": "Additional hieradata to inject into the cluster, note that\nControllerExtraConfig takes precedence over ExtraConfig.\n",
        "Label": "ExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "FencingConfig": {
        "Default": {},
        "Description": "Pacemaker fencing configuration. The JSON should have\nthe following structure:\n  {\n    \"devices\": [\n      {\n        \"agent\": \"AGENT_NAME\",\n        \"host_mac\": \"HOST_MAC_ADDRESS\",\n        \"params\": {\"PARAM_NAME\": \"PARAM_VALUE\"}\n      }\n    ]\n  }\nFor instance:\n  {\n    \"devices\": [\n      {\n        \"agent\": \"fence_xvm\",\n        \"host_mac\": \"52:54:00:aa:bb:cc\",\n        \"params\": {\n          \"multicast_address\": \"225.0.0.12\",\n          \"port\": \"baremetal_0\",\n          \"manage_fw\": true,\n          \"manage_key_file\": true,\n          \"key_file\": \"/etc/fence_xvm.key\",\n          \"key_file_password\": \"abcdef\"\n        }\n      }\n    ]\n  }\n",
        "Label": "FencingConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "GlanceBackend": {
        "AllowedValues": [
          "swift",
          "file",
          "rbd"
        ],
        "Default": "swift",
        "Description": "The short name of the Glance backend to use. Should be one of swift, rbd, or file",
        "Label": "GlanceBackend",
        "NoEcho": "false",
        "Type": "String",
        "Value": "swift"
      },
      "GlanceLogFile": {
        "Default": "",
        "Description": "The filepath of the file to use for logging messages from Glance.",
        "Label": "GlanceLogFile",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceNotifierStrategy": {
        "Default": "noop",
        "Description": "Strategy to use for Glance notification queue",
        "Label": "GlanceNotifierStrategy",
        "NoEcho": "false",
        "Type": "String",
        "Value": "noop"
      },
      "GlancePassword": {
        "Default": "b0257190f4f65dbde611fb136cbd6b1b",
        "Description": "The password for the glance service and db account, used by the glance services.",
        "Label": "GlancePassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "b0257190f4f65dbde611fb136cbd6b1b"
      },
      "HAProxySyslogAddress": {
        "Default": "/dev/log",
        "Description": "Syslog address where HAproxy will send its log",
        "Label": "HAProxySyslogAddress",
        "NoEcho": "false",
        "Type": "String",
        "Value": "/dev/log"
      },
      "HeatPassword": {
        "Default": "5c716d34c86154d05b1179a05b370852",
        "Description": "The password for the Heat service and db account, used by the Heat services.",
        "Label": "HeatPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "5c716d34c86154d05b1179a05b370852"
      },
      "HeatStackDomainAdminPassword": {
        "Default": "744173e0484227dbb9ffb18b1617bb33",
        "Description": "Password for heat_stack_domain_admin user.",
        "Label": "HeatStackDomainAdminPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "744173e0484227dbb9ffb18b1617bb33"
      },
      "HorizonAllowedHosts": {
        "Default": "*",
        "Description": "A list of IP/Hostname allowed to connect to horizon",
        "Label": "HorizonAllowedHosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "*"
      },
      "HypervisorNeutronPhysicalBridge": {
        "Default": "br-ex",
        "Description": "An OVS bridge to create on each hypervisor. This defaults to br-ex the same as the control plane nodes, as we have a uniform configuration of the openvswitch agent. Typically should not need to be changed.\n",
        "Label": "HypervisorNeutronPhysicalBridge",
        "NoEcho": "false",
        "Type": "String"
      },
      "HypervisorNeutronPublicInterface": {
        "Default": "nic1",
        "Description": "What interface to add to the HypervisorNeutronPhysicalBridge.",
        "Label": "HypervisorNeutronPublicInterface",
        "NoEcho": "false",
        "Type": "String"
      },
      "ImageUpdatePolicy": {
        "Default": "REBUILD_PRESERVE_EPHEMERAL",
        "Description": "What policy to use when reconstructing instances. REBUILD for rebuilds, REBUILD_PRESERVE_EPHEMERAL to preserve /mnt.",
        "Label": "ImageUpdatePolicy",
        "NoEcho": "false",
        "Type": "String",
        "Value": "REBUILD_PRESERVE_EPHEMERAL"
      },
      "InstanceNameTemplate": {
        "Default": "instance-%08x",
        "Description": "Template string to be used to generate instance names",
        "Label": "InstanceNameTemplate",
        "NoEcho": "false",
        "Type": "String",
        "Value": "instance-%08x"
      },
      "InternalApiVirtualFixedIPs": {
        "Default": [],
        "Description": "Control the IP allocation for the InternalApiVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
        "Label": "InternalApiVirtualFixedIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "KeyName": {
        "CustomConstraint": "nova.keypair",
        "Default": "default",
        "Description": "Name of an existing EC2 KeyPair to enable SSH access to the instances",
        "Label": "KeyName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "default"
      },
      "KeystoneCACertificate": {
        "Default": "",
        "Description": "Keystone self-signed certificate authority certificate.",
        "Label": "KeystoneCACertificate",
        "NoEcho": "false",
        "Type": "String"
      },
      "KeystoneNotificationDriver": {
        "Default": [
          "messaging"
        ],
        "Description": "Comma-separated list of Oslo notification drivers used by Keystone",
        "Label": "KeystoneNotificationDriver",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "messaging"
      },
      "KeystoneNotificationFormat": {
        "AllowedValues": [
          "basic",
          "cadf"
        ],
        "Default": "basic",
        "Description": "The Keystone notification format",
        "Label": "KeystoneNotificationFormat",
        "NoEcho": "false",
        "Type": "String",
        "Value": "basic"
      },
      "KeystoneSSLCertificate": {
        "Default": "",
        "Description": "Keystone certificate for verifying token validity.",
        "Label": "KeystoneSSLCertificate",
        "NoEcho": "false",
        "Type": "String"
      },
      "KeystoneSSLCertificateKey": {
        "Default": "",
        "Description": "Keystone key for signing tokens.",
        "Label": "KeystoneSSLCertificateKey",
        "NoEcho": "true",
        "Type": "String"
      },
      "KeystoneSigningCertificate": {
        "Default": "",
        "Description": "Keystone certificate for verifying token validity.",
        "Label": "KeystoneSigningCertificate",
        "NoEcho": "false",
        "Type": "String"
      },
      "KeystoneSigningKey": {
        "Default": "",
        "Description": "Keystone key for signing tokens.",
        "Label": "KeystoneSigningKey",
        "NoEcho": "true",
        "Type": "String"
      },
      "ManageFirewall": {
        "Default": false,
        "Description": "Whether to manage IPtables rules.",
        "Label": "ManageFirewall",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "MemcachedIPv6": {
        "Default": false,
        "Description": "Enable IPv6 features in Memcached.",
        "Label": "MemcachedIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "MongoDbIPv6": {
        "Default": false,
        "Description": "Enable IPv6 if Mongo DB VIP is IPv6",
        "Label": "MongoDbIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "MongoDbNoJournal": {
        "Default": false,
        "Description": "Should MongoDb journaling be disabled",
        "Label": "MongoDbNoJournal",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "MysqlInnodbBufferPoolSize": {
        "Default": 0,
        "Description": "Specifies the size of the buffer pool in megabytes. Setting to zero should be interpreted as \"no value\" and will defer to the lower level default.\n",
        "Label": "MysqlInnodbBufferPoolSize",
        "NoEcho": "false",
        "Type": "Number"
      },
      "MysqlMaxConnections": {
        "Default": 4096,
        "Description": "Configures MySQL max_connections config setting",
        "Label": "MysqlMaxConnections",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 4096
      },
      "NeutronAgentExtensions": {
        "Default": "qos",
        "Description": "Comma-separated list of extensions enabled for the Neutron agents.\n",
        "Label": "NeutronAgentExtensions",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "qos"
      },
      "NeutronAgentMode": {
        "Default": "dvr_snat",
        "Description": "Agent mode for the neutron-l3-agent on the controller hosts",
        "Label": "NeutronAgentMode",
        "NoEcho": "false",
        "Type": "String",
        "Value": "dvr_snat"
      },
      "NeutronAllowL3AgentFailover": {
        "Default": "True",
        "Description": "Allow automatic l3-agent failover",
        "Label": "NeutronAllowL3AgentFailover",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "NeutronBridgeMappings": {
        "Default": "datacentre:br-ex",
        "Description": "The OVS logical->physical bridge mappings to use. See the Neutron documentation for details. Defaults to mapping br-ex - the external bridge on hosts - to a physical name 'datacentre' which can be used to create provider networks (and we use this for the default floating network) - if changing this either use different post-install network scripts or be sure to keep 'datacentre' as a mapping network name.\n",
        "Label": "NeutronBridgeMappings",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "datacentre:br-ex"
      },
      "NeutronComputeAgentMode": {
        "Default": "dvr",
        "Description": "Agent mode for the neutron-l3-agent on the compute hosts",
        "Label": "NeutronComputeAgentMode",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronControlPlaneID": {
        "Default": "ctlplane",
        "Description": "Neutron ID or name for ctlplane network.",
        "Label": "NeutronControlPlaneID",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronCorePlugin": {
        "Default": "ml2",
        "Description": "The core plugin for Neutron. The value should be the entrypoint to be loaded\nfrom neutron.core_plugins namespace.\n",
        "Label": "NeutronCorePlugin",
        "NoEcho": "false",
        "Type": "String",
        "Value": "ml2"
      },
      "NeutronDVR": {
        "Default": "False",
        "Description": "Whether to configure Neutron Distributed Virtual Routers",
        "Label": "NeutronDVR",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "NeutronDhcpAgentsPerNetwork": {
        "Default": 3,
        "Description": "The number of neutron dhcp agents to schedule per network",
        "Label": "NeutronDhcpAgentsPerNetwork",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 1
      },
      "NeutronDnsmasqOptions": {
        "Default": "dhcp-option-force=26,1400",
        "Description": "Dnsmasq options for neutron-dhcp-agent. The default value here forces MTU to be set to 1400 to account for the gre tunnel overhead.",
        "Label": "NeutronDnsmasqOptions",
        "NoEcho": "false",
        "Type": "String",
        "Value": "dhcp-option-force=26,1400"
      },
      "NeutronEnableIsolatedMetadata": {
        "Default": "False",
        "Description": "If True, DHCP provide metadata route to VM.",
        "Label": "NeutronEnableIsolatedMetadata",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "NeutronEnableL2Pop": {
        "Default": "False",
        "Description": "Enable/disable the L2 population feature in the Neutron agents.\n",
        "Label": "NeutronEnableL2Pop",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "NeutronEnableTunnelling": {
        "Default": "True",
        "Description": "",
        "Label": "NeutronEnableTunnelling",
        "NoEcho": "false",
        "Type": "String",
        "Value": "True"
      },
      "NeutronExternalNetworkBridge": {
        "Default": "br-ex",
        "Description": "Name of bridge used for external network traffic.",
        "Label": "NeutronExternalNetworkBridge",
        "NoEcho": "false",
        "Type": "String",
        "Value": "br-ex"
      },
      "NeutronFlatNetworks": {
        "Default": "datacentre",
        "Description": "If set, flat networks to configure in neutron plugins.",
        "Label": "NeutronFlatNetworks",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "datacentre"
      },
      "NeutronL3HA": {
        "Default": "False",
        "Description": "Whether to enable l3-agent HA",
        "Label": "NeutronL3HA",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "NeutronMechanismDrivers": {
        "Default": "openvswitch",
        "Description": "The mechanism drivers for the Neutron tenant network.\n",
        "Label": "NeutronMechanismDrivers",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "openvswitch"
      },
      "NeutronMetadataProxySharedSecret": {
        "Default": "8593c8247d06e39ced4a0853b5a0fa20",
        "Description": "Shared secret to prevent spoofing",
        "Label": "NeutronMetadataProxySharedSecret",
        "NoEcho": "true",
        "Type": "String",
        "Value": "8593c8247d06e39ced4a0853b5a0fa20"
      },
      "NeutronNetworkType": {
        "Default": "vxlan",
        "Description": "The tenant network type for Neutron.",
        "Label": "NeutronNetworkType",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "vxlan"
      },
      "NeutronNetworkVLANRanges": {
        "Default": "datacentre:1:1000",
        "Description": "The Neutron ML2 and OpenVSwitch vlan mapping range to support. See the Neutron documentation for permitted values. Defaults to permitting any VLAN on the 'datacentre' physical network (See NeutronBridgeMappings).\n",
        "Label": "NeutronNetworkVLANRanges",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "datacentre:1:1000"
      },
      "NeutronPassword": {
        "Default": "56ae59a1722c8116e2f9c5bf613ea8cf",
        "Description": "The password for the neutron service and db account, used by neutron agents.",
        "Label": "NeutronPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "56ae59a1722c8116e2f9c5bf613ea8cf"
      },
      "NeutronPluginExtensions": {
        "Default": "qos,port_security",
        "Description": "Comma-separated list of extensions enabled for the Neutron plugin.\n",
        "Label": "NeutronPluginExtensions",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "qos,port_security"
      },
      "NeutronPublicInterface": {
        "Default": "nic2",
        "Description": "What interface to bridge onto br-ex for network nodes.",
        "Label": "NeutronPublicInterface",
        "NoEcho": "false",
        "Type": "String",
        "Value": "nic2"
      },
      "NeutronPublicInterfaceDefaultRoute": {
        "Default": "",
        "Description": "A custom default route for the NeutronPublicInterface.",
        "Label": "NeutronPublicInterfaceDefaultRoute",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronPublicInterfaceIP": {
        "Default": "",
        "Description": "A custom IP address to put onto the NeutronPublicInterface.",
        "Label": "NeutronPublicInterfaceIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronPublicInterfaceRawDevice": {
        "Default": "",
        "Description": "If set, the public interface is a vlan with this device as the raw device.",
        "Label": "NeutronPublicInterfaceRawDevice",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronPublicInterfaceTag": {
        "Default": "",
        "Description": "VLAN tag for creating a public VLAN. The tag will be used to create an access port on the exterior bridge for each control plane node, and that port will be given the IP address returned by neutron from the public network. Set CONTROLEXTRA=overcloud-vlan-port.yaml when compiling overcloud.yaml to include the deployment of VLAN ports to the control plane.\n",
        "Label": "NeutronPublicInterfaceTag",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronServicePlugins": {
        "Default": "router,qos",
        "Description": "Comma-separated list of service plugin entrypoints to be loaded from the\nneutron.service_plugins namespace.\n",
        "Label": "NeutronServicePlugins",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "router,qos"
      },
      "NeutronTenantMtu": {
        "Default": 1400,
        "Description": "The default MTU for tenant networks. For VXLAN/GRE tunneling, this should be at least 50 bytes smaller than the MTU on the physical network. This value will be used to set the MTU on the virtual Ethernet device. This number is related to the value of NeutronDnsmasqOptions, since that will determine the MTU that is assigned to the VM host through DHCP.\n",
        "Label": "NeutronTenantMtu",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 1400
      },
      "NeutronTunnelIdRanges": {
        "Default": [
          "1:4094"
        ],
        "Description": "Comma-separated list of <tun_min>:<tun_max> tuples enumerating ranges\nof GRE tunnel IDs that are available for tenant network allocation\n",
        "Label": "NeutronTunnelIdRanges",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "NeutronTunnelTypes": {
        "Default": "vxlan",
        "Description": "The tunnel types for the Neutron tenant network.\n",
        "Label": "NeutronTunnelTypes",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "vxlan"
      },
      "NeutronTypeDrivers": {
        "Default": "vxlan,vlan,flat,gre",
        "Description": "Comma-separated list of network type driver entrypoints to be loaded.\n",
        "Label": "NeutronTypeDrivers",
        "NoEcho": "false",
        "Type": "CommaDelimitedList",
        "Value": "vxlan,vlan,flat,gre"
      },
      "NeutronVniRanges": {
        "Default": [
          "1:4094"
        ],
        "Description": "Comma-separated list of <vni_min>:<vni_max> tuples enumerating ranges\nof VXLAN VNI IDs that are available for tenant network allocation\n",
        "Label": "NeutronVniRanges",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "NovaComputeDriver": {
        "Default": "libvirt.LibvirtDriver",
        "Description": "",
        "Label": "NovaComputeDriver",
        "NoEcho": "false",
        "Type": "String",
        "Value": "libvirt.LibvirtDriver"
      },
      "NovaComputeExtraConfig": {
        "Default": {},
        "Description": "NovaCompute specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
        "Label": "NovaComputeExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "NovaComputeLibvirtType": {
        "Default": "kvm",
        "Description": "",
        "Label": "NovaComputeLibvirtType",
        "NoEcho": "false",
        "Type": "String",
        "Value": "kvm"
      },
      "NovaComputeLibvirtVifDriver": {
        "Default": "",
        "Description": "Libvirt VIF driver configuration for the network",
        "Label": "NovaComputeLibvirtVifDriver",
        "NoEcho": "false",
        "Type": "String"
      },
      "NovaComputeSchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "NovaComputeSchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "NovaEnableRbdBackend": {
        "Default": false,
        "Description": "Whether to enable or not the Rbd backend for Nova",
        "Label": "NovaEnableRbdBackend",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NovaIPv6": {
        "Default": false,
        "Description": "Enable IPv6 features in Nova",
        "Label": "NovaIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NovaImage": {
        "CustomConstraint": "glance.image",
        "Default": "overcloud-full",
        "Description": "",
        "Label": "NovaImage",
        "NoEcho": "false",
        "Type": "String"
      },
      "NovaOVSBridge": {
        "Default": "br-int",
        "Description": "Name of integration bridge used by Open vSwitch",
        "Label": "NovaOVSBridge",
        "NoEcho": "false",
        "Type": "String",
        "Value": "br-int"
      },
      "NovaPassword": {
        "Default": "cff84b00b35873d979a4acd7dc0a5e8f",
        "Description": "The password for the nova service and db account, used by nova-api.",
        "Label": "NovaPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "cff84b00b35873d979a4acd7dc0a5e8f"
      },
      "NovaSecurityGroupAPI": {
        "Default": "neutron",
        "Description": "The full class name of the security API class",
        "Label": "NovaSecurityGroupAPI",
        "NoEcho": "false",
        "Type": "String",
        "Value": "neutron"
      },
      "NtpServer": {
        "Default": "",
        "Description": "Comma-separated list of ntp servers",
        "Label": "NtpServer",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ObjectStorageCount": {
        "Default": 0,
        "Description": "",
        "Label": "ObjectStorageCount",
        "NoEcho": "false",
        "Type": "Number"
      },
      "ObjectStorageExtraConfig": {
        "Default": {},
        "Description": "ObjectStorage specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
        "Label": "ObjectStorageExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ObjectStorageHostnameFormat": {
        "Default": "%stackname%-objectstorage-%index%",
        "Description": "Format for SwiftStorage node hostnames",
        "Label": "ObjectStorageHostnameFormat",
        "NoEcho": "false",
        "Type": "String"
      },
      "ObjectStorageRemovalPolicies": {
        "Default": [],
        "Description": "List of resources to be removed from ObjectStorageResourceGroup when doing an update which requires removal of specific resources.\n",
        "Label": "ObjectStorageRemovalPolicies",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ObjectStorageSchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "ObjectStorageSchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "OvercloudBlockStorageFlavor": {
        "CustomConstraint": "nova.flavor",
        "Default": "Flavor-16-x86_64-16384-99",
        "Description": "Flavor for block storage nodes to request when deploying.",
        "Label": "OvercloudBlockStorageFlavor",
        "NoEcho": "false",
        "Type": "String"
      },
      "OvercloudCephStorageFlavor": {
        "CustomConstraint": "nova.flavor",
        "Default": "Flavor-16-x86_64-16384-99",
        "Description": "Flavor for Ceph storage nodes to request when deploying.",
        "Label": "OvercloudCephStorageFlavor",
        "NoEcho": "false",
        "Type": "String"
      },
      "OvercloudComputeFlavor": {
        "CustomConstraint": "nova.flavor",
        "Default": "Flavor-16-x86_64-16384-99",
        "Description": "Use this flavor",
        "Label": "OvercloudComputeFlavor",
        "NoEcho": "false",
        "Type": "String"
      },
      "OvercloudControlFlavor": {
        "CustomConstraint": "nova.flavor",
        "Default": "Flavor-16-x86_64-16384-99",
        "Description": "Flavor for control nodes to request when deploying.",
        "Label": "OvercloudControlFlavor",
        "NoEcho": "false",
        "Type": "String"
      },
      "OvercloudSwiftStorageFlavor": {
        "CustomConstraint": "nova.flavor",
        "Default": "Flavor-16-x86_64-16384-99",
        "Description": "Flavor for Swift storage nodes to request when deploying.",
        "Label": "OvercloudSwiftStorageFlavor",
        "NoEcho": "false",
        "Type": "String"
      },
      "PublicVirtualFixedIPs": {
        "Default": [],
        "Description": "Control the IP allocation for the PublicVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
        "Label": "PublicVirtualFixedIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "PublicVirtualInterface": {
        "Default": "br-ex",
        "Description": "Specifies the interface where the public-facing virtual ip will be assigned. This should be int_public when a VLAN is being used.\n",
        "Label": "PublicVirtualInterface",
        "NoEcho": "false",
        "Type": "String",
        "Value": "br-ex"
      },
      "PurgeFirewallRules": {
        "Default": false,
        "Description": "Whether IPtables rules should be purged before setting up the new ones.",
        "Label": "PurgeFirewallRules",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "RabbitClientPort": {
        "Default": 5672,
        "Description": "Set rabbit subscriber port, change this if using SSL",
        "Label": "RabbitClientPort",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 5672
      },
      "RabbitClientUseSSL": {
        "Default": false,
        "Description": "Rabbit client subscriber parameter to specify an SSL connection to the RabbitMQ host.\n",
        "Label": "RabbitClientUseSSL",
        "NoEcho": "false",
        "Type": "String",
        "Value": "False"
      },
      "RabbitCookieSalt": {
        "Default": "unset",
        "Description": "Salt for the rabbit cookie, change this to force the randomly generated rabbit cookie to change.",
        "Label": "RabbitCookieSalt",
        "NoEcho": "false",
        "Type": "String"
      },
      "RabbitFDLimit": {
        "Default": 16384,
        "Description": "Configures RabbitMQ FD limit",
        "Label": "RabbitFDLimit",
        "NoEcho": "false",
        "Type": "String",
        "Value": "16384"
      },
      "RabbitIPv6": {
        "Default": false,
        "Description": "Enable IPv6 in RabbitMQ",
        "Label": "RabbitIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "RabbitPassword": {
        "Default": "guest",
        "Description": "The password for RabbitMQ",
        "Label": "RabbitPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "guest"
      },
      "RabbitUserName": {
        "Default": "guest",
        "Description": "The username for RabbitMQ",
        "Label": "RabbitUserName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "guest"
      },
      "RedisPassword": {
        "Default": "74c7bdc3b5d9d82e6f68ef47e0c17f98",
        "Description": "The password to access the Redis service",
        "Label": "RedisPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "74c7bdc3b5d9d82e6f68ef47e0c17f98"
      },
      "ServerMetadata": {
        "Default": {},
        "Description": "Extra properties or metadata passed to Nova for the created nodes in the overcloud. It's accessible via the Nova metadata API.\n",
        "Label": "ServerMetadata",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ServiceNetMap": {
        "Default": {},
        "Description": "Mapping of service_name -> network name. Typically set via parameter_defaults in the resource registry.",
        "Label": "ServiceNetMap",
        "NoEcho": "false",
        "Type": "Json",
        "Value": {
          "BlockStorageHostnameResolveNetwork": "internal_api",
          "CeilometerApiNetwork": "internal_api",
          "CephClusterNetwork": "storage_mgmt",
          "CephPublicNetwork": "storage",
          "CephStorageHostnameResolveNetwork": "storage",
          "CinderApiNetwork": "internal_api",
          "CinderIscsiNetwork": "storage",
          "ComputeHostnameResolveNetwork": "internal_api",
          "ControllerHostnameResolveNetwork": "internal_api",
          "GlanceApiNetwork": "storage",
          "GlanceRegistryNetwork": "internal_api",
          "HeatApiNetwork": "internal_api",
          "HorizonNetwork": "internal_api",
          "KeystoneAdminApiNetwork": "ctlplane",
          "KeystonePublicApiNetwork": "internal_api",
          "MemcachedNetwork": "internal_api",
          "MongoDbNetwork": "internal_api",
          "MysqlNetwork": "internal_api",
          "NeutronApiNetwork": "internal_api",
          "NeutronTenantNetwork": "tenant",
          "NovaApiNetwork": "internal_api",
          "NovaMetadataNetwork": "internal_api",
          "NovaVncProxyNetwork": "internal_api",
          "ObjectStorageHostnameResolveNetwork": "internal_api",
          "RabbitMqNetwork": "internal_api",
          "RedisNetwork": "internal_api",
          "SwiftMgmtNetwork": "storage_mgmt",
          "SwiftProxyNetwork": "storage"
        }
      },
      "SnmpdReadonlyUserName": {
        "Default": "ro_snmp_user",
        "Description": "The user name for SNMPd with readonly rights running on all Overcloud nodes",
        "Label": "SnmpdReadonlyUserName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "ro_snmp_user"
      },
      "SnmpdReadonlyUserPassword": {
        "Default": "c39af9bdac47c29b073a17fce8b261c4",
        "Description": "The user password for SNMPd with readonly rights running on all Overcloud nodes",
        "Label": "SnmpdReadonlyUserPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "c39af9bdac47c29b073a17fce8b261c4"
      },
      "StorageMgmtVirtualFixedIPs": {
        "Default": [],
        "Description": "Control the IP allocation for the StorageMgmgVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
        "Label": "StorageMgmtVirtualFixedIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "StorageVirtualFixedIPs": {
        "Default": [],
        "Description": "Control the IP allocation for the StorageVirtualInterface port. E.g. [{'ip_address':'1.2.3.4'}]\n",
        "Label": "StorageVirtualFixedIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "SwiftHashSuffix": {
        "Default": "347d4510085a111271b416cdef9e88d0",
        "Description": "A random string to be used as a salt when hashing to determine mappings in the ring.",
        "Label": "SwiftHashSuffix",
        "NoEcho": "true",
        "Type": "String",
        "Value": "347d4510085a111271b416cdef9e88d0"
      },
      "SwiftMinPartHours": {
        "Default": 1,
        "Description": "The minimum time (in hours) before a partition in a ring can be moved following a rebalance.",
        "Label": "SwiftMinPartHours",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 1
      },
      "SwiftMountCheck": {
        "Default": "false",
        "Description": "Value of mount_check in Swift account/container/object -server.conf",
        "Label": "SwiftMountCheck",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "SwiftPartPower": {
        "Default": 10,
        "Description": "Partition Power to use when building Swift rings",
        "Label": "SwiftPartPower",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 10
      },
      "SwiftPassword": {
        "Default": "0f4318fd3a6d135bd473c05f029e182d",
        "Description": "The password for the swift service account, used by the swift proxy services.",
        "Label": "SwiftPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "0f4318fd3a6d135bd473c05f029e182d"
      },
      "SwiftReplicas": {
        "Default": 3,
        "Description": "How many replicas to use in the swift rings.",
        "Label": "SwiftReplicas",
        "NoEcho": "false",
        "Type": "Number",
        "Value": 3
      },
      "SwiftStorageImage": {
        "Default": "overcloud-full",
        "Description": "",
        "Label": "SwiftStorageImage",
        "NoEcho": "false",
        "Type": "String"
      },
      "TimeZone": {
        "Default": "UTC",
        "Description": "The timezone to be set on controller nodes.",
        "Label": "TimeZone",
        "NoEcho": "false",
        "Type": "String",
        "Value": "UTC"
      },
      "UpdateIdentifier": {
        "Description": "Setting to a previously unused value during stack-update will trigger package update on all nodes\n",
        "Label": "UpdateIdentifier",
        "NoEcho": "false",
        "Type": "String"
      },
      "controllerExtraConfig": {
        "Default": {},
        "Description": "Controller specific configuration to inject into the cluster. Same\nstructure as ExtraConfig.\n",
        "Label": "controllerExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "controllerImage": {
        "CustomConstraint": "glance.image",
        "Default": "overcloud-full",
        "Description": "",
        "Label": "controllerImage",
        "NoEcho": "false",
        "Type": "String"
      },
      "blockstorage_servers": {
        "Default": [],
        "Description": "",
        "Label": "blockstorage_servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "cephstorage_servers": {
        "Default": [],
        "Description": "",
        "Label": "cephstorage_servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "compute_servers": {
        "Default": [],
        "Description": "",
        "Label": "compute_servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "controller_servers": {
        "Default": [],
        "Description": "",
        "Label": "controller_servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "objectstorage_servers": {
        "Default": [],
        "Description": "",
        "Label": "objectstorage_servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "PingTestIps": {
        "Default": "",
        "Description": "A string containing a space separated list of IP addresses used to ping test each available network interface.",
        "Label": "PingTestIps",
        "NoEcho": "false",
        "Type": "String",
        "Value": "    "
      },
      "ConfigDebug": {
        "Default": false,
        "Description": "Whether to run config management (e.g. Puppet) in debug mode.",
        "Label": "ConfigDebug",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NodeConfigIdentifiers": {
        "Description": "Value which changes if the node configuration may need to be re-applied",
        "Label": "NodeConfigIdentifiers",
        "NoEcho": "false",
        "Type": "Json",
        "Value": {
          "allnodes_extra": null,
          "deployment_identifier": "",
          "objectstorage_config": null
        }
      },
      "servers": {
        "Default": [],
        "Description": "",
        "Label": "servers",
        "NoEcho": "false",
        "Type": "Json"
      },
      "DeployArtifactURLs": {
        "Default": [],
        "Description": "A list of HTTP URLs containing deployment artifacts. Currently supports tarballs and RPM packages.",
        "Label": "DeployArtifactURLs",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "CephClientUserName": {
        "Default": "openstack",
        "Description": "",
        "Label": "CephClientUserName",
        "NoEcho": "false",
        "Type": "String"
      },
      "CephIPv6": {
        "Default": false,
        "Description": "",
        "Label": "CephIPv6",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "CinderRbdPoolName": {
        "Default": "volumes",
        "Description": "",
        "Label": "CinderRbdPoolName",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceRbdPoolName": {
        "Default": "images",
        "Description": "",
        "Label": "GlanceRbdPoolName",
        "NoEcho": "false",
        "Type": "String"
      },
      "NovaRbdPoolName": {
        "Default": "vms",
        "Description": "",
        "Label": "NovaRbdPoolName",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_admin_key": {
        "Default": "",
        "Description": "",
        "Label": "ceph_admin_key",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_client_key": {
        "Default": "",
        "Description": "Ceph key used to create the client user keyring.",
        "Label": "ceph_client_key",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_external_mon_ips": {
        "Default": "",
        "Description": "List of external Ceph Mon host IPs.",
        "Label": "ceph_external_mon_ips",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_fsid": {
        "Default": "",
        "Description": "",
        "Label": "ceph_fsid",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_mon_ips": {
        "Description": "",
        "Label": "ceph_mon_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ceph_mon_key": {
        "Default": "",
        "Description": "",
        "Label": "ceph_mon_key",
        "NoEcho": "false",
        "Type": "String"
      },
      "ceph_mon_names": {
        "Description": "",
        "Label": "ceph_mon_names",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ceph_storage_count": {
        "Default": 0,
        "Description": "Number of Ceph storage nodes. Used to enable/disable managed Ceph installation.",
        "Label": "ceph_storage_count",
        "NoEcho": "false",
        "Type": "Number"
      },
      "EnablePackageInstall": {
        "Default": false,
        "Description": "Set to true to enable package installation via Puppet",
        "Label": "EnablePackageInstall",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "EndpointMap": {
        "Default": {
          "CeilometerAdmin": {
            "host": "IP_ADDRESS",
            "port": "8777",
            "protocol": "http"
          },
          "CeilometerInternal": {
            "host": "IP_ADDRESS",
            "port": "8777",
            "protocol": "http"
          },
          "CeilometerPublic": {
            "host": "IP_ADDRESS",
            "port": "8777",
            "protocol": "http"
          },
          "CinderAdmin": {
            "host": "IP_ADDRESS",
            "port": "8776",
            "protocol": "http"
          },
          "CinderInternal": {
            "host": "IP_ADDRESS",
            "port": "8776",
            "protocol": "http"
          },
          "CinderPublic": {
            "host": "IP_ADDRESS",
            "port": "8776",
            "protocol": "http"
          },
          "GlanceAdmin": {
            "host": "IP_ADDRESS",
            "port": "9292",
            "protocol": "http"
          },
          "GlanceInternal": {
            "host": "IP_ADDRESS",
            "port": "9292",
            "protocol": "http"
          },
          "GlancePublic": {
            "host": "IP_ADDRESS",
            "port": "9292",
            "protocol": "http"
          },
          "GlanceRegistryAdmin": {
            "host": "IP_ADDRESS",
            "port": "9191",
            "protocol": "http"
          },
          "GlanceRegistryInternal": {
            "host": "IP_ADDRESS",
            "port": "9191",
            "protocol": "http"
          },
          "GlanceRegistryPublic": {
            "host": "IP_ADDRESS",
            "port": "9191",
            "protocol": "http"
          },
          "HeatAdmin": {
            "host": "IP_ADDRESS",
            "port": "8004",
            "protocol": "http"
          },
          "HeatInternal": {
            "host": "IP_ADDRESS",
            "port": "8004",
            "protocol": "http"
          },
          "HeatPublic": {
            "host": "IP_ADDRESS",
            "port": "8004",
            "protocol": "http"
          },
          "HorizonPublic": {
            "host": "IP_ADDRESS",
            "port": "80",
            "protocol": "http"
          },
          "KeystoneAdmin": {
            "host": "IP_ADDRESS",
            "port": "35357",
            "protocol": "http"
          },
          "KeystoneInternal": {
            "host": "IP_ADDRESS",
            "port": "5000",
            "protocol": "http"
          },
          "KeystonePublic": {
            "host": "IP_ADDRESS",
            "port": "5000",
            "protocol": "http"
          },
          "NeutronAdmin": {
            "host": "IP_ADDRESS",
            "port": "9696",
            "protocol": "http"
          },
          "NeutronInternal": {
            "host": "IP_ADDRESS",
            "port": "9696",
            "protocol": "http"
          },
          "NeutronPublic": {
            "host": "IP_ADDRESS",
            "port": "9696",
            "protocol": "http"
          },
          "NovaAdmin": {
            "host": "IP_ADDRESS",
            "port": "8774",
            "protocol": "http"
          },
          "NovaEC2Admin": {
            "host": "IP_ADDRESS",
            "port": "8773",
            "protocol": "http"
          },
          "NovaEC2Internal": {
            "host": "IP_ADDRESS",
            "port": "8773",
            "protocol": "http"
          },
          "NovaEC2Public": {
            "host": "IP_ADDRESS",
            "port": "8773",
            "protocol": "http"
          },
          "NovaInternal": {
            "host": "IP_ADDRESS",
            "port": "8774",
            "protocol": "http"
          },
          "NovaPublic": {
            "host": "IP_ADDRESS",
            "port": "8774",
            "protocol": "http"
          },
          "NovaVNCProxyAdmin": {
            "host": "IP_ADDRESS",
            "port": "6080",
            "protocol": "http"
          },
          "NovaVNCProxyInternal": {
            "host": "IP_ADDRESS",
            "port": "6080",
            "protocol": "http"
          },
          "NovaVNCProxyPublic": {
            "host": "IP_ADDRESS",
            "port": "6080",
            "protocol": "http"
          },
          "SwiftAdmin": {
            "host": "IP_ADDRESS",
            "port": "8080",
            "protocol": "http"
          },
          "SwiftInternal": {
            "host": "IP_ADDRESS",
            "port": "8080",
            "protocol": "http"
          },
          "SwiftPublic": {
            "host": "IP_ADDRESS",
            "port": "8080",
            "protocol": "http"
          }
        },
        "Description": "Mapping of service endpoint -> protocol. Typically set via parameter_defaults in the resource registry.",
        "Label": "EndpointMap",
        "NoEcho": "false",
        "Type": "Json"
      },
      "Flavor": {
        "CustomConstraint": "nova.flavor",
        "Description": "Flavor for control nodes to request when deploying.",
        "Label": "Flavor",
        "NoEcho": "false",
        "Type": "String",
        "Value": "Flavor-16-x86_64-16384-99"
      },
      "GlanceHost": {
        "Default": "",
        "Description": "",
        "Label": "GlanceHost",
        "NoEcho": "false",
        "Type": "String"
      },
      "Hostname": {
        "Default": "",
        "Description": "",
        "Label": "Hostname",
        "NoEcho": "false",
        "Type": "String",
        "Value": "dummy-controller-0"
      },
      "HostnameMap": {
        "Default": {},
        "Description": "Optional mapping to override hostnames",
        "Label": "HostnameMap",
        "NoEcho": "false",
        "Type": "Json"
      },
      "Image": {
        "CustomConstraint": "glance.image",
        "Default": "overcloud-control",
        "Description": "",
        "Label": "Image",
        "NoEcho": "false",
        "Type": "String",
        "Value": "overcloud-full"
      },
      "KeystoneAdminApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "KeystoneAdminApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "KeystonePublicApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "KeystonePublicApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "NetworkDeploymentActions": {
        "Default": [
          "CREATE"
        ],
        "Description": "Heat action when to apply network configuration changes\n",
        "Label": "NetworkDeploymentActions",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "NeutronHost": {
        "Default": "",
        "Description": "",
        "Label": "NeutronHost",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronPhysicalBridge": {
        "Default": "br-ex",
        "Description": "An OVS bridge to create for accessing external networks.",
        "Label": "NeutronPhysicalBridge",
        "NoEcho": "false",
        "Type": "String",
        "Value": "br-ex"
      },
      "NodeIndex": {
        "Default": 0,
        "Description": "Index of the IP to get from Pool",
        "Label": "NodeIndex",
        "NoEcho": "false",
        "Type": "Number"
      },
      "NovaApiHost": {
        "Default": "",
        "Description": "",
        "Label": "NovaApiHost",
        "NoEcho": "false",
        "Type": "String"
      },
      "NovaComputeIPs": {
        "Default": {},
        "Description": "",
        "Label": "NovaComputeIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "NovaPublicIP": {
        "Default": "",
        "Description": "",
        "Label": "NovaPublicIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "RabbitHost": {
        "Default": "",
        "Description": "",
        "Label": "RabbitHost",
        "NoEcho": "false",
        "Type": "String"
      },
      "SchedulerHints": {
        "Default": {},
        "Description": "Optional scheduler hints to pass to nova",
        "Label": "SchedulerHints",
        "NoEcho": "false",
        "Type": "Json"
      },
      "SoftwareConfigTransport": {
        "AllowedValues": [
          "POLL_SERVER_CFN",
          "POLL_SERVER_HEAT",
          "POLL_TEMP_URL",
          "ZAQAR_MESSAGE"
        ],
        "Default": "POLL_SERVER_CFN",
        "Description": "How the server should receive the metadata required for software configuration.\n",
        "Label": "SoftwareConfigTransport",
        "NoEcho": "false",
        "Type": "String"
      },
      "UpgradeLevelNovaCompute": {
        "Default": "",
        "Description": "Nova Compute upgrade level",
        "Label": "UpgradeLevelNovaCompute",
        "NoEcho": "false",
        "Type": "String"
      },
      "server": {
        "Description": "ID of the controller node to apply this config to",
        "Label": "server",
        "NoEcho": "false",
        "Type": "String",
        "Value": "Controller"
      },
      "ControlPlaneIP": {
        "Description": "IP address on the control plane",
        "Label": "ControlPlaneIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "ControlPlaneNetwork": {
        "Default": "ctlplane",
        "Description": "Name of the control plane network",
        "Label": "ControlPlaneNetwork",
        "NoEcho": "false",
        "Type": "String"
      },
      "ControlPlaneSubnetCidr": {
        "Default": "24",
        "Description": "The subnet CIDR of the control plane network.",
        "Label": "ControlPlaneSubnetCidr",
        "NoEcho": "false",
        "Type": "String"
      },
      "FixedIPs": {
        "Default": [],
        "Description": "",
        "Label": "FixedIPs",
        "NoEcho": "false",
        "Type": "Json",
        "Value": "[]"
      },
      "IPPool": {
        "Default": {},
        "Description": "A network mapped list of IPs",
        "Label": "IPPool",
        "NoEcho": "false",
        "Type": "Json"
      },
      "NetworkName": {
        "Default": "",
        "Description": "",
        "Label": "NetworkName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "storage"
      },
      "PortName": {
        "Default": "",
        "Description": "Name of the port",
        "Label": "PortName",
        "NoEcho": "false",
        "Type": "String",
        "Value": "storage_virtual_ip"
      },
      "ServiceName": {
        "Default": "",
        "Description": "Name of the service to lookup",
        "Label": "ServiceName",
        "NoEcho": "false",
        "Type": "String"
      },
      "ControlPlaneIp": {
        "Default": "",
        "Description": "",
        "Label": "ControlPlaneIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "ExternalIp": {
        "Default": "",
        "Description": "",
        "Label": "ExternalIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "ExternalIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "ExternalIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "InternalApiIp": {
        "Default": "",
        "Description": "",
        "Label": "InternalApiIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "InternalApiIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "InternalApiIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "ManagementIp": {
        "Default": "",
        "Description": "",
        "Label": "ManagementIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "ManagementIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "ManagementIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageIp": {
        "Default": "",
        "Description": "",
        "Label": "StorageIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "StorageIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageMgmtIp": {
        "Default": "",
        "Description": "",
        "Label": "StorageMgmtIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageMgmtIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "StorageMgmtIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "TenantIp": {
        "Default": "",
        "Description": "",
        "Label": "TenantIp",
        "NoEcho": "false",
        "Type": "String"
      },
      "TenantIpUri": {
        "Default": "",
        "Description": "IP address with brackets in case of IPv6",
        "Label": "TenantIpUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "ExternalIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the external network",
        "Label": "ExternalIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "InternalApiIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the internal API network",
        "Label": "InternalApiIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "ManagementIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the management network",
        "Label": "ManagementIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the storage network",
        "Label": "StorageIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "StorageMgmtIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the storage mgmt network",
        "Label": "StorageMgmtIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "TenantIpSubnet": {
        "Default": "",
        "Description": "IP address/subnet on the tenant network",
        "Label": "TenantIpSubnet",
        "NoEcho": "false",
        "Type": "String"
      },
      "node_admin_username": {
        "Default": "heat-admin",
        "Description": "",
        "Label": "node_admin_username",
        "NoEcho": "false",
        "Type": "String"
      },
      "CeilometerApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "CeilometerApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "CeilometerStoreEvents": {
        "Default": false,
        "Description": "Whether to store events in ceilometer.",
        "Label": "CeilometerStoreEvents",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "CeilometerWorkers": {
        "Default": 0,
        "Description": "Number of workers for Ceilometer service.",
        "Label": "CeilometerWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "CinderApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "CinderApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "CinderBackendConfig": {
        "Default": {},
        "Description": "Contains parameters to configure Cinder backends. Typically set via parameter_defaults in the resource registry.",
        "Label": "CinderBackendConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "CinderEnableDBPurge": {
        "Default": true,
        "Description": "Whether to create cron job for purging soft deleted rows in Cinder database.\n",
        "Label": "CinderEnableDBPurge",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "CinderWorkers": {
        "Default": 0,
        "Description": "Number of workers for Cinder service.",
        "Label": "CinderWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "ControllerExtraConfig": {
        "Default": {},
        "Description": "Controller specific hiera configuration data to inject into the cluster.\n",
        "Label": "ControllerExtraConfig",
        "NoEcho": "false",
        "Type": "Json"
      },
      "ControllerIPs": {
        "Default": {},
        "Description": "A network mapped list of IPs to assign to Controllers in the following form: {\n  \"internal_api\": [\"a.b.c.d\", \"e.f.g.h\"],\n  ...\n}\n",
        "Label": "ControllerIPs",
        "NoEcho": "false",
        "Type": "Json"
      },
      "EnableCephStorage": {
        "Default": false,
        "Description": "Whether to deploy Ceph Storage (OSD) on the Controller",
        "Label": "EnableCephStorage",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "EnableLoadBalancer": {
        "Default": true,
        "Description": "Whether to deploy a LoadBalancer on the Controller",
        "Label": "EnableLoadBalancer",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "EnableSwiftStorage": {
        "Default": true,
        "Description": "Whether to enable Swift Storage on the Controller",
        "Label": "EnableSwiftStorage",
        "NoEcho": "false",
        "Type": "Boolean",
        "Value": true
      },
      "GlanceApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "GlanceApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceFilePcmkDevice": {
        "Default": "",
        "Description": "An exported storage device that should be mounted by Pacemaker as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
        "Label": "GlanceFilePcmkDevice",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceFilePcmkFstype": {
        "Default": "nfs",
        "Description": "Filesystem type for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
        "Label": "GlanceFilePcmkFstype",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceFilePcmkManage": {
        "Default": false,
        "Description": "Whether to make Glance file backend a mount managed by Pacemaker. Effective when GlanceBackend is 'file'.\n",
        "Label": "GlanceFilePcmkManage",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "GlanceFilePcmkOptions": {
        "Default": "",
        "Description": "Mount options for Pacemaker mount used as Glance storage. Effective when GlanceFilePcmkManage is true.\n",
        "Label": "GlanceFilePcmkOptions",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceRegistryVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "GlanceRegistryVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "GlanceWorkers": {
        "Default": 0,
        "Description": "Number of workers for Glance service.",
        "Label": "GlanceWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "HAProxyStatsPassword": {
        "Default": "4b3889becb85db87cb21803f3f4723b6",
        "Description": "Password for HAProxy stats endpoint",
        "Label": "HAProxyStatsPassword",
        "NoEcho": "false",
        "Type": "String"
      },
      "HAProxyStatsUser": {
        "Default": "admin",
        "Description": "User for HAProxy stats endpoint",
        "Label": "HAProxyStatsUser",
        "NoEcho": "false",
        "Type": "String"
      },
      "HeatApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "HeatApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "HeatApiVirtualIPUri": {
        "Default": "",
        "Description": "",
        "Label": "HeatApiVirtualIPUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "HeatAuthEncryptionKey": {
        "Description": "Auth encryption key for heat-engine",
        "Label": "HeatAuthEncryptionKey",
        "NoEcho": "true",
        "Type": "String",
        "Value": "HeatAuthEncryptionKey"
      },
      "HeatEnableDBPurge": {
        "Default": true,
        "Description": "Whether to create cron job for purging soft deleted rows in the Heat database.\n",
        "Label": "HeatEnableDBPurge",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "HeatWorkers": {
        "Default": 0,
        "Description": "Number of workers for Heat service.",
        "Label": "HeatWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "HorizonSecret": {
        "Description": "Secret key for Django",
        "Label": "HorizonSecret",
        "NoEcho": "true",
        "Type": "String",
        "Value": "HorizonSecret"
      },
      "KeystoneEnableDBPurge": {
        "Default": true,
        "Description": "Whether to create cron job for purging soft deleted rows in Keystone database.\n",
        "Label": "KeystoneEnableDBPurge",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "KeystoneWorkers": {
        "Default": 0,
        "Description": "Number of workers for Keystone service.",
        "Label": "KeystoneWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "MysqlClusterUniquePart": {
        "Default": "unset",
        "Description": "A unique identifier of the MySQL cluster the controller is in.",
        "Label": "MysqlClusterUniquePart",
        "NoEcho": "false",
        "Type": "String"
      },
      "MysqlRootPassword": {
        "Default": "",
        "Description": "",
        "Label": "MysqlRootPassword",
        "NoEcho": "true",
        "Type": "String"
      },
      "MysqlVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "MysqlVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "MysqlVirtualIPUri": {
        "Default": "",
        "Description": "",
        "Label": "MysqlVirtualIPUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "NeutronApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "NeutronEnableDHCPAgent": {
        "Default": true,
        "Description": "Knob to enable/disable DHCP Agent",
        "Label": "NeutronEnableDHCPAgent",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NeutronEnableL3Agent": {
        "Default": true,
        "Description": "Knob to enable/disable L3 agent",
        "Label": "NeutronEnableL3Agent",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NeutronEnableMetadataAgent": {
        "Default": true,
        "Description": "Knob to enable/disable Metadata agent",
        "Label": "NeutronEnableMetadataAgent",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NeutronEnableOVSAgent": {
        "Default": true,
        "Description": "Knob to enable/disable OVS Agent",
        "Label": "NeutronEnableOVSAgent",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NeutronWorkers": {
        "Default": 0,
        "Description": "Number of workers for Neutron service.",
        "Label": "NeutronWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "NovaApiVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "NovaApiVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "NovaEnableDBPurge": {
        "Default": true,
        "Description": "Whether to create cron job for purging soft deleted rows in Nova database.\n",
        "Label": "NovaEnableDBPurge",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "NovaWorkers": {
        "Default": 0,
        "Description": "Number of workers for Nova service.",
        "Label": "NovaWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "PcsdPassword": {
        "Description": "The password for the 'pcsd' user.",
        "Label": "PcsdPassword",
        "NoEcho": "true",
        "Type": "String",
        "Value": "PcsdPassword"
      },
      "PublicVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "PublicVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "RabbitCookie": {
        "Default": "",
        "Description": "",
        "Label": "RabbitCookie",
        "NoEcho": "true",
        "Type": "String"
      },
      "RedisVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "RedisVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "RedisVirtualIPUri": {
        "Default": "",
        "Description": "An IP address which is wrapped in brackets in case of IPv6",
        "Label": "RedisVirtualIPUri",
        "NoEcho": "false",
        "Type": "String"
      },
      "SwiftProxyVirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "SwiftProxyVirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "SwiftRingBuild": {
        "Default": true,
        "Description": "Whether to manage Swift rings or not",
        "Label": "SwiftRingBuild",
        "NoEcho": "false",
        "Type": "Boolean"
      },
      "SwiftWorkers": {
        "Default": 0,
        "Description": "Number of workers for Swift service.",
        "Label": "SwiftWorkers",
        "NoEcho": "false",
        "Type": "Number"
      },
      "VirtualIP": {
        "Default": "",
        "Description": "",
        "Label": "VirtualIP",
        "NoEcho": "false",
        "Type": "String"
      },
      "DeployedSSLCertificatePath": {
        "Default": "",
        "Description": "The filepath of the certificate as it will be stored in the controller.\n",
        "Label": "DeployedSSLCertificatePath",
        "NoEcho": "false",
        "Type": "String"
      },
      "bootstrap_nodeid": {
        "Description": "",
        "Label": "bootstrap_nodeid",
        "NoEcho": "false",
        "Type": "String"
      },
      "bootstrap_nodeid_ip": {
        "Description": "",
        "Label": "bootstrap_nodeid_ip",
        "NoEcho": "false",
        "Type": "String"
      },
      "ControlPlaneIpList": {
        "Default": [],
        "Description": "",
        "Label": "ControlPlaneIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ExternalIpList": {
        "Default": [],
        "Description": "",
        "Label": "ExternalIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "InternalApiIpList": {
        "Default": [],
        "Description": "",
        "Label": "InternalApiIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ManagementIpList": {
        "Default": [],
        "Description": "",
        "Label": "ManagementIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "StorageIpList": {
        "Default": [],
        "Description": "",
        "Label": "StorageIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "StorageMgmtIpList": {
        "Default": [],
        "Description": "",
        "Label": "StorageMgmtIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "TenantIpList": {
        "Default": [],
        "Description": "",
        "Label": "TenantIpList",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "input_values": {
        "Default": {},
        "Description": "input values for the software deployments",
        "Label": "input_values",
        "NoEcho": "false",
        "Type": "Json",
        "Value": {
          "deploy_identifier": "",
          "update_identifier": ""
        }
      },
      "controller_swift_devices": {
        "Description": "",
        "Label": "controller_swift_devices",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "controller_swift_proxy_memcaches": {
        "Description": "",
        "Label": "controller_swift_proxy_memcaches",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "object_store_swift_devices": {
        "Description": "",
        "Label": "object_store_swift_devices",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "block_storage_hosts": {
        "Description": "",
        "Label": "block_storage_hosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ceilometer_api_node_ips": {
        "Description": "",
        "Label": "ceilometer_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "ceph_storage_hosts": {
        "Description": "",
        "Label": "ceph_storage_hosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "cinder_api_node_ips": {
        "Description": "",
        "Label": "cinder_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "compute_hosts": {
        "Description": "",
        "Label": "compute_hosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "controller_hosts": {
        "Description": "",
        "Label": "controller_hosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "controller_ips": {
        "Description": "",
        "Label": "controller_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "controller_names": {
        "Description": "",
        "Label": "controller_names",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "glance_api_node_ips": {
        "Description": "",
        "Label": "glance_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "glance_registry_node_ips": {
        "Description": "",
        "Label": "glance_registry_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "heat_api_node_ips": {
        "Description": "",
        "Label": "heat_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "horizon_node_ips": {
        "Description": "",
        "Label": "horizon_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "keystone_admin_api_node_ips": {
        "Description": "",
        "Label": "keystone_admin_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "keystone_public_api_node_ips": {
        "Description": "",
        "Label": "keystone_public_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "memcache_node_ips": {
        "Description": "",
        "Label": "memcache_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "mongo_node_ips": {
        "Description": "",
        "Label": "mongo_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "mysql_node_ips": {
        "Description": "",
        "Label": "mysql_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "neutron_api_node_ips": {
        "Description": "",
        "Label": "neutron_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "nova_api_node_ips": {
        "Description": "",
        "Label": "nova_api_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "nova_metadata_node_ips": {
        "Description": "",
        "Label": "nova_metadata_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "object_storage_hosts": {
        "Description": "",
        "Label": "object_storage_hosts",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "rabbit_node_ips": {
        "Description": "",
        "Label": "rabbit_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "redis_node_ips": {
        "Description": "",
        "Label": "redis_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      },
      "swift_proxy_node_ips": {
        "Description": "",
        "Label": "swift_proxy_node_ips",
        "NoEcho": "false",
        "Type": "CommaDelimitedList"
      }
    },
    "roles": [
      "Controller",
      "Compute",
      "BlockStorage",
      "ObjectStorage",
      "CephStorage"
    ]
}];
