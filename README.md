# Deprecation Notice

TED has shifted to React and will no longer maintain this application/library. If you wish to continue using this application/library, please create a pull request and repo ownership can be transferred. This repository will be archived at the end of 2022.

# Ember-ted-session

This addon allows your Ember app to quickly pull in session based data,
like current user, from your TED backend.

## Requirements

* JSONAPI
* Your application must have a `User` model.
* If using authorization, your `User` model must have an `isAuthorized` property

## Install

`ember install ember-ted-session`

## Usage

### Current user

As soon as your application boots up you'll probably want to fetch the
current user. The `ted-session` service has a `#fetch` method for that.

```javascript
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

```javascript
// my-widget/component.js

export default Ember.Component.exnted({
  tedSession: Ember.inject.service(),
  currentUser: Ember.computed.readOnly('tedSession.currentUser')
});
```

### Logging in

If you want to build a login form to let users login you can also use
the `ted-session` service to authenticate with the backend.

```javascript
// login/route.js

export default Ember.Route.extend({
  tedSession: Ember.inject.service(),

  actions: {
    login(email, password) {
      this.get('tedSession')
        .login(email
          , password)
        .then(() => console.log('it worked'))
        .catch(() => console.loa('nope'));
    }
  }
});
```

### Generating an unauthorized route

If your app distinguishes between authorized and un-authorized users (eg. not all authenticated users are authorized), you will probably want to redirect unauthorized users to a page explaining what happened. This addon contains a custom generator for creating this automagically.

##### Requirements: 
* a named `unauthorized` outlet in your application template: `{{outlet 'unauthorized'}}`

##### Usage: 

* `ember generate unauthorized-route` will create a route named `unauthorized` and add it to your app's router.
* `ember generate unauthorized-route aw-hells-no` will create the same but with your custom name (`aw-hells-no` in this case).

This generator will use your app's pod configuration and also accepts ember-cli's `--pod` flag.

### Session service API

API | Type | About | Returns | Example
--- | --- | --- | --- | ---
`fetch()` | `function` | Fetches the current user from the backend | `Promise` | `tedSessionService.fetch()`
`terminate()` | `function` | Tells the backend to log the current user out | `Promise` | `tedSessionService.terminate()`
`login(email, password)` | `function` | Logs in the user | `Promise` | `tedSessionService.login('rt@ted.com', 'password');`
`currentUser` | `property` | Returns the current user | `User DS.Model` | `tedSession.get('currentUser')`
`isLoggedIn` | `property` | Is there a current user | `Boolean` | `tedSession.get('isLoggedIn')`
`isNotLoggedIn` | `property` | Is there no current user | `Boolean` | `tedSession.get('isNotLoggedIn')`
`isAuthorized` | `property` | Returns `isAuthorized` property of the current user model, `false` if unavailable. | `Boolean` | `tedSession.get('isAuthorized')`

## Details

#### Payload

The get expects a JSON API document.

```json
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
        `isAuthorized`: true // optional 
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


```json
// POST ted-sessions/current

"user": {
  "email": "email",
  "password": "password"
}
```

#### CSRF token

If your response payload includes an attribute called `csrf-token` then
it will be used as the `X-CSRF-TOKEN` in all future XHR requests.

