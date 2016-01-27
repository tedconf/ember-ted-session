# Ember-ted-session

This addon allows your Ember app to quickly pull in session based data,
like current user, from your TED backend.

## Requirements

* JSONAPI
* Your application must have a `User` model.

## Install

`ember install ember-ted-session`

## Usage

### Current user

As soon as your application boots up you'll probably want to fetch the
current user. The `ted-session` service has a `#fetch` method for that.

```
// application/route.js

export default Ember.Route.extend({
  tedSession: Ember.inject.service(),

  beforeModel() {
    this.get('tedSession').fetch();
  }
});
```

Now any component can access the current user by just injecting the
service.

```
// my-widget/component.js

export default Ember.Component.exnted({
  tedSession: Ember.inject.service(),
  currentUser: Ember.computed.readOnly('tedSession.currentUser')
});
```

### Logging in

If you want to build a login form to let users login you can use the
`ted-session` model to authenticate with the backend.

```
// login/route.js

export default Ember.Route.extend({
  tedSession: Ember.inject.service(),

  actions: {
    login(email, password) {
      this.get('tedSession')
        .login(email, password)
        .then(() => console.log('it worked'))
        .catch(() => console.loa('nope'));
    }
  }
});
```

#### Session service API

API | Type | About | Returns | Example
--- | --- | --- | --- | ---
`fetch()` | `function` | Fetches the current user from the backend | `Promise` | `tedSessionService.fetch()`
`terminate()` | `function` | Tells the backend to log the current user out | `Promise` | `tedSessionService.terminate()`
`login(email, password)` | `function` | Logs in the user | `Promise` | `tedSessionService.login('rt@ted.com', 'password');`
`currentUser` | `property` | Returns the current user | `User DS.Model` | `tedSession.get('currentUser')`
`isLoggedIn` | `property` | Is there a current user | `Boolean` | `tedSession.get('isLoggedIn')`
`isNotLoggedIn` | `property` | Is there no current user | `Boolean` | `tedSession.get('isNotLoggedIn')`

## Details

#### Payload

The get expects a JSON API document.

```
// GET ted-sessions/current

{
  "data": {
    "id": "current",
    "type": "ted-sessions",
    "links": {
      "self": "/ted-sessions/current"
    },
    "attributes": {
      "csrf-token": "token"
    },
    "relationships": {
      "user": {
        "links": {
          "self": "/ted-sessions/current/relationships/user",
          "related": "/ted-sessions/current/user"
        }
      }
    }
  }
}
```

The post however is formatted to match the JSON that a normal devise
session controller would expect.


```
// POST ted-sessions/current

user: {
  email: "email",
  password: "password"
}
```

#### CSRF token

If your response payload includes an attribute called `csrf-token` then
it will be used as the `X-CSRF-TOKEN` in all future XHR requests.

