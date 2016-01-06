import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osp-global-config-modal', 'Integration | Component | osp global config modal', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{osp-global-config-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#osp-global-config-modal}}
      template block text
    {{/osp-global-config-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
