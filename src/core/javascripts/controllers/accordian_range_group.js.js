(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbAccordianRangeGroup
  * @restrict AE
  * @scope true
  *
  * @description
  {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbAccordianRangeGroup
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link: (scope, element, attrs, ctrl)
  *
   */
  angular.module('BB.Directives').directive('bbAccordianRangeGroup', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      require: '^?bbTimeRangeStacked',
      controller: 'AccordianRangeGroup',
      link: function(scope, element, attrs, ctrl) {
        scope.options = scope.$eval(attrs.bbAccordianRangeGroup) || {};
        return scope.options.using_stacked_items = ctrl != null;
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:AccordianRangeGroup
  *
  * @description
  *{@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller AccordianRangeGroup
  *
  * # Has the following set of methods:
  * - $scope.setFormDataStoreId(id)
  * - $scope.init(start_time, end_time, options)
  * - $scope.setRange(start_time, end_time)
  * - setData()
  * - updateAvailability(day, slot)
  * - hasAvailability()
  * - $scope.$on 'slotChanged', (event, day, slot)
  * - $scope.$on 'dataReloaded', (event, earliest_slot)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires BB.Services:FormDataStoreService
  * @requires $q
  * @requires $attrs
  *
   */

  angular.module('BB.Controllers').controller('AccordianRangeGroup', function($scope, $attrs, $rootScope, $q, FormDataStoreService) {
    var hasAvailability, setData, updateAvailability;
    $scope.controller = "public.controllers.AccordianRangeGroup";
    $scope.collaspe_when_time_selected = true;
    $rootScope.connection_started.then(function() {
      if ($scope.options && $scope.options.range) {
        return $scope.init($scope.options.range[0], $scope.options.range[1], $scope.options);
      }
    });
    $scope.setFormDataStoreId = function(id) {
      return FormDataStoreService.init('AccordianRangeGroup' + id, $scope, []);
    };
    $scope.init = function(start_time, end_time, options) {
      $scope.setRange(start_time, end_time);
      return $scope.collaspe_when_time_selected = options && !options.collaspe_when_time_selected ? false : true;
    };
    $scope.setRange = function(start_time, end_time) {
      if (!$scope.options) {
        $scope.options = $scope.$eval($attrs.bbAccordianRangeGroup) || {};
      }
      $scope.start_time = start_time;
      $scope.end_time = end_time;
      return setData();
    };
    setData = function() {
      var i, key, len, ref, ref1, slot;
      $scope.accordian_slots = [];
      $scope.is_open = $scope.is_open || false;
      $scope.has_availability = $scope.has_availability || false;
      $scope.is_selected = $scope.is_selected || false;
      if ($scope.options && $scope.options.slots) {
        $scope.source_slots = $scope.options.slots;
      } else if ($scope.day && $scope.day.slots) {
        $scope.source_slots = $scope.day.slots;
      } else {
        $scope.source_slots = null;
      }
      if ($scope.source_slots) {
        if (angular.isArray($scope.source_slots)) {
          ref = $scope.source_slots;
          for (i = 0, len = ref.length; i < len; i++) {
            slot = ref[i];
            if (slot.time >= $scope.start_time && slot.time < $scope.end_time) {
              $scope.accordian_slots.push(slot);
            }
          }
        } else {
          ref1 = $scope.source_slots;
          for (key in ref1) {
            slot = ref1[key];
            if (slot.time >= $scope.start_time && slot.time < $scope.end_time) {
              $scope.accordian_slots.push(slot);
            }
          }
        }
        return updateAvailability();
      }
    };
    updateAvailability = function(day, slot) {
      var i, len, ref;
      $scope.selected_slot = null;
      if ($scope.accordian_slots) {
        $scope.has_availability = hasAvailability();
      }
      if (day && slot) {
        if (day.date.isSame($scope.day.date) && slot.time >= $scope.start_time && slot.time < $scope.end_time) {
          $scope.selected_slot = slot;
        }
      } else {
        ref = $scope.accordian_slots;
        for (i = 0, len = ref.length; i < len; i++) {
          slot = ref[i];
          if (slot.selected) {
            $scope.selected_slot = slot;
            break;
          }
        }
      }
      if ($scope.selected_slot) {
        $scope.hideHeading = true;
        $scope.is_selected = true;
        if ($scope.collaspe_when_time_selected) {
          return $scope.is_open = false;
        }
      } else {
        $scope.is_selected = false;
        if ($scope.collaspe_when_time_selected) {
          return $scope.is_open = false;
        }
      }
    };
    hasAvailability = function() {
      var i, len, ref, slot;
      if (!$scope.accordian_slots) {
        return false;
      }
      ref = $scope.accordian_slots;
      for (i = 0, len = ref.length; i < len; i++) {
        slot = ref[i];
        if (slot.availability() > 0) {
          return true;
        }
      }
      return false;
    };
    $scope.$on('slotChanged', function(event, day, slot) {
      if (day && slot) {
        return updateAvailability(day, slot);
      } else {
        return updateAvailability();
      }
    });
    return $scope.$on('dataReloaded', function(event, earliest_slot) {
      return setData();
    });
  });

}).call(this);
