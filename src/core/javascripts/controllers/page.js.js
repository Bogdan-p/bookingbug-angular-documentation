(function() {
  'use strict';
  var BBBasicPageCtrl;

  BBBasicPageCtrl = function($scope, $q, ValidatorService) {
    var isScopeReady;
    $scope.controllerClass = "public.controllers.PageController";
    $scope.$has_page_control = true;
    $scope.validator = ValidatorService;
    isScopeReady = (function(_this) {
      return function(cscope) {
        var child, children, i, len, ready, ready_list;
        ready_list = [];
        children = [];
        child = cscope.$$childHead;
        while (child) {
          children.push(child);
          child = child.$$nextSibling;
        }
        children.sort(function(a, b) {
          if ((a.ready_order || 0) >= (b.ready_order || 0)) {
            return 1;
          } else {
            return -1;
          }
        });
        for (i = 0, len = children.length; i < len; i++) {
          child = children[i];
          ready = isScopeReady(child);
          if (angular.isArray(ready)) {
            Array.prototype.push.apply(ready_list, ready);
          } else {
            ready_list.push(ready);
          }
        }
        if (cscope.hasOwnProperty('setReady')) {
          ready_list.push(cscope.setReady());
        }
        return ready_list;
      };
    })(this);
    $scope.checkReady = function() {
      var checkread, i, len, ready_list, v;
      ready_list = isScopeReady($scope);
      checkread = $q.defer();
      $scope.$checkingReady = checkread.promise;
      ready_list = ready_list.filter(function(v) {
        return !((typeof v === 'boolean') && v);
      });
      if (!ready_list || ready_list.length === 0) {
        checkread.resolve();
        return true;
      }
      for (i = 0, len = ready_list.length; i < len; i++) {
        v = ready_list[i];
        if ((typeof value === 'boolean') || !v) {
          checkread.reject();
          return false;
        }
      }
      $scope.notLoaded($scope);
      $q.all(ready_list).then(function() {
        $scope.setLoaded($scope);
        return checkread.resolve();
      }, function(err) {
        return $scope.setLoaded($scope);
      });
      return true;
    };
    return $scope.routeReady = function(route) {
      if (!$scope.$checkingReady) {
        return $scope.decideNextPage(route);
      } else {
        return $scope.$checkingReady.then((function(_this) {
          return function() {
            return $scope.decideNextPage(route);
          };
        })(this));
      }
    };
  };


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPage
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbPage
  *
  * See Controller {@link BB.Controllers:PageController PageController}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'PageController'
  * </pre>
  *
   */

  angular.module('BB.Directives').directive('bbPage', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PageController'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:PageController
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PageController
  *
  * Dont' give this $scope a 'controller' property as it's used for controller
  * inheritance, so the $scope agument is not injected but passed in as an
  * argument, so it would overwrite the property set elsewhere.
  *
  * # Has the following set of methods:
  * - method1
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
   */

  angular.module('BB.Controllers').controller('PageController', BBBasicPageCtrl);


  /***
  * @ngdoc service
  * @name BB.Services:PageControllerService
  *
  * @description
  *
  * Service PageControllerService
  *
   */

  angular.module('BB.Services').value("PageControllerService", BBBasicPageCtrl);

}).call(this);
