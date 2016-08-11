%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name fusor_server

%global foreman_dir /usr/share/foreman
%global foreman_bundlerd_dir %{foreman_dir}/bundler.d
%global foreman_pluginconf_dir %{foreman_dir}/config/settings.plugins.d

%if !("%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16)
%global gem_dir /usr/lib/ruby/gems/1.8
%global gem_instdir %{gem_dir}/gems/%{gem_name}-%{version}
%global gem_libdir %{gem_instdir}/lib
%global gem_cache %{gem_dir}/cache/%{gem_name}-%{version}.gem
%global gem_spec %{gem_dir}/specifications/%{gem_name}-%{version}.gemspec
%global gem_docdir %{gem_dir}/doc/%{gem_name}-%{version}
%endif

%if "%{?scl}" == "ruby193"
    %global scl_ruby /usr/bin/ruby193-ruby
    %global scl_rake /usr/bin/ruby193-rake
    ### TODO temp disabled for SCL
    %global nodoc 1
%else
    %global scl_ruby /usr/bin/ruby
    %global scl_rake /usr/bin/rake
%endif

Summary: Fusor Server Plugin
Name: %{?scl_prefix}rubygem-%{gem_name}

Version: 1.0.1
Release: 1%{?dist}
Group: Development/Ruby
License: Distributable
URL: https://github.com/fusor/fusor
Source0: http://rubygems.org/downloads/%{gem_name}-%{version}.gem

%if "%{?scl}" == "ruby193"
Requires: %{?scl_prefix}ruby-wrapper
BuildRequires: %{?scl_prefix}ruby-wrapper
%endif
%if "%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16
BuildRequires:  %{?scl_prefix}rubygems-devel
%endif

%if 0%{?fedora} > 19
Requires: %{?scl_prefix}ruby(release) = 2.0.0
BuildRequires: %{?scl_prefix}ruby(release) = 2.0.0
%else
%if "%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16
Requires: %{?scl_prefix}ruby(abi) = 1.9.1
BuildRequires: %{?scl_prefix}ruby(abi) = 1.9.1
%else
Requires: ruby(abi) = 1.8
BuildRequires: ruby(abi) = 1.8
%endif
%endif

Requires: foreman >= 1.7.0
Requires: fusor-selinux >= 1.0.0
BuildRequires: foreman >= 1.7.0
BuildRequires: foreman-assets >= 1.7.0
# TODO
# Detect what version of foreman we are building with
# foreman 1.9 uses foreman-plugin
# foreman 1.7 does not have foreman-plugin
#
#BuildRequires: foreman-plugin >= 1.6.0
BuildRequires: %{?scl_prefix}rubygem-active_model_serializers

BuildArch: noarch
Provides: %{?scl_prefix}rubygem(fusor_server) = %{version}
Provides: %{?scl_prefix}rubygem(fusor) = %{version}

Requires: %{?scl_prefix}rubygem-egon
Requires: %{?scl_prefix}rubygem-foretello_api_v21
Requires: %{?scl_prefix}rubygem-foreman_discovery
Requires: %{?scl_prefix}rubygem-active_model_serializers
Requires: %{?scl_prefix}rubygem-net-ssh => 2.9.2
Requires: %{?scl_prefix}rubygem-sys-filesystem
Requires: %{?scl_prefix}rubygem-rubyipmi
Requires: %{?scl_prefix}rubygem-ruby-ip
Requires: %{?scl_prefix}rubygem-rubyzip
Requires: fusor_ovirt
Requires: fusor-utils

Requires: ansible >= 1.9.0

%description
Fusor Plugin

%package doc
BuildArch:  noarch
Requires:   %{?scl_prefix}%{pkg_name} = %{version}-%{release}
Summary:    Documentation for rubygem-%{gem_name}

%description doc
This package contains documentation for rubygem-%{gem_name}.

%prep
%setup -n %{pkg_name}-%{version} -q -c -T
mkdir -p .%{gem_dir}
%{?scl:scl enable %{scl} "}
gem install --local --install-dir .%{gem_dir} --force %{SOURCE0}
%{?scl:"}

%build

%install

mkdir -p %{buildroot}%{gem_dir}
cp -a .%{gem_dir}/* \
        %{buildroot}%{gem_dir}/

mkdir -p %{buildroot}%{foreman_bundlerd_dir}
cat <<GEMFILE > %{buildroot}%{foreman_bundlerd_dir}/%{gem_name}.rb
gem '%{gem_name}'
gem 'egon'
GEMFILE

mkdir -p %{buildroot}%{foreman_pluginconf_dir}
cp -a %{buildroot}/%{gem_instdir}/config/fusor.yaml %{buildroot}%{foreman_pluginconf_dir}/

%clean
%{__rm} -rf %{buildroot}

%files
%defattr(-, root, root)
%{gem_instdir}/
%exclude %{gem_cache}
%{gem_spec}
%{foreman_bundlerd_dir}/%{gem_name}.rb
%{foreman_pluginconf_dir}/fusor.yaml

%files doc
%{gem_dir}/doc/%{gem_name}-%{version}

%post
if [ "$1" = "2" ]; then
 foreman-rake db:migrate
fi

%changelog
* Thu Aug 11 2016 jesus m. rodriguez <jesusr@redhat.com> 1.0.1-1
- encase version in quotes (jesusr@redhat.com)
- Use Version tagger and version template (jesusr@redhat.com)
- rubocop (fabian@fabianism.us)
- add sat tools repo to osp (jmontleo@redhat.com)
- 1348685 - Validate parameters for registering OpenStack nodes. (#1112)
  (cfc@chasenc.com)
- Temporary patch for OS flip flopping (fabian@fabianism.us)
- Log errors from CFME launch (fabian@fabianism.us)
- update for rest-client gem version 1.7.1 (johnkim76@gmail.com)
- update the Operating system to 'RedHat 7.2' (johnkim76@gmail.com)
- update rhevsh repos for rhev4 beta (johnkim76@gmail.com)
- remove spaces between columns in rhev hosts csv file creation
  (johnkim76@gmail.com)
- update for new api (johnkim76@gmail.com)
- add engine_fqdn for RHEV setup (johnkim76@gmail.com)
- update for rebase to master (johnkim76@gmail.com)
- Update sat 6.2 tools to be rhel6 for rhevm RHEV 3.6 engine is RHEL6
  (jwmatthews@gmail.com)
- 1356682 - deployment.openshift_storage_size must be greater than zero.
  (#1072) (jinmaster923@gmail.com)
- Removed explicit domain id reference (#1108) (dymurray@redhat.com)
- add dependencies to fusor_server and fusor_ui gemspecs (#1037)
  (jmagen@redhat.com)
- Updated fusor.yaml to reference Satellite Tools 6.2 (dwhatley@redhat.com)
- Workaround for issues addressed by openshift PR2224 and PR2222.
  (jinmaster923@gmail.com)
- Removed RHV host validation for not yet being managed. Was breaking
  deployments of self-hosted/OSE (jwmatthews@gmail.com)
- 1356721 - added validation that no other fusor deployment is running. Added
  validation that deployment's hosts are not already managed.
  (chris@chasenc.com)
- Updates for OSE v2 answer file changes (jwmatthews@gmail.com)
- rpmdiff: expected ?dist got dist (#1080) (jmrodri@gmail.com)
- 1356080 - Deployment reset between self-hosted & standard RHEV (#1071)
  (erik@nsk.io)
- BZ1351786 Update CFME Compute Profile to 8GB RAM (jmontleo@redhat.com)
- 1358406 - Instead of using local_action that bumps into
  https://github.com/ansible/ansible/issues/10906, use fetch cmd.
  (jinmaster923@gmail.com)
- Only validate storage shares for CFME if installing on RHEV
  (dymurray@redhat.com)
- 1353236 - Fix "a"/"an" typos (dwhatley@redhat.com)
- 1353236 - Added more RHEV > RHV changes in logging/user-facing error messages
  (dwhatley@redhat.com)
- 1349559 - Added RegEx to PasswordFilter.rb (dwhatley@redhat.com)
- 1356290 - get pids from portal when adding subs (jesusr@redhat.com)
- catch conversion errors on host (fabian@fabianism.us)
- 1349559 - Unique name/label fix in fusor_deployments.yml.
  (dwhatley@redhat.com)
- 1349559 - Changed 'and', 'or' to '&&', '||'. Fixed rubocop violations.
  (dwhatley@redhat.com)
- 1349559 - Remove passwords from log files. (dwhatley@redhat.com)
- Updated sample app to dynamically change image name (dymurray@redhat.com)
- Updated post-installation steps with docker containers from Satellite
  (dymurray@redhat.com)
- RedHat 6.7 -> RedHat 6.8 (fabianvf@users.noreply.github.com)
- 1331579 - remove second call_complete (jesusr@redhat.com)
- Added ability to enable/disable silenced_logging (jinmaster923@gmail.com)
- 1354551 - Subscription credentials logout now clears the session portal,
  clears the deployment fields, and deletes fusor subscription records
  associated with the deployment. (chris@chasenc.com)
- 1331556 - Undercloud sensitive data is now filtered from logs.
  (dwhatley@redhat.com)
- Added ability to silence logger based on configuration in fusor.yaml
  (jinmaster923@gmail.com)
- use the right quantity when adding sub count. (jesusr@redhat.com)
- Throw bad_request when credentials aren't present. (jesusr@redhat.com)
- 1328304 - Added check for leading or trailing whitespace on hostname
  (dymurray@redhat.com)
- 1354524 - Create but don't validate openstack_deployment on deployment
  creation to allow switching osp on after initial create. (chris@chasenc.com)
- Add unit tests for validate (jesusr@redhat.com)
- link osp to osp-d (jmontleo@redhat.com)
- Add validation for OpenstackDeployment.overcloud_float_net to check for hosts
  already using that subnet.  This would cause deployment failures when
  creating CFME on an address that was already taken. (chris@chasenc.com)
- add pagination to list of deployments (jmagen@redhat.com)
- 1294529 - fix typos (jesusr@redhat.com)
- Fixed up broken test. (jinmaster923@gmail.com)
- Added puppet check for non-self-hosted RHEV deployments.
  (jinmaster923@gmail.com)
- added subscription_validator (jesusr@redhat.com)
- validate all 3 options for product availablity. (jesusr@redhat.com)
- add osp-d to cfme and refactor add_provider (jmontleo@redhat.com)
- Added external Ceph storage options. Disabled OpenShift on OSP on start of
  wizard. Added OpenStack flavor request retry if empty. Added
  OpenstackDeploymentsController unit tests. (chris@chasenc.com)
- add ruby-ip to the dependencies for fusor_server validations
  (jmontleo@redhat.com)
- revert save! and log if there's an error (jesusr@redhat.com)
- fix rhevm version in hostgroup section of fusor.yaml (dwhatley@redhat.com)
- add puppet module attributes in fusor.yaml (johnkim76@gmail.com)
- Upgraded fusor.yaml to RHEL 6.8 kickstart (dwhatley@redhat.com)
- Use CloudForms GA & fix up some comments (jesusr@redhat.com)
- 1343729 - use Satellite Tools beta channel (jesusr@redhat.com)
- Sync Docker containers to Satellite and integrate in OSE installation
  (dymurray@redhat.com)
- 1255119- CFME will now have access to the RHEV history database
  (fabian@fabianism.us)
- Disable safemode_render in dev (jmontleo@redhat.com)
- disable lazysync again (jmontleo@redhat.com)
- update to be able to review host.save validation errors (johnkim76@gmail.com)
- Add check to make sure that puppet classes exist (fabian@fabianism.us)
- remove need for pty when checking osp8 director (jmontleo@redhat.com)
- Refactor tests given new task struct (erik@nsk.io)
- ConfigureHostGroups task refactoring (erik@nsk.io)
- Added integration between OSE and CFME if both are in the same deployment.
  (jinmaster923@gmail.com)
- enable on_demand download policy (jmontleo@redhat.com)
- Add deployment specific mac address pools (fabian@fabianism.us)
- Updated foreman/fusor log files for Sat 6.2 and dev env. (chris@chasenc.com)
- Add Ansible log to ui. (chris@chasenc.com)
- Reuse more code. (jinmaster923@gmail.com)
- Added devel logging. (jinmaster923@gmail.com)
- Fixed broken subscriptions updates (erik@nsk.io)
- stop blocking passwords failed error and fingerprint as passwds
  (jmontleo@redhat.com)
- Fix restricted puppet masters in dev (jmontleo@redhat.com)
- Added sample app conditional for helloworld (dymurray@redhat.com)
- Updated promises and server methods (dymurray@redhat.com)
- Add timeouts to WaitForDatacenter and WaitForPuppet (fabian@fabianism.us)
- Updated deployment.name to deployment.label (jinmaster923@gmail.com)
- Add checkbox for deploying helloworld to OSE (erik@nsk.io)
- Moved NFS validation to RHEV screen (dymurray@redhat.com)
- 1341164 - app/lib/actions/fusor/configure_host_groups.rb, the
  access_insights_client puppet class can't be found with the find() method
  (jwmatthews@gmail.com)
- Refactored Installer (jmontleo@redhat.com)
- Write ansible.log to Rails.root/log/deployment_name-deployment_id/
  (jinmaster923@gmail.com)
- Remove openshift_storage_name (erik@nsk.io)
- Update to CF 4.1 Beta and fix bug in image list sort (jwmatthews@gmail.com)
- Add tests for multiple hypervisors (fabian@fabianism.us)
- Update rhev deploy logic for multiple hypervisors with self-hosted
  (fabian@fabianism.us)
- look for activation key in a more robust way (fabian@fabianism.us)
- update OSE deployment to use the deployment.label vs deployment.name
  (johnkim76@gmail.com)
- Update deployment endpoint tests (erik@nsk.io)
- Push foreman_task_uuid setting to serverside /deploy (erik@nsk.io)
- Cleaned up errors from register node requests. (chris@chasenc.com)
- 1328537 - fix typo (jesusr@redhat.com)
- Only update on review page if not deployed. (chris@chasenc.com)
- Remove tests that no longer apply (erik@nsk.io)
- remove debug logging (jesusr@redhat.com)
- Changed from using .clone to .dup on ActiveRecord objects, fixes issue with
  renaming default kickstart ptable Without this, OSE deployments are broken
  after first deployment. (jwmatthews@gmail.com)
- remove manifest refresh & reimport (jesusr@redhat.com)
- Added GlusterFS support for OSE internal registry (dymurray@redhat.com)
- Upgraded OSE to 3.2 (dymurray@redhat.com)
- 1299888 - Validated undercloud does not already have a deployed overcloud.
  Allowed users to delete deployed stacks from the undercloud.
  (chris@chasenc.com)
- run foreman-rake db:migrate on upgrade (jmontleo@redhat.com)
- use cloudforms content for cloudforms (jmontleo@redhat.com)
- limit active_model_serializers to be 0.9.x (jmagen@redhat.com)
- Sync OSP 8 Content instead of OSP 7 content (jmontleo@redhat.com)
- Bump gem and rpm versions to 1.0.0 (jmontleo@redhat.com)
- add UI and Backend to set and use cfme db password (jmontleo@redhat.com)
- log and save to file the deployment object (johnkim76@gmail.com)
- Fix error where deployment validator was making invalid ip query for host
  (fabian@fabianism.us)
- create a hostgroup from fusor.yaml and use that to set cfme OS
  (jmontleo@redhat.com)
- Add Rhev-self-hosted (fabian@fabianism.us)
- Default OpenstackDeployment role counts in the database and UI while
  assigning nodes. (chris@chasenc.com)
- update log outputs for vm launcher (johnkim76@gmail.com)
- Fix empty openstack deployment object created on PUT of non-osp deployments.
  (chris@chasenc.com)
- fix overcloud configuration for OSP8 object breakout (jmontleo@redhat.com)
- update VM launcher for sat 6.2 upgrade (johnkim76@gmail.com)
- Broke out Deployment OpenStack Deployment into it's own model.
  (chris@chasenc.com)
- update OS version for CFME on OSP (johnkim76@gmail.com)
- Updated ConfigTemplate to ProvisioningTemplate to work in Sat 6.2
  (dgao@node09.satellite.lab.eng.rdu2.redhat.com)
- fix exception handlin in cfme add credentials (jmontleo@redhat.com)
- update CFME for additional sat 6.2 issues and RHEL 7.2 (jmontleo@redhat.com)
- Fixed problem where OSE deployment is not succesfully created on Sat 6.2
  (dymurray@redhat.com)
- Adjust globalstatus to not fail on anything less than error
  (jmontleo@redhat.com)
- Use 7.2 (jesusr@redhat.com)
- fix rhev cr creation on sat 6.2 (jmontleo@redhat.com)
- more cleanup (jmontleo@redhat.com)
- OSP 8 fixes and cleanup: Cleaned up osp8 parameters logic in
  DeploymentsController. Fixed unused action in node-profile. Moved sync to
  after validation. (chris@chasenc.com)
- osp8 backend fixes (jmontleo@redhat.com)
- Update fusor UI to use OpenStack 8 updated egon api. (chris@chasenc.com)
- Look for Katello in the global namespace (me@daniellobato.me)
- Fix Hostgroup Test (jmontleo@redhat.com)
- Fix GroupParameter mass-assign error + revert 55fee5 L129 change
  (jmontleo@redhat.com)
- fix tests (jmontleo@redhat.com)
- Additional updates for Satellite 6.2 (jmontleo@redhat.com)
- OSE Smart Defaults (erik@nsk.io)
- update to fix rubocop failures (johnkim76@gmail.com)
- Introduce OSE specific WaitForProvisioned task (erik@nsk.io)
- update waiting for ose vms to finish provisioning after its launch
  (johnkim76@gmail.com)
- Delete stale wildcard entries upon deployment validation Ignore rubocop class
  length errors (dymurray@redhat.com)
- Added sudo access for openshift.username. Collapsed chown stmts to make it
  cleaner. (jinmaster923@gmail.com)
- Running OSE installation using openshift.username instead of root.
  (jinmaster923@gmail.com)
- update to return true vs just return (johnkim76@gmail.com)
- Added persistent storage to be used for internal Docker registry
  (dymurray@redhat.com)
- Added validation check for OSE NFS share and wildcard subdomain
  (dymurray@redhat.com)
- Add rhevm_guest_agent snippet to custom OpenShift Kickstart
  (johnkim76@gmail.com)
- Fix various permission and selinux issues w/ iso installation.
  (jinmaster923@gmail.com)
- Uncommented docker storage setup template (dymurray@redhat.com)
- OpenShift config screen improvements (erik@nsk.io)
- update with generate_root_password() (johnkim76@gmail.com)
- Changed default disk size to 30 Gb for Docker storage (dymurray@redhat.com)
- Configured docker-storage-setup to use the second partition
  (dymurray@redhat.com)
- Added ansible as a dependency requirement for fusor-server.
  (jinmaster923@gmail.com)
- Added randomly generated password for root access to OSE VMs
  (dymurray@redhat.com)
- Update OpenShift summary page with deployment details (erik@nsk.io)
- update to only mount the 1st partition for openshift vms
  (johnkim76@gmail.com)
- Added OSE credentials to be passed for OSE user (dymurray@redhat.com)
- Removed adding external gw step in setup.yml Updated docker service start
  step in setup.yml Updated foreman tasks to use ose_master_hosts instead of
  ose_deployment_master_hosts (jinmaster923@gmail.com)
- Removed fusor module from ose_installer namespace as this causes weird class
  loading issues within Foreman (jinmaster923@gmail.com)
- Updated how ose_installer is being loaded in foreman tasks.
  (jinmaster923@gmail.com)
- Provided more logging details. Updated Launcher class to take in existing
  logger in initializer. Generated files now go into deployment specific paths.
  Added additional retry to starting docker service. (jinmaster923@gmail.com)
- Fixed TypeError from not setting ANSIBLE_CONFIG environment variable.
  (jinmaster923@gmail.com)
- Initial commit for ruby module that kicks off Openshift installation. Default
  flag to empty unless verbose is specified. Removed epel repository since it's
  not being used. Added support for ssh-key. Updated playbooks to deploy
  against OSE VMs. Update launch.rb to be more modular. Added pod_examples for
  post_installation. Updated dns_ip entry in main.yml. Updated how we
  execute/handle docker-storage-setup configuration. Forgot to uncomment setup
  and install method. Added functionality for deployment task to kick off ose-
  installer. Rubocop cleanup on launch.rb. Added copyright information to new
  source files. Various tweak to make foreman tasks integrate right with ose-
  installer. Added method to setup environment before running ansible Changed
  ansible artifacts location from /modules/ose-installer/output to
  #{Rails.root}/tmp Added output_dir to template so ansible knows where to grab
  those files. Updated post_installation to correctly setup subdomain_name for
  hello openshift pod. Added logging as an environment variable prior to
  ansible run. Rubocop fixup Updated License date to 2016
  (jinmaster923@gmail.com)
- Sync openstack data before showing for review and validating.
  (chris@chasenc.com)
- Added deployment openstack field validations. (chris@chasenc.com)
- Added fields in deployment to persist osp data. (chris@chasenc.com)
- Expose openshift_hosts to the front end (erik@nsk.io)
- Moved OSE validation to separate method to match changes in master
  (dymurray@redhat.com)
- Added server side validations for OSE deployment (dymurray@redhat.com)
- Updated fusor.yaml to lock down specific version of CFME image we will use in
  TP3. (jwmatthews@gmail.com)
- Restore ability to use a specific CFME image file name from fusor.yaml.
  (jwmatthews@gmail.com)
- root wrap index arrays in fusor controllers (jmontleo@redhat.com)
- root wrap index arrays in fusor controllers (jmontleo@redhat.com)
- Restore ability to use a specific CFME image file name from fusor.yaml.
  (jwmatthews@gmail.com)
- Check for duplicate subdomain entries (dymurray@redhat.com)
- 1297551 fix data center / cluster name validations. (chris@chasenc.com)
- Added check for duplicate subdomain entries (dymurray@redhat.com)
- Added wildcard subdomain region for OSE master (dymurray@redhat.com)
- 1293985 - Disconnected content mirror validation (erik@nsk.io)
- Fixed rubocop warning on long line (jwmatthews@gmail.com)
- Small tweaks from testing PR (jwmatthews@gmail.com)
- Removed unused OSE Files repo (jwmatthews@gmail.com)
- Creates and copies ssh keys for the ose nodes (johnkim76@gmail.com)
- Fixed check that NFS share is empty and display warning if it does not
  (dymurray@redhat.com)
- rubocop: whitespace, indentation. (jesusr@redhat.com)
- add 'deployment_host_type' in fusor_deployment_hosts update ose_launch.rb to
  save master and worker host information (johnkim76@gmail.com)
- move rhev & cfme validation to sep methods (jesusr@redhat.com)
- rubocop: remove comma from last item in array (jesusr@redhat.com)
- fix deployment unit test (jesusr@redhat.com)
- switched to an if/elsif/end format. (jesusr@redhat.com)
- gluster changes (jesusr@redhat.com)
- Use RHEV 3.6 GA channels (jesusr@redhat.com)
- set security protocol for cloud provider (jmontleo@redhat.com)
- add openshift repos to fusor.yaml (johnkim76@gmail.com)
- Added a missing 'require' for open3 (jwmatthews@gmail.com)
- Use RHEV 3.6 GA channels (jesusr@redhat.com)
- add vm_launcher and launch openshift vms (johnkim76@gmail.com)
- Removed openshift_number_nodes from deployment serializer
  (dymurray@redhat.com)
- Add default settings for CFME and OSE VMs editable by Satellite6
  (dymurray@redhat.com)
- Added ability to autodetect and register openstack nodes. (chris@chasenc.com)
- openshift web UI implementation (jmagen@redhat.com)
- add default settings for CFME and OSE VM's to be editable in Satellite6
  settings (jmagen@redhat.com)
- Refactoring OSP node registration page. (chris@chasenc.com)
- add backend mac discovery (jmontleo@redhat.com)
- Updates for Satellite 6.2 (jmontleo@redhat.com)
- Content Sync Failure Recovery (io@eriknelson.me)
- update to include OpenShift VM creation during CFME on RHEV provider
  deployment (johnkim76@gmail.com)
- Small fix for OSP controller cleanup, return path and not a closed file
  (jwmatthews@gmail.com)
- Changed where we store ssh key from undercloud (jwmatthews@gmail.com)
- Renamed openstack to open_stack to match Rails expectations.
  (jwmatthews@gmail.com)
- Fixed deployment label not being updated on PUT. (chris@chasenc.com)
- correction to cfme host create fail detection (jmontleo@redhat.com)
- detect cfme host creation failure (jmontleo@redhat.com)
- upgrade to RHEV 3.6 (jesusr@redhat.com)
- Use pre-validate hook to generate deployment labels instead of
  ::Katello::Ext::LabelFromName in order to substitute _ for -
  (chris@chasenc.com)
- Refactoring validations to support custom validators to be passed in to
  text-f. This supports custom valiadations like label validation without
  duplicating the logic in text-f or controllers. (chris@chasenc.com)
- Modified usages of deployment.name to use deployment.label.
  (chris@chasenc.com)
- Adding a label field to deployments (daviddavis@redhat.com)
- Always retry if we couldn't make the connection. (jesusr@redhat.com)
- 1306421 - Remove unused branding entries (jesusr@redhat.com)
- remove mechanize dependencies from fusor server gem and rpm
  (jmontleo@redhat.com)
- restart rabbitmq, ironic, and nova (jmontleo@redhat.com)
- workaround BZ1302858 - No valid Hosts (jmontleo@redhat.com)
- remove erroneous puts (jesusr@redhat.com)
- Refactored deployments controller log tests to not directly test private
  methods. (chris@chasenc.com)
- Added tests for DeploymentsController logging functions. (chris@chasenc.com)
- Removed debug puts. (chris@chasenc.com)
- Added a scoped route for silencing polling commands and included polling the
  log. (chris@chasenc.com)
- Added exception catching to terminating log tail process.
  (jinmaster923@gmail.com)
- 1299888 - Show ajax errors on failing to deploy. (chris@chasenc.com)
- Updated log stmt's severity from debug to info. Added extra loggings to make
  progress more apparent for users. (jinmaster923@gmail.com)
- Adding missing gem dependencies to gemspec (daviddavis@redhat.com)
- handle Connection refused, more retries (jmrodri@gmail.com)
- Moved NFS validation check outside of safe-mount.sh (dymurray@redhat.com)
- 1285393 - Added backend validation against invalid mac naming scheme.
  (jinmaster923@gmail.com)
- update the datacenter after creating the CR (jmontleo@redhat.com)
- Logging UI - display a single string instead of lots of observable entries to
  improve  performance. Bumped up the max log size to 40,000 now that the UI is
  faster. (chris@chasenc.com)
- Added new log files to the review/log page of a deployment.
  (chris@chasenc.com)
- add gemspec descriptions for /ui and /server (jmagen@redhat.com)
- fix progress bar bug introduced by PR 566 (jmagen@redhat.com)
- Added search and log level colors/filtering to the Fusor logging UI.
  (chris@chasenc.com)
- add Review Subscriptions for Connected UI scenario (jmagen@redhat.com)
- Fixed issue where log streaming processes were not terminated after
  deployment completes. (jinmaster923@gmail.com)
- Added functionality to collect information from other satellite log files.
  Added default list of files to grab during deployment. Took log streaming
  initiation out of fusor_base_action and directly into deploy.rb Added
  protection that duplicate tail process would not get spawned. Minor cleanup
  to init_log.rb and multlog.rb to make things simpler.
  (jinmaster923@gmail.com)
- refactor - add belongsTo relationship for foreman_task (jmagen@redhat.com)
- Fix fixtures to work with Katello 2.2 (daviddavis@redhat.com)
- Changed deployment log path from #{Rails.root}/log to
  #{Rails.root}/log/deployments (jinmaster923@gmail.com)
- 1287268 - add fusor to the /about page (jesusr@redhat.com)
- remove XXX from debug logging (jesusr@redhat.com)
- add test for error conditions for subs controller (jesusr@redhat.com)
- add hostnames to deployment serializer so we can show them on the summary
  page (jmagen@redhat.com)
- Removed check for production environment. (jinmaster923@gmail.com)
- Added configurable log level for deployment logging. (jinmaster923@gmail.com)
- fix typo in osp add hostname (jmontleo@redhat.com)
- bz1217541 - Added deployment name to top level Deploy task's name.
  (jinmaster923@gmail.com)
- check many more times for host to come up (jmontleo@redhat.com)
- update to use rest api (johnkim76@gmail.com)
- update fusor yaml for Red Hat CloudForms Management Engine 5.5 (Files)
  (johnkim76@gmail.com)
- update fusor.yaml for CFME 4.0 (johnkim76@gmail.com)
- Forgot to call super in plan(). (jinmaster923@gmail.com)
- Updated classes to inherit from FusorBaseAction. (jinmaster923@gmail.com)
- Change the deployment log to display the fusor log instead of the foreman
  production log. (chris@chasenc.com)
- Fixed issue w/ deployment.name including characters like "/" and "*" by
  replacing invalid chars with "_" (jinmaster923@gmail.com)
- Deleted whitespace rubocop caught. (jinmaster923@gmail.com)
- Switched to using Rails.root instead of hard-coded log file path. Added
  support for when Rails.root is nil Stealth fix to deployments_controller's
  error (jinmaster923@gmail.com)
- Disable rubocop check for class length for configure_host_groups.rb
  (jinmaster923@gmail.com)
- Make code more ruby-like. Oops forgot to enable logging for api controller
  deploy method. (jinmaster923@gmail.com)
- add command utils test (jesusr@redhat.com)
- add delete test for subscriptions api (jesusr@redhat.com)
- add test for subscription save (jesusr@redhat.com)
- fix typo: Underlcoud -> Undercloud (jesusr@redhat.com)
- Add unit test for subscriptions.upload (jesusr@redhat.com)
- Disable logging in testing env since nothing else seems to work.
  (jinmaster923@gmail.com)
- Writing logs in testing env to /var/log/ (jinmaster923@gmail.com)
- Forgot rubocop changes in init_log.rb (jinmaster923@gmail.com)
- Backed out changes made from the previous commit. Added logic to init_log.rb
  to detect if code is running in production or testing so it can create the
  right log files. (jinmaster923@gmail.com)
- Rubocop cleanup. (jinmaster923@gmail.com)
- Require user to fill out overcloud admin password instead of pre-generated
  one. (chris@chasenc.com)
- add hostnames for cfme overcloud and undercloud (jmontleo@redhat.com)
- change underscore in deployment name to dash in hostname
  (jmontleo@redhat.com)
- Added super() to action's plan method so Fusor logger get initialized.
  Removed deployment_logger.rb Fixed namespace error. (jinmaster923@gmail.com)
- Changed Rails.logger to ::Fusor.log (jinmaster923@gmail.com)
- Created init_log.rb so logging can be loaded when Fusor engine starts. Added
  base fusor action classes that would initialize deployment specific logging.
  Modified existing action classes so it inherits from base Fusor classes.
  (jinmaster923@gmail.com)
- Update for rubocop offenses (johnkim76@gmail.com)
- Update to get host list and upload for verification before adding credentials
  (johnkim76@gmail.com)
- Fixing DateTime calls in log_reader_test. (chris@chasenc.com)
- fix deprecation error that caused failure (jesusr@redhat.com)
- Upgrading rubocop to 0.35.1 (daviddavis@redhat.com)
- Fusor log reader cleanup and added tests. (chris@chasenc.com)
- store more than one subscription (jesusr@redhat.com)
- mv nfs scripts to new pkg and add dependency to rpm spec
  (jmontleo@redhat.com)
- fix spacing (jmontleo@redhat.com)
- Fixing broken NFS mount test (daviddavis@redhat.com)
- add review-subscriptions route and template for imported subscriptions from
  manifest (jmagen@redhat.com)
- Stop using showmount to check for nfs paths (daviddavis@redhat.com)
- Revert "fail here if we can't save" (jmontleo@redhat.com)
- add cfme on openstack support (jmontleo@redhat.com)
- Don't validate deployment in OvercloudCredentials (daviddavis@redhat.com)
- import manifest information into subscriptions (jesusr@redhat.com)
- Display log on deployment progress tab. (chris@chasenc.com)
- Update - temp fix for adding credential timing issue (johnkim76@gmail.com)
- add to fusor/server deployment model and serializer
  :is_autogenerate_overcloud_password, (jmagen@redhat.com)
- update for the CI errors (johnkim76@gmail.com)
- Update for CFME add provider and add host credentials via API
  (johnkim76@gmail.com)
- Set sane defaults for deployment plan. Set OSP External Network Interface to
  value from deployment plan. (chris@chasenc.com)
- Update fusor.yaml for CFME 5.5 Beta (johnkim76@gmail.com)
- Added deployment NFS validation (daviddavis@redhat.com)
- add openstack overcloud floating ip network gateway (jmontleo@redhat.com)
- Disable updates of deployment.openstack_undercloud_password
  (chris@chasenc.com)
- fail here if we can't save (jmontleo@redhat.com)
- Removing unnecessary rubocop disables (daviddavis@redhat.com)
- add migration for openstack_overcloud_interface (jmagen@redhat.com)
- add :openstack_overcloud_interface attribute to deployment model
  (jmagen@redhat.com)
- Fixes #1258917 - Check NFS share for leading slash (daviddavis@redhat.com)
- Check for managed host before calling error? (daviddavis@redhat.com)
- run osp and rhev deployments concurrently (jmontleo@redhat.com)
- Revert "work in progress" (sherr@redhat.com)
- work in progress (sherr@redhat.com)
- Work around OSP BZ 1281908 about not correctly setting overcloud password
  (sherr@redhat.com)
- Added another check needed for running against latest Katello
  (jwmatthews@gmail.com)
- add openstack overcloud networks to the database (jmontleo@redhat.com)
- Added a 'Fusor' tab to simplecov output (jwmatthews@gmail.com)
- rubocop updates (jwmatthews@gmail.com)
- Updated simplecov/coveralls setup to only track fusor/egon/foretello_api_v21
  (jwmatthews@gmail.com)
- add openstack_overcloud_address to deployment serializer (jmagen@redhat.com)
- Added link to the host's puppet report in error (daviddavis@redhat.com)
- return manifest file name to API caller (jesusr@redhat.com)
- update API to match what UI is sending (jesusr@redhat.com)
- Raise failed host provisioning errors (daviddavis@redhat.com)
- Add coveralls to gemspec (jwmatthews@gmail.com)
- stop using mechanize (jmontleo@redhat.com)
- Link back to this deployment's introspection tasks only, fail task on first
  error (sherr@redhat.com)
- cleanup (sherr@redhat.com)
- Fix rubocop errors (sherr@redhat.com)
- added introspection_tasks to deployment_serializer (jmagen@redhat.com)
- OSP register nodes UI based on new dynflow backend (jmagen@redhat.com)
- server changes to link deployments with introspection tasks
  (sherr@redhat.com)
- add error handling to node introspection, take advantage of new egon feature
  (sherr@redhat.com)
- Make node creation kick off an async dynflow task to introspect and create
  flavor (sherr@redhat.com)
- add option for user to upload manifest in Subscriptions tab
  (jmagen@redhat.com)
- First attempt adding coveralls (jwmatthews@gmail.com)
- remove extra space to appease rubocop (jesusr@redhat.com)
- remove everything but the ip address (jmontleo@redhat.com)
- remove logging, no longer needed. (jesusr@redhat.com)
- give the migration seconds in its name (jesusr@redhat.com)
- Add upload manifest controller (jesusr@redhat.com)
- add cdnurl & manifest to deployment. (jesusr@redhat.com)
- Silence STDOUT to remove error noise from log (daviddavis@redhat.com)
- Get Overcloud credentials and store them in db (jmontleo@redhat.com)
- correct error handling for undercloud detection (jmontleo@redhat.com)
- rewrite ping check so we don't trigger selinux denial (jmontleo@redhat.com)
- Add finger print error to list of ones we can handle in undercloud detection
  page (sherr@redhat.com)
- split tasks not reliant on each other (jmontleo@redhat.com)
- ssh into the undercloud and initialize the overcloud after deployment
  (jmontleo@redhat.com)
- Handling missing repository errors (daviddavis@redhat.com)
- Use product / repo set ids instead of names; the latter can change
  (sherr@redhat.com)
- fix the OSP repo name in fusor.yaml (jkim@jkimdt.usersys.redhat.com)
- Allowing for one activation key (and its repos) per host group
  (daviddavis@redhat.com)
- make rubocop happy (sherr@redhat.com)
- Make the OpenStack progress bar finer-grained and more accurate
  (sherr@redhat.com)
- explain test skip (sherr@redhat.com)
- upstream changes are causing this test to fail for some reason. Disable until
  we have a chance to investigate (sherr@redhat.com)
- Add Katello class mappings for new fixtures so the magic works right
  (sherr@redhat.com)
- Add CSRF token to PUTs, Make role changes reload model, make deploy calls not
  redirect (sherr@redhat.com)
- change redirect_to to render :json (jmagen@redhat.com)
- add PUT update route to deployment_plans/:id (jmagen@redhat.com)
- modify fusor/server openstack.rb routes (jmagen@redhat.com)
- Fix hard-coded urls in controllers and keep server from saving undercloud
  values (sherr@redhat.com)
- add openstack-related attributes to deployment serializer and minor
  refactoring of fusor/server openstack API changes (jmagen@redhat.com)
- Fix openstack api routes to include deployment id (sherr@redhat.com)
- Remove unneeded openstack node attributes (tzumainn@redhat.com)
- log out what assign host returns (jesusr@redhat.com)
- remove sleep config value, no longer used (jesusr@redhat.com)
- remove sleep and hard coded reboot (jesusr@redhat.com)
- Add the scl repo for the undercloud so that we can install egon
  (sherr@redhat.com)
- fix rubocop's stupid error (sherr@redhat.com)
- Have an OpenStack deployment register the undercloud back to Satellite.
  (sherr@redhat.com)
- add egon support (jmontleo@redhat.com)
- Oops, this commit breaks the openstack pages because deployment id is not
  included in openstack API urls. I should have tested... Revert "Retrieve
  undercloud credentials" (sherr@redhat.com)
- Retrieve undercloud credentials (jrist@redhat.com)
- Jump through rubocop's stupid hoops (sherr@redhat.com)
- Wait for overcloud deployment and make undercloud detection error handling
  better (sherr@redhat.com)
- Cleaning up more code with rubocop (daviddavis@redhat.com)
- Cleaning up ruby code (daviddavis@redhat.com)
- Adding rubocop to check code (daviddavis@redhat.com)
- Separate OpenStack Deployment out into action (sherr@redhat.com)
- add admin password to deployment (jesusr@redhat.com)
- Fixes BZ#1255712 - CloudForms webUI password unchanged (jmontleo@redhat.com)
- 1257312 - strict host checking = false (jesusr@redhat.com)
- Fixes BZ#1247918 - ipmi iface mac can't be blank (iface should not be
  managed) (jmontleo@redhat.com)
- Add openstack repos and fix ssh password field name (sherr@redhat.com)
- fixing syntax errors (sherr@redhat.com)
- fix 1214110 - text fields limited to 250 chars and deployment.description
  changed to text field (jmagen@redhat.com)
-  1254294 - rhev deployment hangs when changing the datacenter/cluster name
  Added ability to specify data center name (jwmatthews@gmail.com)
- deployment object should save undercloud credentials, controller should just
  check that undercloud is running (sherr@redhat.com)
- WIP: Undercloud deployment (rwsu@redhat.com)
- Fixes #BZ1254294 - rhev deployment hangs if dc name changed
  (jmontleo@redhat.com)
- Duplicate puppet_classes block (jrist@redhat.com)
- update to hardcoded credentials (tzumainn@redhat.com)
- workaround for CORS issues caused by using ember proxy (tzumainn@redhat.com)
- add openstack node show (tzumainn@redhat.com)
- corrected return value of openstack node create (tzumainn@redhat.com)
- Add openstack deployment controller (tzumainn@redhat.com)
- Make OpenStack role config 'live' (tzumainn@redhat.com)
- Allow OpenStack nodes to check their ready state (tzumainn@redhat.com)
- Add address to ember OpenStack node model (tzumainn@redhat.com)
- Adds base controller for openstack controllers (tzumainn@redhat.com)
- Enable API call to deploy overcloud (tzumainn@redhat.com)
- Un-mocks role count edits (tzumainn@redhat.com)
- Enable overcloud role assignment through API (tzumainn@redhat.com)
- Un-mock node registration (tzumainn@redhat.com)
- Adds extra specs to flavor json (tzumainn@redhat.com)
- Add openstack deployment plan controller (tzumainn@redhat.com)
- Adds deployment role controller to fusor server (tzumainn@redhat.com)
- adds openstack nodes controller (tzumainn@redhat.com)
- Remove hardcoded value for OpenStack flavor show method (tzumainn@redhat.com)
- Add OpenStack flavor controller and routes (tzumainn@redhat.com)
- merge --no-ff master (jmagen@redhat.com)
- various changes from code review (jesusr@redhat.com)
- add a pause before retrying (jesusr@redhat.com)
- Add retry mechanism as well as better logging. (jesusr@redhat.com)
- Write to the stringio before raising exception (jesusr@redhat.com)
- Use Sat 6.1 GA Tools (jmontleo@redhat.com)
- Fixes BZ#1252562 - Add credentials for Infra Hosts in CFME
  (jmontleo@redhat.com)
- refactor hostgroup OS configuration to accomodate multiple bootable OSs
  (sherr@redhat.com)
- fusor server: skip polling data center, until rhev ip is available
  (bbuckingham@redhat.com)
- change deployments#update to use save(:validate => false) (jmagen@redhat.com)
- fusor server: during rhev deployment, wait for data center to go green
  (bbuckingham@redhat.com)
- log command output properly instead of class id (jesusr@redhat.com)
- check if io is open before closing. (jesusr@redhat.com)
- lookup the deployment object before using it (jesusr@redhat.com)
- fusor server: set open_timeout when interacting with cfme to add rhev
  provider (bbuckingham@redhat.com)
- do not pass root pw to add provider, we don't use it there.
  (jesusr@redhat.com)
- update password for cfme before using it (jesusr@redhat.com)
- update ssh_connection class to match that of egon (jesusr@redhat.com)
- use password from UI for CFME root user (jesusr@redhat.com)
- Update so we will silence all requests for foreman_tasks polling
  (jwmatthews@gmail.com)
- refactor to use same HostBaseSerializer for both Host::Managed and
  Host::Discovered (jmagen@redhat.com)
- use Satellite Tools appropriate for Satellite 6.1 (jmontleo@redhat.com)
- added cfme_address to summary page (jmagen@redhat.com)
- Refactor things to align with changes made in the last month
  (sherr@redhat.com)
- Make test run against latest foreman and katello upstream (sherr@redhat.com)
- Add some tests for a couple of content actions (sherr@redhat.com)
- Add additional tests and clean up warnings (sherr@redhat.com)
- Add several tests for subscription actions (sherr@redhat.com)
- clean up test setup so that we can re-use fixtures from katello / foreman
  Leads to more 'real data' and less mocking / stubbing (sherr@redhat.com)
- Add infrastructure and some tests for Actions (sherr@redhat.com)
- Added check that Katello.config.logging.ignored_paths exists prior to adding
  an entry to it (jwmatthews@gmail.com)
- fusor server: store cfme ip address during deployment
  (bbuckingham@redhat.com)
- Drop Optional channel, RHEV Management Agents no longer requires it
  (sherr@redhat.com)
- added validiation to included if Rhev is self-hosted (jmagen@redhat.com)
- Use 6.7 kickstart, sync rhel optional, don't sync hypervisor repo
  (sherr@redhat.com)
- Add Access Insights puppet module to deployment if it's selected in UI
  (sherr@redhat.com)
- add selinux Requires (jmontleo@redhat.com)
- fusor server: refactoring deploy action in to multiple sub-actions
  (bbuckingham@redhat.com)
- Silences logging noise from ForemanTasksController#show, uses SilencedLogger
  from Katello (jwmatthews@gmail.com)
- Add a bit more validation to nfs paths (sherr@redhat.com)
- Adding a sleep between saving a Host to build it and rebooting it.
  (jwmatthews@gmail.com)
- fusor server: deploy: activation key : assign 0 quantity
  (bbuckingham@redhat.com)
- fusor server: skip deploy if manage manifest action fails
  (bbuckingham@redhat.com)
- fusor server: cloudforms: update to ensure tasks are executed sequentially
  (bbuckingham@redhat.com)
- fusor server: cloudforms: update to 'wait' for green data center and
  cloudforms console (bbuckingham@redhat.com)
- fusor server: refactor the deploy cloudforms action in to mulitple actions
  (bbuckingham@redhat.com)
- ember-data adapaters and serializers for pools, entitlements, and
  subscriptions (jmagen@redhat.com)
- customer portal - remove leading slash from resource (bbuckingham@redhat.com)
- Re-enable deployment validation for when we deploy only (sherr@redhat.com)
- unbreak the flow, we currently save empty deploy objects and then update them
  as we go. (sherr@redhat.com)
- leave command as info instead of debug (jesusr@redhat.com)
- cleanup logging (jesusr@redhat.com)
- Fix typo on Requires for ruby193-rubygem-net-ssh (jwmatthews@gmail.com)
- Fix add_rhev_provider, typo preventing it from configuring RHEV
  (jwmatthews@gmail.com)
- Updates from testing (jwmatthews@gmail.com)
- Updates from testing cfme deployment (jwmatthews@gmail.com)
- verify params, don't plan if cfme is false (jesusr@redhat.com)
- use CFME / RHEV values from deployment object (jesusr@redhat.com)
- implement is_cloudforms_up method. (jesusr@redhat.com)
- add script dir to other script cmds. (jesusr@redhat.com)
- fusor server: additional logic to deploy cfme (bbuckingham@redhat.com)
- implement is rhev up (jesusr@redhat.com)
- add import_template (jesusr@redhat.com)
- add more methods for cfme (jesusr@redhat.com)
- fusor server: logic to locate path to cloudforms ova file
  (bbuckingham@redhat.com)
- scp ova file to rhev engine (jesusr@redhat.com)
- fusor server: support 'adding rhev provider' to cloudforms VM
  (bbuckingham@redhat.com)
- fusor server: rename deploy_cloudforms file (bbuckingham@redhat.com)
- Add debug logging (jesusr@redhat.com)
- plan deploy cfme, add more logging (jesusr@redhat.com)
- add supporting methods (jesusr@redhat.com)
- update to match egon, we need to use the same one at some point
  (jesusr@redhat.com)
- skeleton work for cloudforms deployment (jesusr@redhat.com)
- ssh stolen from egon (jesusr@redhat.com)
- Make run_command "static" or whatever they call it in ruby
  (jesusr@redhat.com)
- a utility class to run commands and capture their output and status
  (jesusr@redhat.com)
- add rhevm-image-uploader as a dependency (jesusr@redhat.com)
- initial cut at cloudforms (jesusr@redhat.com)
- Group storage options appropriately (sherr@redhat.com)
- remove the discovered host uniqueness constraints and skip associated tests
  We can re-enable these constraints / tests later if we want to, but for now
  we haven't decided we want to enforce them yet (sherr@redhat.com)
- rhev hypervisor naming convention and patternfly table style
  (jmagen@redhat.com)
- fusor server: update foreman puppet classes during content view publishing
  (bbuckingham@redhat.com)
- fusor server: update trigger provisioning of hosts to be in sequence
  (bbuckingham@redhat.com)
- fusor server: set ovirt::deploy_cfme parameter based on deployment setting
  (bbuckingham@redhat.com)
- 1227451 - Race condition with loading modules in Foreman
  (jwmatthews@gmail.com)
- Add a smart validator to the deployment model object (sherr@redhat.com)
- Make the create api test less fragile (sherr@redhat.com)
- Fix a couple of things in the model associations to make tests happier
  (sherr@redhat.com)
- Fix / Create test infrastructure and write some tests (sherr@redhat.com)
- fusor server: fix issue that occured from a recent cherry-pick
  (bbuckingham@redhat.com)
- check if organization already has a subscription manifest uploaded and show
  UI message (jmagen@redhat.com)
- fusor server: additional RHEV attributes and binding to available puppet
  parameters (bbuckingham@redhat.com)
- fusor server: deploy: updates to support CloudForms content
  (bbuckingham@redhat.com)
- fusor server: update to use org manifest, if one not provided on deployment
  (bbuckingham@redhat.com)
- 1222968 - Validate password length in RHCI to avoid failed deployments
  (sherr@redhat.com)
- save upstream_consumer_uuid attribute for deployment (jmagen@redhat.com)
- fusor server: update activation key subscriptions to support multiple pools
  (bbuckingham@redhat.com)
- fusor server: re-order behavior of the activation creation action
  (bbuckingham@redhat.com)
- fusor server: update deploy to wait on completion of host provisioning
  (bbuckingham@redhat.com)
- fusor server: deployment: update to support root password per product
  (bbuckingham@redhat.com)
- add root password in UI for RHEV and CFME hosts (jmagen@redhat.com)
- Changing name of permission for :destroy_discovered_hosts, since it conflicts
  with permission created by foreman-discovery (jwmatthews@gmail.com)
- fusor server: uncomment hosts_addresses (bbuckingham@redhat.com)
- fusor server: decouple puppet class parameter configuration from the
  hostgroups (bbuckingham@redhat.com)
- remove db attribute rhev_engine_hostname (jmagen@redhat.com)
- fusor server: support deploying using the 'Default Organization View' content
  view (bbuckingham@redhat.com)
- Cleanup logging (jesusr@redhat.com)
- fusor server: support manually imported manifest (bbuckingham@redhat.com)
- remove debug logging from plan & finalize methods (jesusr@redhat.com)
- fusor server: deploy: manage manifest with deploy action
  (bbuckingham@redhat.com)
- reboot host (jesusr@redhat.com)
- fusor server: customer portal: store/use credentials in/from session
  (bbuckingham@redhat.com)
- add foreman_task_uuid to deployments table (jmagen@redhat.com)
- fusor server: update to support multiple hypervisors (bbuckingham@redhat.com)
- PUT deploy v21 inherits from v2 rather than duplicating code
  (jmagen@redhat.com)

* Wed Apr 15 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-19
- fusor server: hard-code root_pass and set storage_path param on hostgroup
  (bbuckingham@redhat.com)

* Tue Apr 07 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-18
- Merge pull request #77 from bbuckingham/set_host_address (jmrodri@gmail.com)
- validate rhev engine host (jesusr@redhat.com)
- fusor server: set ovirt::engine::config host_address puppet parameter
  (bbuckingham@redhat.com)
- cleanup logging to make it easier to read logs (jesusr@redhat.com)
- Add deploy rhev action. (jesusr@redhat.com)
- include mix in ::ActionController::Base for disabling CSRF for devs
  (jmagen@redhat.com)

* Mon Apr 06 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-17
- fusor server: add deploy option to 'skip_content' (bbuckingham@redhat.com)

* Thu Apr 02 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-16
- Merge pull request #70 from bbuckingham/fix_rh_common (jmrodri@gmail.com)
- fusor server: update fusor.yaml to fix RH common and add virt agent
  (bbuckingham@redhat.com)

* Thu Apr 02 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-15
- dynamic assign route for next tab after RHEV (jmagen@redhat.com)
- revert hostgroup extension that was deleted by mistake (jmagen@redhat.com)
- prep work to disable CSRF for devs by commenting out one line
  (jmagen@redhat.com)

* Wed Apr 01 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-14
- fusor server: deployment hostgroup: fix the setting of architecture and
  partition table (bbuckingham@redhat.com)

* Wed Apr 01 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-13
- Add RH Common to fusor.yaml (jesusr@redhat.com)
- fixed /deployments redirecting to /deployments/new when it shoudn't
  (jmagen@redhat.com)
- Merge pull request #57 from bbuckingham/use_puppet_default
  (jwmatthews@gmail.com)
- fusor server: if deployment attribute is blank, use the puppet default
  (bbuckingham@redhat.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-12
- fusor server: update hostgroup to override parameters based on deployment
  object (bbuckingham@redhat.com)
- ignore error Encoding::UndefinedConversionError: xBA from ASCII-8BIT to UTF-8
  (jmagen@redhat.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-11
- Merge pull request #46 from jwmatthews/rpm_spec_downstream
  (jwmatthews@gmail.com)
- Merge pull request #52 from bbuckingham/hostgroup_param_overrride
  (jwmatthews@gmail.com)
- fusor server: update config and deploy action to support overriding
  parameters on hostgroups (bbuckingham@redhat.com)
- Updates so we can build with downstream foreman macros (jwmatthews@gmail.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-10
- add permission to Fusor and FusorUI (jmagen@redhat.com)

* Fri Mar 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-9
- fusor server: update customer_portal_proxies_controller definition
  (bbuckingham@redhat.com)

* Fri Mar 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-8
- fusor server: update akey logic to enable repositories
  (bbuckingham@redhat.com)
- Merge pull request #28 from bbuckingham/portal-proxy (jmrodri@gmail.com)
- fusor server: initial code for proxying api requests to the customer portal
  (bbuckingham@redhat.com)

* Wed Mar 25 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-7
- Merge pull request #37 from bbuckingham/fixes-hostgroup-arch
  (jwmatthews@gmail.com)
- fusor server: hostgroup: set architecture on the deployment hostgroup
  (bbuckingham@redhat.com)
- Include fusor.yaml in RPM of fusor-server (jwmatthews@gmail.com)

* Wed Mar 25 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-6
- fusor server: fix apipie doc cache (bbuckingham@redhat.com)
- Fixed RHEV hypervisor selection and other refactoring
  (joseph@isratrade.co.il)

* Fri Mar 20 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-5
- Add requires for active_model_serializers and foretello_api_v21
  (jwmatthews@gmail.com)

* Thu Mar 19 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-4
- Merge pull request #32 from bbuckingham/update_fusor_yaml (jmrodri@gmail.com)
- Merge pull request #31 from fusor/rpm_fusor (jwmatthews@gmail.com)
- fusor server: update fusor.yaml to support the chgs for hostgroup named by
  deployment (bbuckingham@redhat.com)
- fusor server: allow creation of hostgroup with no parent
  (bbuckingham@redhat.com)
- fusor server: fix to properly locate hostgroup based upon ancestry
  (bbuckingham@redhat.com)
- fixed deployment_serializer to remove deleted attributes
  :rhev_hypervisor_host_id and :rhev_hypervisor_hostname
  (joseph@isratrade.co.il)
- fixed duplication migration (joseph@isratrade.co.il)
- Merge pull request #26 from bbuckingham/create_rhev_hostgroups_2
  (jmrodri@gmail.com)
- fusor server: update to support multiple deployments per org
  (bbuckingham@redhat.com)
- create/edit deployments and persist in database (joseph@isratrade.co.il)
- fusor server: enable puppet smart class parameter overrides
  (bbuckingham@redhat.com)
- fusor server: create hostgroups and activation key for rhev deployment
  (bbuckingham@redhat.com)
- remove hypervisor columns, add self_hosted column. (jesusr@redhat.com)

* Tue Mar 10 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-3
- Remove use of %%{foreman_assets_plugin} since we don't have any files under
  public/assets/fusor_server (jwmatthews@gmail.com)
- Move lib/fusor.rb to lib/fusor_server.rb to allow RPM build to succeed with
  macro: %%{foreman_assets_plugin} (jwmatthews@gmail.com)
- Update requires for rubygem-active_model_serializers to use scl prefix
  (jwmatthews@gmail.com)

* Tue Mar 10 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-2
- new package built with tito

