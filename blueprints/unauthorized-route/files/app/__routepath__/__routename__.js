import Ember from 'ember';

export default Ember.Route.extend({
  tedSession: Ember.inject.service(),
  beforeModel() {
    if (this.get('tedSession.isAuthorized')) {
      this.transitionTo('/');
    }
  },
  renderTemplate() {
    this.render('unauthorized', {
      outlet: 'unauthorized'
    });
  }
});