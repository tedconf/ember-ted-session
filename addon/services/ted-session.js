import Ember from 'ember';

export default Ember.Service.extend({
  model: null,

  store: Ember.inject.service(),

  currentUser: Ember.computed.readOnly('model.user'),
  isLoggedIn: Ember.computed.bool('currentUser'),
  isNotLoggedIn: Ember.computed.not('isLoggedIn'),

  login(email, password) {
    return this.get('store')
      .createRecord('ted-session', { email, password })
      .save()
      .then((model) => {
        this.set('model', model);
        return model;
      });
  },

  fetch() {
    return this.get('store').findRecord('ted-session', 'current')
      .then((model) => {
        this.set('model', model);
      }, () => {
        // rejected
        this.set('model', null);
      });
  },

  terminate() {
    const model = this.get('model');
    const promise =  model ? model.destroyRecord() : Ember.RSVP.resolve();

    return promise.then(() => this.set('model', null));
  }
});
