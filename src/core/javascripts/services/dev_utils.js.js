(function() {
  angular.module('BB').config(function($logProvider, $injector) {
    return $logProvider.debugEnabled(true);
  });


  /***
  * @ngdoc service
  * @name BB.Services:DebugUtilsService
  *
  * @description
  * Factory DebugUtilsService
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} $log Simple service for logging.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$log more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @returns {Promise} This service has the following set of methods:
  *
  * - query(prms)
  * - logObjectKeys(obj, showValue)
  * - showScopeChain()
  *
   */

  angular.module('BB.Services').factory("DebugUtilsService", function($rootScope, $location, $window, $log, BBModel) {
    var logObjectKeys, showScopeChain;
    logObjectKeys = function(obj, showValue) {
      var key, value;
      for (key in obj) {
        value = obj[key];
        if (obj.hasOwnProperty(key) && !_.isFunction(value) && !(/^\$\$/.test(key))) {
          console.log(key);
          if (showValue) {
            console.log('\t', value, '\n');
          }
        }
      }
    };
    showScopeChain = function() {
      var $root, data, f;
      $root = $('[ng-app]');
      data = $root.data();
      if (data && data.$scope) {
        f = function(scope) {
          console.log(scope.$id);
          console.log(scope);
          if (scope.$$nextSibling) {
            return f(scope.$$nextSibling);
          } else {
            if (scope.$$childHead) {
              return f(scope.$$childHead);
            }
          }
        };
        f(data.$scope);
      }
    };
    (function() {
      if (($location.host() === 'localhost' || $location.host() === '127.0.0.1') && $location.port() === 3000) {
        return window.setTimeout(function() {
          var scope;
          scope = $rootScope;
          while (scope) {
            if (scope.controller === 'public.controllers.BBCtrl') {
              break;
            }
            scope = scope.$$childHead;
          }
          $($window).on('dblclick', function(e) {
            var controller, controllerName, pscope;
            scope = angular.element(e.target).scope();
            controller = scope.hasOwnProperty('controller');
            pscope = scope;
            if (controller) {
              controllerName = scope.controller;
            }
            while (!controller) {
              pscope = pscope.$parent;
              controllerName = pscope.controller;
              controller = pscope.hasOwnProperty('controller');
            }
            $window.bbScope = scope;
            $log.log(e.target);
            $log.log($window.bbScope);
            return $log.log('Controller ->', controllerName);
          });
          $window.bbBBCtrlScopeKeyNames = function(prop) {
            return logObjectKeys(scope, prop);
          };
          $window.bbBBCtrlScope = function() {
            return scope;
          };
          $window.bbCurrentItem = function() {
            return scope.current_item;
          };
          return $window.bbShowScopeChain = showScopeChain;
        }, 10);
      }
    })();
    return {
      logObjectKeys: logObjectKeys
    };
  });

}).call(this);
