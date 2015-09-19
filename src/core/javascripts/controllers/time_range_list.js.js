(function() {
  'use strict';

  /***
  * @ndgoc directive
  * @name BB.Directives:bbTimeRanges
  *
  * @restrict AE
  * @scope true
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbTimeRanges
  *
  * # Has the following set of methods:
  *
   */
  angular.module('BB.Directives').directive('bbTimeRanges', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      priority: 1,
      controller: 'TimeRangeList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:TimeRangeList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller TimeRangeList
  *
  * # Has the following set of methods:
  *
  * - setTimeRange(selected_date, start_date)
  * - $scope.init(options = {})
  * - $scope.moment(date)
  * - $scope.setDataSource(source)
  * - $scope.add(type, amount)
  * - $scope.subtract(type, amount)
  * - $scope.isSubtractValid(type, amount)
  * - $scope.selectedDateChanged()
  * - $scope.updateHideStatus()
  * - $scope.isPast()
  * - $scope.status(day, slot)
  * - $scope.selectSlot(day, slot, route)
  * - $scope.highlightSlot(day, slot)
  * - $scope.loadData
  * - checkRequestedTime(day, time_slots)
  * - $scope.padTimes(times)
  * - $scope.setReady()
  * - $scope.format_date(fmt)
  * - $scope.format_start_date(fmt)
  * - $scope.format_end_date(fmt)
  * - $scope.pretty_month_title(month_format, year_format, seperator = '-')
  * -  $scope.selectEarliestTimeSlot()
  *
  * @requires $scope
  * @requires $element
  * @requires $attrs
  * @requires $rootScope
  * @requires $q
  * @requires BB.Services:TimeService
  * @requires BB.Services:AlertService
  * @requires BB.Models:BBModel
  * @requires BB.Services:FormDataStoreService
  *
   */

  angular.module('BB.Controllers').controller('TimeRangeList', function($scope, $element, $attrs, $rootScope, $q, TimeService, AlertService, BBModel, FormDataStoreService) {
    var checkRequestedTime, currentPostcode, isSubtractValid, setTimeRange;
    $scope.controller = "public.controllers.TimeRangeList";
    currentPostcode = $scope.bb.postcode;
    FormDataStoreService.init('TimeRangeList', $scope, ['selected_slot', 'postcode', 'original_start_date', 'start_at_week_start']);
    if (currentPostcode !== $scope.postcode) {
      $scope.selected_slot = null;
      $scope.selected_date = null;
    }
    $scope.postcode = $scope.bb.postcode;
    $scope.notLoaded($scope);
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $rootScope.connection_started.then(function() {
      var diff, selected_day, start_date;
      $scope.options = $scope.$eval($attrs.bbTimeRanges) || {};
      if ($attrs.bbTimeRangeLength != null) {
        $scope.time_range_length = $scope.$eval($attrs.bbTimeRangeLength);
      } else if ($scope.options && $scope.options.time_range_length) {
        $scope.time_range_length = $scope.options.time_range_length;
      } else {
        $scope.time_range_length = 7;
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
      $scope.options.ignore_min_advance_datetime = $scope.options.ignore_min_advance_datetime ? true : false;
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
      } else if ($scope.bb.current_item.date) {
        setTimeRange($scope.bb.current_item.date.date);
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
      isSubtractValid();
    };
    $scope.init = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.selected_day != null) {
        if (!options.selected_day._isAMomementObject) {
          return $scope.selected_day = moment(options.selected_day);
        }
      }
    };
    $scope.moment = function(date) {
      return moment(date);
    };
    $scope.setDataSource = function(source) {
      return $scope.data_source = source;
    };
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadData();
    });
    $scope.add = function(type, amount) {
      if (amount > 0) {
        $element.removeClass('subtract');
        $element.addClass('add');
      }
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
    $scope.subtract = function(type, amount) {
      $element.removeClass('add');
      $element.addClass('subtract');
      return $scope.add(type, -amount);
    };
    $scope.isSubtractValid = function(type, amount) {
      var date;
      if (!$scope.start_date) {
        return true;
      }
      date = $scope.start_date.clone().subtract(amount, type);
      return !date.isBefore(moment(), 'day');
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
    $scope.updateHideStatus = function() {
      var day, i, len, ref, results;
      ref = $scope.days;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        day = ref[i];
        results.push(day.hide = !day.date.isSame($scope.selected_day, 'day'));
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
    $scope.selectSlot = function(day, slot, route) {
      if (slot && slot.availability() > 0) {
        $scope.bb.current_item.setTime(slot);
        if (day) {
          $scope.setLastSelectedDate(day.date);
          $scope.bb.current_item.setDate(day);
        }
        if ($scope.bb.current_item.reserve_ready) {
          $scope.notLoaded($scope);
          return $scope.addItemToBasket().then(function() {
            $scope.setLoaded($scope);
            return $scope.decideNextPage(route);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.decideNextPage(route);
        }
      }
    };
    $scope.highlightSlot = function(day, slot) {
      var current_item;
      current_item = $scope.bb.current_item;
      if (slot && slot.availability() > 0) {
        if (day) {
          $scope.setLastSelectedDate(day.date);
          current_item.setDate(day);
        }
        current_item.setTime(slot);
        current_item.setDate(day);
        $scope.selected_slot = slot;
        $scope.selected_day = day.date;
        $scope.selected_date = day.date.toDate();
        if ($scope.bb.current_item.earliest_time_slot && $scope.bb.current_item.earliest_time_slot.selected && (!$scope.bb.current_item.earliest_time_slot.date.isSame(day.date, 'day') || $scope.bb.current_item.earliest_time_slot.time !== slot.time)) {
          $scope.bb.current_item.earliest_time_slot.selected = false;
        }
        $scope.updateHideStatus();
        $rootScope.$broadcast("time:selected");
        return $scope.$broadcast('slotChanged', day, slot);
      }
    };
    $scope.loadData = function() {
      var current_item, date, duration, edate, loc, promise;
      current_item = $scope.bb.current_item;
      if (current_item.service && !$scope.options.ignore_min_advance_datetime) {
        $scope.min_date = current_item.service.min_advance_datetime;
        $scope.max_date = current_item.service.max_advance_datetime;
        if ($scope.selected_day && $scope.selected_day.isBefore(current_item.service.min_advance_datetime, 'day')) {
          setTimeRange(current_item.service.min_advance_datetime);
        }
      }
      date = $scope.start_date;
      edate = moment(date).add($scope.time_range_length, 'days');
      $scope.end_date = moment(edate).add(-1, 'days');
      AlertService.clear();
      duration = $scope.bb.current_item.duration;
      if ($scope.bb.current_item.min_duration) {
        duration = $scope.bb.current_item.min_duration;
      }
      loc = null;
      if ($scope.bb.postcode) {
        loc = ",,,," + $scope.bb.postcode + ",";
      }
      if ($scope.data_source && $scope.data_source.days_link) {
        $scope.notLoaded($scope);
        loc = null;
        if ($scope.bb.postcode) {
          loc = ",,,," + $scope.bb.postcode + ",";
        }
        promise = TimeService.query({
          company: $scope.bb.company,
          cItem: $scope.data_source,
          date: date,
          client: $scope.client,
          end_date: $scope.end_date,
          duration: duration,
          location: loc,
          num_resources: $scope.bb.current_item.num_resources,
          available: 1
        });
        promise["finally"](function() {
          return $scope.setLoaded($scope);
        });
        return promise.then(function(datetime_arr) {
          var d, day, dtimes, i, j, k, len, len1, len2, pad, pair, ref, ref1, slot, time_slots, v;
          $scope.days = [];
          ref = _.sortBy(_.pairs(datetime_arr), function(pair) {
            return pair[0];
          });
          for (i = 0, len = ref.length; i < len; i++) {
            pair = ref[i];
            d = pair[0];
            time_slots = pair[1];
            day = {
              date: moment(d),
              slots: time_slots
            };
            $scope.days.push(day);
            if (time_slots.length > 0) {
              if (!current_item.earliest_time || current_item.earliest_time.isAfter(d)) {
                current_item.earliest_time = moment(d).add(time_slots[0].time, 'minutes');
              }
              if (!current_item.earliest_time_slot || current_item.earliest_time_slot.date.isAfter(d)) {
                current_item.earliest_time_slot = {
                  date: moment(d).add(time_slots[0].time, 'minutes'),
                  time: time_slots[0].time
                };
              }
            }
            if ($scope.add_padding && time_slots.length > 0) {
              dtimes = {};
              for (j = 0, len1 = time_slots.length; j < len1; j++) {
                slot = time_slots[j];
                dtimes[slot.time] = 1;
                slot.date = day.date.format('DD-MM-YY');
              }
              ref1 = $scope.add_padding;
              for (v = k = 0, len2 = ref1.length; k < len2; v = ++k) {
                pad = ref1[v];
                if (!dtimes[pad]) {
                  time_slots.splice(v, 0, new BBModel.TimeSlot({
                    time: pad,
                    avail: 0
                  }, time_slots[0].service));
                }
              }
            }
            checkRequestedTime(day, time_slots);
          }
          return $scope.updateHideStatus();
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      } else {
        return $scope.setLoaded($scope);
      }
    };
    checkRequestedTime = function(day, time_slots) {
      var current_item, found_time, i, len, slot;
      current_item = $scope.bb.current_item;
      if ((current_item.requested_time || current_item.time) && current_item.requested_date && day.date.isSame(current_item.requested_date)) {
        found_time = false;
        for (i = 0, len = time_slots.length; i < len; i++) {
          slot = time_slots[i];
          if (slot.time === current_item.requested_time) {
            current_item.requestedTimeUnavailable();
            $scope.selectSlot(day, slot);
            found_time = true;
            $scope.days = [];
            return;
          }
          if (current_item.time && current_item.time.time === slot.time && slot.avail === 1) {
            if ($scope.selected_slot && $scope.selected_slot.time !== current_item.time.time) {
              $scope.selected_slot = current_item.time;
            }
            current_item.setTime(slot);
            found_time = true;
          }
        }
        if (!found_time) {
          current_item.requestedTimeUnavailable();
          return AlertService.add("danger", {
            msg: "The requested time slot is not available. Please choose a different time."
          });
        }
      }
    };
    $scope.padTimes = function(times) {
      return $scope.add_padding = times;
    };
    $scope.setReady = function() {
      if (!$scope.bb.current_item.time) {
        AlertService.add("danger", {
          msg: "You need to select a time slot"
        });
        return false;
      } else if ($scope.bb.moving_booking && $scope.bb.current_item.start_datetime().isSame($scope.bb.current_item.original_datetime)) {
        AlertService.add("danger", {
          msg: "Your appointment is already booked for this time."
        });
        return false;
      } else if ($scope.bb.moving_booking) {
        if ($scope.bb.company.$has('resources') && !$scope.bb.current_item.resource) {
          $scope.bb.current_item.resource = true;
        }
        if ($scope.bb.company.$has('people') && !$scope.bb.current_item.person) {
          $scope.bb.current_item.person = true;
        }
        return true;
      } else {
        if ($scope.bb.current_item.reserve_ready) {
          return $scope.addItemToBasket();
        } else {
          return true;
        }
      }
    };
    $scope.format_date = function(fmt) {
      if ($scope.start_date) {
        return $scope.start_date.format(fmt);
      }
    };
    $scope.format_start_date = function(fmt) {
      return $scope.format_date(fmt);
    };
    $scope.format_end_date = function(fmt) {
      if ($scope.end_date) {
        return $scope.end_date.format(fmt);
      }
    };
    $scope.pretty_month_title = function(month_format, year_format, seperator) {
      var month_year_format, start_date;
      if (seperator == null) {
        seperator = '-';
      }
      month_year_format = month_format + ' ' + year_format;
      if ($scope.start_date && $scope.end_date && $scope.end_date.isAfter($scope.start_date, 'month')) {
        start_date = $scope.format_start_date(month_format);
        if ($scope.start_date.month() === 11) {
          start_date = $scope.format_start_date(month_year_format);
        }
        return start_date + ' ' + seperator + ' ' + $scope.format_end_date(month_year_format);
      } else {
        return $scope.format_start_date(month_year_format);
      }
    };
    return $scope.selectEarliestTimeSlot = function() {
      var day, slot;
      day = _.find($scope.days, function(day) {
        return day.date.isSame($scope.bb.current_item.earliest_time_slot.date, 'day');
      });
      slot = _.find(day.slots, function(slot) {
        return slot.time === $scope.bb.current_item.earliest_time_slot.time;
      });
      if (day && slot) {
        $scope.bb.current_item.earliest_time_slot.selected = true;
        return $scope.highlightSlot(day, slot);
      }
    };
  });

}).call(this);
