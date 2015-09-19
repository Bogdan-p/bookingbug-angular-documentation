(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbTimeRangeStacked
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbTimeRangeStacked
  *
  * See Controller {@link BB.Controllers:TimeRangeListStackedController TimeRangeListStackedController}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'TimeRangeListStackedController'
  * </pre>
  *
   */
  var hasProp = {}.hasOwnProperty;

  angular.module('BB.Directives').directive('bbTimeRangeStacked', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'TimeRangeListStackedController'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:TimeRangeListStackedController
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller TimeRangeListStackedController
  *
  * # Has the following set of methods:
  *
  * - $rootScope.connection_started.then
  * - setTimeRange(selected_date, start_date)
  * - $scope.add(amount, type)
  * - $scope.subtract(amount, type)
  * - isSubtractValid()
  * - $scope.selectedDateChanged()
  * - updateHideStatus() 
  * - $scope.isPast()
  * - $scope.status(day, slot)
  * - $scope.highlightSlot(day, slot)
  * - $scope.loadData
  * - spliceExistingDateTimes(stacked_item, slots)
  * - setEnabledSlots()
  * - isSlotValid(slot)
  * - $scope.pretty_month_title(month_format, year_format, seperator = '-')
  * - $scope.confirm(route)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {function} element Wraps a raw DOM element or HTML string as a jQuery element.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/function/angular.element more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} AdminTimeService Info
  * <br>
  * {@link BBAdmin.Services:AdminTimeService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} PersonService Info
  * <br>
  * {@link BB.Services:PersonService more}
  *
  * @param {service} PurchaseService Info
  * <br>
  * {@link BB.Services:PurchaseService more}
  *
  * @param {service} DateTimeUlititiesService Info
  * <br>
  * {@link BB.Services:DateTimeUlititiesService more}
  *
   */

  angular.module('BB.Controllers').controller('TimeRangeListStackedController', function($scope, $element, $attrs, $rootScope, $q, TimeService, AlertService, BBModel, FormDataStoreService, PersonService, PurchaseService, DateTimeUlititiesService) {
    var isSubtractValid, setEnabledSlots, setTimeRange, spliceExistingDateTimes, updateHideStatus;
    $scope.controller = "public.controllers.TimeRangeListStacked";
    FormDataStoreService.init('TimeRangeListStacked', $scope, ['selected_slot', 'original_start_date', 'start_at_week_start']);
    $scope.notLoaded($scope);
    $scope.available_times = 0;
    $rootScope.connection_started.then(function() {
      var diff, selected_day, start_date;
      $scope.options = $scope.$eval($attrs.bbTimeRangeStacked) || {};
      if (!$scope.time_range_length) {
        if ($attrs.bbTimeRangeLength != null) {
          $scope.time_range_length = $scope.$eval($attrs.bbTimeRangeLength);
        } else if ($scope.options && $scope.options.time_range_length) {
          $scope.time_range_length = $scope.options.time_range_length;
        } else {
          $scope.time_range_length = 7;
        }
      }
      if (($attrs.bbDayOfWeek != null) || ($scope.options && $scope.options.day_of_week)) {
        $scope.day_of_week = $attrs.bbDayOfWeek != null ? $scope.$eval($attrs.bbDayOfWeek) : $scope.options.day_of_week;
      }
      if (($attrs.bbSelectedDay != null) || ($scope.options && $scope.options.selected_day)) {
        selected_day = $attrs.bbSelectedDay != null ? moment($scope.$eval($attrs.bbSelectedDay)) : moment($scope.options.selected_day);
        if (moment.isMoment(selected_day)) {
          $scope.selected_day = selected_day;
        }
      }
      if (!$scope.start_date && $scope.last_selected_date) {
        if ($scope.original_start_date) {
          diff = $scope.last_selected_date.diff($scope.original_start_date, 'days');
          diff = diff % $scope.time_range_length;
          diff = diff === 0 ? diff : diff + 1;
          start_date = $scope.last_selected_date.clone().subtract(diff, 'days');
          setTimeRange($scope.last_selected_date, start_date);
        } else {
          setTimeRange($scope.last_selected_date);
        }
      } else if ($scope.bb.stacked_items[0].date) {
        setTimeRange($scope.bb.stacked_items[0].date.date);
      } else if ($scope.selected_day) {
        $scope.original_start_date = $scope.original_start_date || moment($scope.selected_day);
        setTimeRange($scope.selected_day);
      } else {
        $scope.start_at_week_start = true;
        setTimeRange(moment());
      }
      return $scope.loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    setTimeRange = function(selected_date, start_date) {
      if (start_date) {
        $scope.start_date = start_date;
      } else if ($scope.day_of_week) {
        $scope.start_date = selected_date.clone().day($scope.day_of_week);
      } else if ($scope.start_at_week_start) {
        $scope.start_date = selected_date.clone().startOf('week');
      } else {
        $scope.start_date = selected_date.clone();
      }
      $scope.selected_day = selected_date;
      $scope.selected_date = $scope.selected_day.toDate();
      return isSubtractValid();
    };
    $scope.add = function(amount, type) {
      $scope.selected_day = moment($scope.selected_date);
      switch (type) {
        case 'days':
          setTimeRange($scope.selected_day.add(amount, 'days'));
          break;
        case 'weeks':
          $scope.start_date.add(amount, 'weeks');
          setTimeRange($scope.start_date);
      }
      return $scope.loadData();
    };
    $scope.subtract = function(amount, type) {
      return $scope.add(-amount, type);
    };
    isSubtractValid = function() {
      var diff;
      $scope.is_subtract_valid = true;
      diff = Math.ceil($scope.selected_day.diff(moment(), 'day', true));
      $scope.subtract_length = diff < $scope.time_range_length ? diff : $scope.time_range_length;
      if (diff <= 0) {
        $scope.is_subtract_valid = false;
      }
      if ($scope.subtract_length > 1) {
        return $scope.subtract_string = "Prev " + $scope.subtract_length + " days";
      } else if ($scope.subtract_length === 1) {
        return $scope.subtract_string = "Prev day";
      } else {
        return $scope.subtract_string = "Prev";
      }
    };
    $scope.selectedDateChanged = function() {
      setTimeRange(moment($scope.selected_date));
      $scope.selected_slot = null;
      return $scope.loadData();
    };
    updateHideStatus = function() {
      var day, key, ref, results;
      ref = $scope.days;
      results = [];
      for (key in ref) {
        day = ref[key];
        results.push($scope.days[key].hide = !day.date.isSame($scope.selected_day, 'day'));
      }
      return results;
    };
    $scope.isPast = function() {
      if (!$scope.start_date) {
        return true;
      }
      return moment().isAfter($scope.start_date);
    };
    $scope.status = function(day, slot) {
      var status;
      if (!slot) {
        return;
      }
      status = slot.status();
      return status;
    };
    $scope.highlightSlot = function(day, slot) {
      var i, item, len, ref;
      if (day && slot && slot.availability() > 0) {
        $scope.bb.clearStackedItemsDateTime();
        if ($scope.selected_slot) {
          $scope.selected_slot.selected = false;
        }
        $scope.setLastSelectedDate(day.date);
        $scope.selected_slot = angular.copy(slot);
        $scope.selected_day = day.date;
        $scope.selected_date = day.date.toDate();
        $scope.$broadcast('slotChanged', day, slot);
        while (slot) {
          ref = $scope.bb.stacked_items;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            if (item.service.self === slot.service.self && !item.date && !item.time) {
              item.setDate(day);
              item.setTime(slot);
              slot = slot.next;
              break;
            }
          }
        }
        updateHideStatus();
        return $rootScope.$broadcast("time:selected");
      }
    };
    $scope.loadData = function() {
      var edate, grouped_items, i, items, len, pslots;
      $scope.notLoaded($scope);
      if ($scope.request && $scope.request.start.twix($scope.request.end).contains($scope.selected_day)) {
        updateHideStatus();
        $scope.setLoaded($scope);
        return;
      }
      $scope.start_date = moment($scope.start_date);
      edate = moment($scope.start_date).add($scope.time_range_length, 'days');
      $scope.end_date = moment(edate).add(-1, 'days');
      $scope.request = {
        start: moment($scope.start_date),
        end: moment($scope.end_date)
      };
      pslots = [];
      grouped_items = _.groupBy($scope.bb.stacked_items, function(item) {
        return item.service.id;
      });
      grouped_items = _.toArray(grouped_items);
      for (i = 0, len = grouped_items.length; i < len; i++) {
        items = grouped_items[i];
        pslots.push(TimeService.query({
          company: $scope.bb.company,
          cItem: items[0],
          date: $scope.start_date,
          end_date: $scope.end_date,
          client: $scope.client,
          available: 1
        }));
      }
      return $q.all(pslots).then(function(res) {
        var _i, day, item, j, k, l, len1, len2, ref, slots, times, v;
        $scope.data_valid = true;
        $scope.days = {};
        for (_i = j = 0, len1 = grouped_items.length; j < len1; _i = ++j) {
          items = grouped_items[_i];
          slots = res[_i];
          if (!slots || slots.length === 0) {
            $scope.data_valid = false;
          }
          for (l = 0, len2 = items.length; l < len2; l++) {
            item = items[l];
            spliceExistingDateTimes(item, slots);
            item.slots = {};
            for (day in slots) {
              if (!hasProp.call(slots, day)) continue;
              times = slots[day];
              item.slots[day] = _.indexBy(times, 'time');
            }
          }
        }
        if ($scope.data_valid) {
          ref = res[0];
          for (k in ref) {
            v = ref[k];
            $scope.days[k] = {
              date: moment(k)
            };
          }
          setEnabledSlots();
          updateHideStatus();
          $rootScope.$broadcast("TimeRangeListStacked:loadFinished");
        } else {

        }
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    spliceExistingDateTimes = function(stacked_item, slots) {
      var datetime, time, time_slot;
      if (!stacked_item.datetime && !stacked_item.date) {
        return;
      }
      datetime = stacked_item.datetime || DateTimeUlititiesService.convertTimeSlotToMoment(stacked_item.date, stacked_item.time);
      if ($scope.start_date <= datetime && $scope.end_date >= datetime) {
        time = DateTimeUlititiesService.convertMomentToTime(datetime);
        time_slot = _.findWhere(slots[datetime.toISODate()], {
          time: time
        });
        if (!time_slot) {
          time_slot = stacked_item.time;
          slots[datetime.toISODate()].splice(0, 0, time_slot);
        }
        return time_slot.selected = stacked_item.self === $scope.bb.stacked_items[0].self;
      }
    };
    setEnabledSlots = function() {
      var day, day_data, isSlotValid, ref, results, slot, time;
      ref = $scope.days;
      results = [];
      for (day in ref) {
        day_data = ref[day];
        day_data.slots = {};
        if ($scope.bb.stacked_items.length > 1) {
          results.push((function() {
            var ref1, results1;
            ref1 = $scope.bb.stacked_items[0].slots[day];
            results1 = [];
            for (time in ref1) {
              slot = ref1[time];
              slot = angular.copy(slot);
              isSlotValid = function(slot) {
                var duration, i, index, next, ref2, valid;
                valid = false;
                time = slot.time;
                duration = $scope.bb.stacked_items[0].service.duration;
                next = time + duration;
                for (index = i = 1, ref2 = $scope.bb.stacked_items.length - 1; 1 <= ref2 ? i <= ref2 : i >= ref2; index = 1 <= ref2 ? ++i : --i) {
                  if (!_.isEmpty($scope.bb.stacked_items[index].slots[day]) && $scope.bb.stacked_items[index].slots[day][next]) {
                    slot.next = angular.copy($scope.bb.stacked_items[index].slots[day][next]);
                    slot = slot.next;
                    next = next + $scope.bb.stacked_items[index].service.duration;
                  } else {
                    return false;
                  }
                }
                return true;
              };
              if (isSlotValid(slot)) {
                results1.push(day_data.slots[slot.time] = slot);
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        } else {
          results.push((function() {
            var ref1, results1;
            ref1 = $scope.bb.stacked_items[0].slots[day];
            results1 = [];
            for (time in ref1) {
              slot = ref1[time];
              results1.push(day_data.slots[slot.time] = slot);
            }
            return results1;
          })());
        }
      }
      return results;
    };
    $scope.pretty_month_title = function(month_format, year_format, seperator) {
      var month_year_format, start_date;
      if (seperator == null) {
        seperator = '-';
      }
      if (!$scope.start_date) {
        return;
      }
      month_year_format = month_format + ' ' + year_format;
      if ($scope.start_date && $scope.end_date && $scope.end_date.isAfter($scope.start_date, 'month')) {
        start_date = $scope.start_date.format(month_format);
        if ($scope.start_date.month() === 11) {
          start_date = $scope.start_date.format(month_year_format);
        }
        return start_date + ' ' + seperator + ' ' + $scope.end_date.format(month_year_format);
      } else {
        return $scope.start_date.format(month_year_format);
      }
    };
    return $scope.confirm = function(route) {
      var booking, different, found, i, item, j, l, len, len1, len2, len3, m, prom, ref, ref1, ref2, ref3;
      ref = $scope.bb.stacked_items;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (!item.time) {
          AlertService.add("danger", {
            msg: "Select a time to continue your booking"
          });
          return false;
        }
      }
      if (($scope.bb.moving_booking != null) && ($scope.bb.moving_booking.bookings != null)) {
        different = false;
        ref1 = $scope.bb.moving_booking.bookings;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          booking = ref1[j];
          found = false;
          ref2 = $scope.bb.stacked_items;
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            item = ref2[l];
            if (booking.getDateString() === item.date.string_date && booking.getTimeInMins() === item.time.time && booking.category_name === item.category_name) {
              found = true;
            }
          }
          if (!found) {
            different = true;
            break;
          }
        }
        if (!different) {
          AlertService.add("danger", {
            msg: "Your treatments are already booked for this time."
          });
          return false;
        }
      }
      $scope.bb.basket.clear();
      ref3 = $scope.bb.stacked_items;
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        item = ref3[m];
        $scope.bb.basket.addItem(item);
      }
      if ($scope.bb.moving_booking) {
        $scope.notLoaded($scope);
        prom = PurchaseService.update({
          purchase: $scope.bb.moving_booking,
          bookings: $scope.bb.basket.items
        });
        prom.then(function(purchase) {
          purchase.getBookingsPromise().then(function(bookings) {
            var _i, len4, n, oldb, results;
            results = [];
            for (n = 0, len4 = bookings.length; n < len4; n++) {
              booking = bookings[n];
              if ($scope.bookings) {
                results.push((function() {
                  var len5, o, ref4, results1;
                  ref4 = $scope.bookings;
                  results1 = [];
                  for (_i = o = 0, len5 = ref4.length; o < len5; _i = ++o) {
                    oldb = ref4[_i];
                    if (oldb.id === booking.id) {
                      results1.push($scope.bookings[_i] = booking);
                    } else {
                      results1.push(void 0);
                    }
                  }
                  return results1;
                })());
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
          $scope.setLoaded($scope);
          $scope.bb.current_item.move_done = true;
          return $scope.decideNextPage();
        }, function(err) {
          $scope.setLoaded($scope);
          return AlertService.add("danger", {
            msg: "Failed to move booking"
          });
        });
        return;
      }
      $scope.notLoaded($scope);
      return $scope.updateBasket().then(function() {
        $scope.setLoaded($scope);
        return $scope.decideNextPage(route);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
  });

}).call(this);
