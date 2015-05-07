import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:ovirt/engine', 'OvirtEngineRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
