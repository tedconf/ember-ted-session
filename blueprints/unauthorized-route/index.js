var fs = require('fs-extra');
var path = require('path');
var EmberRouterGenerator = require('ember-router-generator');

/*jshint node:true*/
module.exports = {

  // usage: ember g unauthorized-route
  description: 'Generates an unauthorized route and template and registers the route with the router.',

  normalizeEntityName: function(entityName){
    return entityName || "unauthorized";
  },

  fileMapTokens: function() {
    return {
      __templatepath__: function(options) {
        if (options.pod) {
          return path.join(options.podPath, options.dasherizedModuleName);
        }
        return 'templates';
      },
      __templatename__: function(options) {
        if (options.pod) {
          return 'template';
        }
        return options.dasherizedModuleName;
      },
      __routepath__: function(options) {
        if (options.pod) {
          return path.join(options.podPath, options.dasherizedModuleName);
        }
        return 'routes';
      },
      __routename__: function(options) {
        if (options.pod) {
          return 'route';
        }
        return options.dasherizedModuleName;
      }
    }
  },

  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);
    addOutlet.call(this, options);
  },

  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};

function updateRouter(action, options) {
  var entity = options.entity;
  var actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  var color = actionColorMap[action] || 'gray';

  writeRoute(action, entity.name, options);

  this.ui.writeLine('updating router');
  this.ui.writeLine(`${action} route ${entity.name}`)
}

function findRouter(options) {
  var routerPathParts = [options.project.root];

  if (options.dummy && options.project.isEmberCLIAddon()) {
    routerPathParts = routerPathParts.concat(['tests', 'dummy', 'app', 'router.js']);
  } else {
    routerPathParts = routerPathParts.concat(['app', 'router.js']);
  }

  return routerPathParts;
}

function writeRoute(action, name, options) {
  var routerPath = path.join.apply(null, findRouter(options));
  var source = fs.readFileSync(routerPath, 'utf-8');

  var routes = new EmberRouterGenerator(source);
  var newRoutes = routes[action](name, options);

  fs.writeFileSync(routerPath, newRoutes.code());
}
