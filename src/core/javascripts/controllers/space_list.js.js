(function() {
  'use strict';

  /***
  * @ndgoc directive
  * @name BB.Directives:bbSpaces
  *
  * @restrict AE
  * @scope true
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbSpaces
  *
  * # Has the following set of methods:
  *
   */
  angular.module('BB.Directives').directive('bbSpaces', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'SpaceList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:SpaceList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller SpaceList
  *
  * # Has the following set of methods:
  *
  * - $scope.init(comp)
  * - $scope.selectItem(item, route)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires BB.Services:ServiceService
  * @requires BB.Services:SpaceService
  * @requires $q
  *
   */

  angular.module('BB.Controllers').controller('SpaceList', function($scope, $rootScope, ServiceService, SpaceService, $q) {
    $scope.controller = "public.controllers.SpaceList";
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = (function(_this) {
      return function(comp) {
        return SpaceService.query(comp).then(function(items) {
          if ($scope.currentItem.category) {
            items = items.filter(function(x) {
              return x.$has('category') && x.$href('category') === $scope.currentItem.category.self;
            });
          }
          $scope.items = items;
          if (items.length === 1 && !$scope.allowSinglePick) {
            $scope.skipThisStep();
            $rootScope.services = items;
            return $scope.selectItem(items[0], $scope.nextRoute);
          } else {
            return $scope.listLoaded = true;
          }
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        $scope.currentItem.setService(item);
        return $scope.decide_next_page(route);
      };
    })(this);
  });

}).call(this);
