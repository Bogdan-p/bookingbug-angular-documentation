(function() {
  'use strict';

  /***
  * @ndgoc directive
  * @name BB.Directives:bbTimes
  *
  * @restrict AE
  * @scope true
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbTimes
  *
  * # Has the following set of methods:
  *
   */
  angular.module('BB.Directives').directive('bbTimes', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'TimeList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:TimeList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller TimeList
  *
  * # Has the following set of methods:
  *
  * - $scope.setDate(date)
  * - $scope.setDay(dayItem)
  * - $scope.setDataSource(source)
  * - $scope.setItemLinkSource(source)
  * - $scope.$on 'dateChanged', (event, newdate)
  * - $scope.$on "currentItemUpdate", (event)
  * - $scope.format_date(fmt)
  * - $scope.selectSlot(slot, route)
  * - $scope.highlightSlot(slot)
  * - $scope.status(slot)
  * - $scope.add(type, amount)
  * - $scope.subtract(type, amount)
  * - $scope.loadDay()
  * - $scope.padTimes(times)
  * - $scope.setReady()
  *
  * @requires $attrs
  * @requires $element
  * @requires $scope
  * @requires $rootScope
  * @requires $q
  * @requires BB.Services:TimeService
  * @requires BB.Services:AlertService
  * @requires BB.Models:BBModel
  *
   */

  angular.module('BB.Controllers').controller('TimeList', function($attrs, $element, $scope, $rootScope, $q, TimeService, AlertService, BBModel) {
    $scope.controller = "public.controllers.TimeList";
    $scope.notLoaded($scope);
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $scope.options = $scope.$eval($attrs.bbTimes) || {};
    $rootScope.connection_started.then((function(_this) {
      return function() {
        return $scope.loadDay();
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.setDate = (function(_this) {
      return function(date) {
        var day;
        day = new BBModel.Day({
          date: date,
          spaces: 1
        });
        return $scope.setDay(day);
      };
    })(this);
    $scope.setDay = (function(_this) {
      return function(dayItem) {
        $scope.selected_day = dayItem;
        return $scope.selected_date = dayItem.date;
      };
    })(this);
    $scope.setDataSource = (function(_this) {
      return function(source) {
        return $scope.data_source = source;
      };
    })(this);
    $scope.setItemLinkSource = (function(_this) {
      return function(source) {
        return $scope.item_link_source = source;
      };
    })(this);
    $scope.$on('dateChanged', (function(_this) {
      return function(event, newdate) {
        $scope.setDate(newdate);
        return $scope.loadDay();
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadDay();
    });
    $scope.format_date = (function(_this) {
      return function(fmt) {
        if ($scope.data_source.date) {
          return $scope.data_source.date.date.format(fmt);
        }
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        if (slot && slot.availability() > 0) {
          if ($scope.item_link_source) {
            $scope.data_source.setItem($scope.item_link_source);
          }
          if ($scope.selected_day) {
            $scope.setLastSelectedDate($scope.selected_day.date);
            $scope.data_source.setDate($scope.selected_day);
          }
          $scope.data_source.setTime(slot);
          if ($scope.$parent.$has_page_control) {

          } else {
            if ($scope.data_source.ready) {
              return $scope.addItemToBasket().then(function() {
                return $scope.decideNextPage(route);
              });
            } else {
              return $scope.decideNextPage(route);
            }
          }
        }
      };
    })(this);
    $scope.highlightSlot = (function(_this) {
      return function(slot) {
        if (slot && slot.availability() > 0) {
          if ($scope.selected_day) {
            $scope.setLastSelectedDate($scope.selected_day.date);
            $scope.data_source.setDate($scope.selected_day);
          }
          $scope.data_source.setTime(slot);
          return $scope.$broadcast('slotChanged');
        }
      };
    })(this);
    $scope.status = function(slot) {
      var status;
      if (!slot) {
        return;
      }
      status = slot.status();
      return status;
    };
    $scope.add = (function(_this) {
      return function(type, amount) {
        var newdate;
        newdate = moment($scope.data_source.date.date).add(amount, type);
        $scope.data_source.setDate(new BBModel.Day({
          date: newdate.format(),
          spaces: 0
        }));
        $scope.setLastSelectedDate(newdate);
        $scope.loadDay();
        return $scope.$broadcast('dateChanged', newdate);
      };
    })(this);
    $scope.subtract = (function(_this) {
      return function(type, amount) {
        return $scope.add(type, -amount);
      };
    })(this);
    $scope.loadDay = (function(_this) {
      return function() {
        var pslots;
        if ($scope.data_source && $scope.data_source.days_link || $scope.item_link_source) {
          if (!$scope.selected_date && $scope.data_source && $scope.data_source.date) {
            $scope.selected_date = $scope.data_source.date.date;
          }
          if (!$scope.selected_date) {
            $scope.setLoaded($scope);
            return;
          }
          $scope.notLoaded($scope);
          pslots = TimeService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            item_link: $scope.item_link_source,
            date: $scope.selected_date,
            client: $scope.client,
            available: 1
          });
          pslots["finally"](function() {
            return $scope.setLoaded($scope);
          });
          return pslots.then(function(data) {
            var dtimes, found_time, i, j, k, len, len1, len2, pad, ref, s, t, v;
            $scope.slots = data;
            $scope.$broadcast('slotsUpdated');
            if ($scope.add_padding && data.length > 0) {
              dtimes = {};
              for (i = 0, len = data.length; i < len; i++) {
                s = data[i];
                dtimes[s.time] = 1;
              }
              ref = $scope.add_padding;
              for (v = j = 0, len1 = ref.length; j < len1; v = ++j) {
                pad = ref[v];
                if (!dtimes[pad]) {
                  data.splice(v, 0, new BBModel.TimeSlot({
                    time: pad,
                    avail: 0
                  }, data[0].service));
                }
              }
            }
            if (($scope.data_source.requested_time || $scope.data_source.time) && $scope.selected_date.isSame($scope.data_source.date.date)) {
              found_time = false;
              for (k = 0, len2 = data.length; k < len2; k++) {
                t = data[k];
                if (t.time === $scope.data_source.requested_time) {
                  $scope.data_source.requestedTimeUnavailable();
                  $scope.selectSlot(t);
                  found_time = true;
                }
                if ($scope.data_source.time && t.time === $scope.data_source.time.time) {
                  $scope.data_source.setTime(t);
                  found_time = true;
                }
              }
              if (!found_time) {
                if (!$scope.options.persist_requested_time) {
                  $scope.data_source.requestedTimeUnavailable();
                }
                $scope.time_not_found = true;
                return AlertService.add("danger", {
                  msg: "Sorry, your requested time slot is not available. Please choose a different time."
                });
              }
            }
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    $scope.padTimes = (function(_this) {
      return function(times) {
        return $scope.add_padding = times;
      };
    })(this);
    return $scope.setReady = (function(_this) {
      return function() {
        if (!$scope.data_source.time) {
          AlertService.clear();
          AlertService.add("danger", {
            msg: "You need to select a time slot"
          });
          return false;
        } else {
          if ($scope.data_source.ready) {
            return $scope.addItemToBasket();
          } else {
            return true;
          }
        }
      };
    })(this);
  });


  /***
  * @ndgoc directive
  * @name BB.Directives:bbAccordianGroup
  *
  * @restrict AE
  * @scope true
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbAccordianGroup
  *
  * # Has the following set of methods:
  *
   */

  angular.module('BB.Directives').directive('bbAccordianGroup', function() {
    return {
      restrict: 'AE',
      scope: true,
      controller: 'AccordianGroup'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:AccordianGroup
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller AccordianGroup
  *
  * # Has the following set of methods:
  *
  * - $scope.init(start_time, end_time, options)
  * - updateAvailability()
  * - hasAvailability()
  * - $scope.$on 'slotChanged', (event)
  * - $scope.$on 'slotsUpdated', (event)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires $q
  *
   */

  angular.module('BB.Controllers').controller('AccordianGroup', function($scope, $rootScope, $q) {
    var hasAvailability, updateAvailability;
    $scope.accordian_slots = [];
    $scope.is_open = false;
    $scope.has_availability = false;
    $scope.is_selected = false;
    $scope.collaspe_when_time_selected = true;
    $scope.start_time = 0;
    $scope.end_time = 0;
    $scope.init = (function(_this) {
      return function(start_time, end_time, options) {
        var i, len, ref, slot;
        $scope.start_time = start_time;
        $scope.end_time = end_time;
        $scope.collaspe_when_time_selected = options && !options.collaspe_when_time_selected ? false : true;
        ref = $scope.slots;
        for (i = 0, len = ref.length; i < len; i++) {
          slot = ref[i];
          if (slot.time >= start_time && slot.time < end_time) {
            $scope.accordian_slots.push(slot);
          }
        }
        return updateAvailability();
      };
    })(this);
    updateAvailability = (function(_this) {
      return function() {
        var item;
        $scope.has_availability = false;
        if ($scope.accordian_slots) {
          $scope.has_availability = hasAvailability();
          item = $scope.data_source;
          if (item.time && item.time.time >= $scope.start_time && item.time.time < $scope.end_time && (item.date && item.date.date.isSame($scope.selected_day.date, 'day'))) {
            $scope.is_selected = true;
            if (!$scope.collaspe_when_time_selected) {
              return $scope.is_open = true;
            }
          } else {
            $scope.is_selected = false;
            return $scope.is_open = false;
          }
        }
      };
    })(this);
    hasAvailability = (function(_this) {
      return function() {
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
    })(this);
    $scope.$on('slotChanged', (function(_this) {
      return function(event) {
        return updateAvailability();
      };
    })(this));
    return $scope.$on('slotsUpdated', (function(_this) {
      return function(event) {
        var i, len, ref, slot;
        $scope.accordian_slots = [];
        ref = $scope.slots;
        for (i = 0, len = ref.length; i < len; i++) {
          slot = ref[i];
          if (slot.time >= $scope.start_time && slot.time < $scope.end_time) {
            $scope.accordian_slots.push(slot);
          }
        }
        return updateAvailability();
      };
    })(this));
  });

}).call(this);
