import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONAPISerializer.extend({
  normalize(typeClass, payload) {
    const token = payload.attributes['csrf-token'];
    if (token) {
      Ember.$.ajaxPrefilter(function(options, originalOptions, xhr) {
        if (token) {
          xhr.setRequestHeader('X-CSRF-Token', token);
        }
      });
    }

    return this._super.apply(this, arguments);
  },

  serialize({ record }) {
    return {
      user: {
        email: record.get('email'),
        password: record.get('password')
      }
    };
  }
});

