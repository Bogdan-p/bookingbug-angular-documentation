(function() {
  "use strict";

  /***
  * @ngdoc service
  * @name BB.Services:FormDataStoreService
  *
  * @description
  * Factory FormDataStoreService
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeou tmore}
  *
  * @param {service} $log Simple service for logging.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$log more}
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
  * @returns {Promise} This service has the following set of methods:
  *
  * - log()
  * - showInfo()
  * - setIfUndefined(keyName, val)
  * - resetValuesOnScope(scope, props)
  * - clear(scope, keepScopeValues)
  * - storeFormData()
  * - setValuesOnScope(currentPage, scope)
  * - getParentScope(scope)
  * - checkRegisteredWidgets(scope)
  * - checkForListeners(propsArr)
  * - setListeners(scope, listenerArr, currentPage)
  * - init(uid, scope, propsArr)
  * - removeWidget(scope)
  * - register(scope)
  *
   */
  angular.module('BB.Services').factory('FormDataStoreService', function($rootScope, $window, $log, $parse) {
    var checkForListeners, checkRegisteredWidgets, clear, dataStore, div, getParentScope, init, log, register, registeredWidgetArr, removeWidget, resetValuesOnScope, setIfUndefined, setListeners, setValuesOnScope, showInfo, storeFormData, toId;
    registeredWidgetArr = [];
    dataStore = {};
    toId = 0;
    div = '___';
    log = function() {};
    showInfo = function() {
      return log(dataStore);
    };
    setIfUndefined = function(keyName, val) {
      var getter, scope;
      scope = this;
      getter = $parse(keyName);
      if (typeof getter(scope) === 'undefined') {
        return getter.assign(scope, val);
      }
    };
    resetValuesOnScope = function(scope, props) {
      var i, len, prop, setter;
      for (i = 0, len = props.length; i < len; i++) {
        prop = props[i];
        prop = $parse(prop);
        setter = prop.assign;
        setter(scope, null);
      }
    };
    clear = function(scope, keepScopeValues) {
      var data, key, widgetId;
      if (!scope) {
        throw new Error('Missing scope object. Cannot clear form data without scope');
      }
      if (_.isString(scope)) {
        data = dataStore[scope];
        if (!keepScopeValues) {
          resetValuesOnScope(data[0], data[1]);
        }
        delete dataStore[scope];
        return;
      }
      scope = getParentScope(scope);
      if (scope && scope.bb) {
        widgetId = scope.bb.uid;
        removeWidget(scope);
        for (key in dataStore) {
          data = dataStore[key];
          if (key.indexOf(widgetId) !== -1) {
            if (data[3]) {
              _.each(data[3], function(func) {
                if (_.isFunction(func)) {
                  return func();
                }
              });
            }
            if (!keepScopeValues) {
              resetValuesOnScope(data[0], data[1]);
            }
            delete dataStore[key];
          }
        }
      }
    };
    storeFormData = function() {
      var i, key, len, ndata, prop, props, scope, step, val;
      log('formDataStore ->', dataStore);
      for (key in dataStore) {
        step = dataStore[key];
        log('\t', key);
        scope = step[0];
        props = step[1];
        ndata = step[2];
        if (!ndata) {
          ndata = step[2] = {};
        }
        for (i = 0, len = props.length; i < len; i++) {
          prop = props[i];
          val = ndata[prop];
          if (val === 'data:destroyed') {
            ndata[prop] = null;
          } else {
            val = angular.copy(scope.$eval(prop));
            ndata[prop] = val;
          }
          log('\t\t', prop, val);
        }
        log('\n');
      }
    };
    setValuesOnScope = function(currentPage, scope) {
      var cpage, storedValues;
      cpage = dataStore[currentPage];
      storedValues = cpage[2];
      log('Decorating scope ->', currentPage, storedValues);
      if (_.isObject(storedValues)) {
        _.each(_.keys(storedValues), function(keyName) {
          var getter;
          if (typeof storedValues[keyName] !== 'undefined' && storedValues[keyName] !== 'data:destroyed') {
            getter = $parse(keyName);
            return getter.assign(scope, storedValues[keyName]);
          }
        });
      }
      cpage[0] = scope;
      log(scope);
      log('\n');
    };
    getParentScope = function(scope) {
      while (scope) {
        if (scope.hasOwnProperty('cid') && scope.cid === 'BBCtrl') {
          return scope;
        }
        scope = scope.$parent;
      }
    };
    checkRegisteredWidgets = function(scope) {
      var i, isRegistered, len, rscope;
      isRegistered = false;
      scope = getParentScope(scope);
      for (i = 0, len = registeredWidgetArr.length; i < len; i++) {
        rscope = registeredWidgetArr[i];
        if (rscope === scope) {
          isRegistered = true;
        }
      }
      return isRegistered;
    };
    checkForListeners = function(propsArr) {
      var watchArr;
      watchArr = [];
      _.each(propsArr, function(propName, index) {
        var split;
        split = propName.split('->');
        if (split.length === 2) {
          watchArr.push(split);
          return propsArr[index] = split[0];
        }
      });
      return watchArr;
    };
    setListeners = function(scope, listenerArr, currentPage) {
      var cpage, listenersArr;
      if (listenerArr.length) {
        cpage = dataStore[currentPage];
        listenersArr = cpage[3] || [];
        _.each(listenerArr, function(item, index) {
          var func;
          func = $rootScope.$on(item[1], function() {
            var e, error;
            try {
              return cpage[2][item[0]] = 'data:destroyed';
            } catch (error) {
              e = error;
              return log(e);
            }
          });
          return listenersArr.push(func);
        });
        return cpage[3] = listenersArr;
      }
    };
    init = function(uid, scope, propsArr) {
      var currentPage, watchArr;
      if (checkRegisteredWidgets(scope)) {
        currentPage = scope.bb.uid + div + scope.bb.current_page + div + uid;
        currentPage = currentPage.toLowerCase();
        watchArr = checkForListeners(propsArr);
        scope.clearStoredData = (function(currentPage) {
          return function() {
            clear(currentPage);
          };
        })(currentPage);
        if (!currentPage) {
          throw new Error("Missing current step");
        }
        if (dataStore[currentPage]) {
          setValuesOnScope(currentPage, scope);
          return;
        }
        log('Controller registered ->', currentPage, scope, '\n\n');
        dataStore[currentPage] = [scope, propsArr];
        setListeners(scope, watchArr, currentPage);
      }
    };
    removeWidget = function(scope) {
      registeredWidgetArr = _.without(registeredWidgetArr, scope);
    };
    register = function(scope) {
      var registered;
      registered = false;
      if (scope && scope.$$childHead) {
        scope = scope.$$childHead;
      }
      while (!_.has(scope, 'cid')) {
        scope = scope.$parent;
      }
      if (!scope) {
        return;
      }
      if (scope.cid !== 'BBCtrl') {
        throw new Error("This directive can only be used with the BBCtrl");
      }
      _.each(registeredWidgetArr, function(stored) {
        if (scope === stored) {
          return registered = true;
        }
      });
      if (!registered) {
        log('Scope registered ->', scope);
        scope.$on('destroy', removeWidget);
        return registeredWidgetArr.push(scope);
      }
    };
    $rootScope.$watch(function() {
      $window.clearTimeout(toId);
      toId = setTimeout(storeFormData, 300);
    });
    $rootScope.$on('save:formData', storeFormData);
    $rootScope.$on('clear:formData', clear);
    return {
      init: init,
      destroy: function(scope) {
        return clear(scope, true);
      },
      showInfo: showInfo,
      register: register,
      setIfUndefined: setIfUndefined
    };
  });

}).call(this);
