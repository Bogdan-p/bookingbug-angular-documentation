(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbTimeSlots
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbTimeSlots
  *
  * See Controller {@link BB.Controllers:TimeSlots TimeSlots}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'TimeSlots'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbTimeSlots', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'TimeSlots',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
        if (attrs.bbShowAll) {
          scope.show_all = true;
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:TimeSlots
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller TimeSlots
  *
  * # Has the following set of methods:
  * - $scope.init(company)
  * - setItem (slot)
  * - $scope.selectItem(slot, route)
  *
  * @requires $rootScope
  * @requires $scope
  * @requires $q
  * @requires $attrs
  * @requires BB.Services:SlotService
  * @requires BB.Services:FormDataStoreService
  * @requires BB.Services:ValidatorService
  * @requires BB.Services:PageControllerService
  * @requires angular-hal:halClient
  * @requires BB.Models:BBModel
  *
  *
   */

  angular.module('BB.Controllers').controller('TimeSlots', function($scope, $rootScope, $q, $attrs, SlotService, FormDataStoreService, ValidatorService, PageControllerService, halClient, BBModel) {
    var setItem;
    $scope.controller = "public.controllers.SlotList";
    $scope.notLoaded($scope);
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(company) {
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      $scope.start_date = moment();
      $scope.end_date = moment().add(1, 'month');
      return SlotService.query($scope.bb.company, {
        item: $scope.booking_item,
        start_date: $scope.start_date.toISODate(),
        end_date: $scope.end_date.toISODate()
      }).then(function(slots) {
        $scope.slots = slots;
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    setItem = function(slot) {
      return $scope.booking_item.setSlot(slot);
    };
    return $scope.selectItem = function(slot, route) {
      if ($scope.$parent.$has_page_control) {
        setItem(slot);
        return false;
      } else {
        setItem(slot);
        $scope.decideNextPage(route);
        return true;
      }
    };
  });

}).call(this);
