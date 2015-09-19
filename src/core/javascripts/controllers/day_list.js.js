(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbMonthAvailability
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbMonthAvailability
  *
  * See Controller {@link BB.Controllers:DayList DayList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'DayList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbMonthAvailability', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: 'DayList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:DayList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller DayList
  *
  * # Has the following set of methods:
  *
  * - $scope.setCalType(type)
  * - $scope.setDataSource(source)
  * - $scope.format_date(fmt)
  * - $scope.format_start_date(fmt)
  * - $scope.format_end_date(fmt)
  * - $scope.selectDay(day, route, force)
  * - $scope.setMonth(month, year)
  * - $scope.setWeek(week, year)
  * - $scope.add(type, amount)
  * - $scope.subtract(type, amount)
  * - $scope.isPast()
  * - $scope.loadData
  * - $scope.loadMonth
  * - $scope.loadWeek
  * - $scope.setReady
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} DayService Info
  * <br>
  * {@link BB.Services:DayService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
   */

  angular.module('BB.Controllers').controller('DayList', function($scope, $rootScope, $q, DayService, AlertService) {
    $scope.controller = "public.controllers.DayList";
    $scope.notLoaded($scope);
    $scope.WeekHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.day_data = {};
    if (!$scope.type) {
      $scope.type = "month";
    }
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if (!$scope.current_date && $scope.last_selected_date) {
          $scope.current_date = $scope.last_selected_date.startOf($scope.type);
        } else if (!$scope.current_date) {
          $scope.current_date = moment().startOf($scope.type);
        }
        return $scope.loadData();
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadData();
    });
    $scope.setCalType = (function(_this) {
      return function(type) {
        return $scope.type = type;
      };
    })(this);
    $scope.setDataSource = (function(_this) {
      return function(source) {
        return $scope.data_source = source;
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        if ($scope.current_date) {
          return $scope.current_date.format(fmt);
        }
      };
    })(this);
    $scope.format_start_date = (function(_this) {
      return function(fmt) {
        return $scope.format_date(fmt);
      };
    })(this);
    $scope.format_end_date = (function(_this) {
      return function(fmt) {
        if ($scope.end_date) {
          return $scope.end_date.format(fmt);
        }
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, route, force) {
        if (day.spaces === 0 && !force) {
          return false;
        }
        $scope.setLastSelectedDate(day.date);
        $scope.bb.current_item.setDate(day);
        if ($scope.$parent.$has_page_control) {

        } else {
          return $scope.decideNextPage(route);
        }
      };
    })(this);
    $scope.setMonth = (function(_this) {
      return function(month, year) {
        $scope.current_date = moment().startOf('month').year(year).month(month - 1);
        $scope.current_date.year();
        return $scope.type = "month";
      };
    })(this);
    $scope.setWeek = (function(_this) {
      return function(week, year) {
        $scope.current_date = moment().year(year).isoWeek(week).startOf('week');
        $scope.current_date.year();
        return $scope.type = "week";
      };
    })(this);
    $scope.add = (function(_this) {
      return function(type, amount) {
        $scope.current_date.add(amount, type);
        return $scope.loadData();
      };
    })(this);
    $scope.subtract = (function(_this) {
      return function(type, amount) {
        return $scope.add(type, -amount);
      };
    })(this);
    $scope.isPast = (function(_this) {
      return function() {
        if (!$scope.current_date) {
          return true;
        }
        return moment().isAfter($scope.current_date);
      };
    })(this);
    $scope.loadData = (function(_this) {
      return function() {
        if ($scope.type === "week") {
          return $scope.loadWeek();
        } else {
          return $scope.loadMonth();
        }
      };
    })(this);
    $scope.loadMonth = (function(_this) {
      return function() {
        var date, edate;
        date = $scope.current_date;
        $scope.month = date.month();
        $scope.notLoaded($scope);
        edate = moment(date).add(1, 'months');
        $scope.end_date = moment(edate).add(-1, 'days');
        if ($scope.data_source) {
          return DayService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            'month': date.format("MMYY"),
            client: $scope.client
          }).then(function(days) {
            var d, day, i, j, k, len, w, week, weeks;
            $scope.days = days;
            for (i = 0, len = days.length; i < len; i++) {
              day = days[i];
              $scope.day_data[day.string_date] = day;
            }
            weeks = [];
            for (w = j = 0; j <= 5; w = ++j) {
              week = [];
              for (d = k = 0; k <= 6; d = ++k) {
                week.push(days[w * 7 + d]);
              }
              weeks.push(week);
            }
            $scope.weeks = weeks;
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    $scope.loadWeek = (function(_this) {
      return function() {
        var date, edate;
        date = $scope.current_date;
        $scope.notLoaded($scope);
        edate = moment(date).add(7, 'days');
        $scope.end_date = moment(edate).add(-1, 'days');
        if ($scope.data_source) {
          return DayService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            date: date.toISODate(),
            edate: edate.toISODate(),
            client: $scope.client
          }).then(function(days) {
            var day, i, len;
            $scope.days = days;
            for (i = 0, len = days.length; i < len; i++) {
              day = days[i];
              $scope.day_data[day.string_date] = day;
            }
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.bb.current_item.date) {
          return true;
        } else {
          AlertService.clear();
          AlertService.add("danger", {
            msg: "You need to select a date"
          });
          return false;
        }
      };
    })(this);
  });

}).call(this);
