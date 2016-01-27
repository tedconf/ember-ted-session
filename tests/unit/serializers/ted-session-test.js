import { moduleForModel, test } from 'ember-qunit';

moduleForModel('ted-session', 'Unit | Serializer | ted session', {
  // Specify the other units that are required for this test.
  needs: ['serializer:ted-session']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
