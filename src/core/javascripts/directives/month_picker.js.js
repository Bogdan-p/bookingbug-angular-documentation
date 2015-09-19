
/***
* @ngdoc directive
* @name BB.Directives:bbMonthPicker
* @restrict AE
* @scope true
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:bbMonthPicker
*
* <pre>
* restrict: 'AE'
* replace: true
* scope : true
* require : '^bbEvents'
* </pre>
*
* Has the following set of methods:
* - link : (scope, el, attrs)
* - controller : ($scope)
*
 */

(function() {
  angular.module('BB.Directives').directive('bbMonthPicker', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      require: '^bbEvents',
      link: function(scope, el, attrs) {
        scope.picker_settings = scope.$eval(attrs.bbMonthPicker) || {};
        scope.watch_val = attrs.dayData;
        return scope.$watch(scope.watch_val, function(newval, oldval) {
          if (newval) {
            return scope.processDates(newval);
          }
        });
      },
      controller: function($scope) {
        $scope.processDates = function(dates) {
          var cur_month, d, date, datehash, day_data, diff, i, j, k, l, last_date, len, m, month, months, ref, w, week;
          datehash = {};
          for (i = 0, len = dates.length; i < len; i++) {
            date = dates[i];
            datehash[date.date.format("DDMMYY")] = date;
            if (!$scope.first_available_day && date.spaces > 0) {
              $scope.first_available_day = date.date;
            }
          }
          if ($scope.picker_settings.start_at_first_available_day) {
            cur_month = $scope.first_available_day.clone().startOf('month');
          } else {
            cur_month = moment().startOf('month');
          }
          date = cur_month.startOf('week');
          last_date = _.last(dates);
          diff = last_date.date.diff(date, 'months');
          diff = diff > 0 ? diff : 1;
          $scope.num_months = $scope.picker_settings && $scope.picker_settings.months ? $scope.picker_settings.months : diff;
          months = [];
          for (m = j = 1, ref = $scope.num_months; 1 <= ref ? j <= ref : j >= ref; m = 1 <= ref ? ++j : --j) {
            date = cur_month.clone().startOf('week');
            month = {
              weeks: []
            };
            for (w = k = 1; k <= 6; w = ++k) {
              week = {
                days: []
              };
              for (d = l = 1; l <= 7; d = ++l) {
                if (date.isSame(date.clone().startOf('month'), 'day') && !month.start_date) {
                  month.start_date = date.clone();
                }
                day_data = datehash[date.format("DDMMYY")];
                week.days.push({
                  date: date.clone(),
                  data: day_data,
                  available: day_data && day_data.spaces && day_data.spaces > 0,
                  today: moment().isSame(date, 'day'),
                  past: date.isBefore(moment(), 'day'),
                  disabled: !month.start_date || !date.isSame(month.start_date, 'month')
                });
                date.add(1, 'day');
              }
              month.weeks.push(week);
            }
            months.push(month);
            cur_month.add(1, 'month');
          }
          $scope.months = months;
          if ($scope.selected_date != null) {
            $scope.selectMonthNumber($scope.selected_date.month());
          }
          return $scope.selected_month = $scope.selected_month || $scope.months[0];
        };
        $scope.selectMonth = function(month) {
          var day, i, j, len, len1, ref, ref1, week;
          $scope.selected_month = month;
          if ($scope.mode === 0) {
            ref = month.weeks;
            for (i = 0, len = ref.length; i < len; i++) {
              week = ref[i];
              ref1 = week.days;
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                day = ref1[j];
                if ((day.data && day.data.spaces > 0) && (day.date.isSame(month.start_date, 'day') || day.date.isAfter(month.start_date, 'day'))) {
                  $scope.showDay(day);
                  return;
                }
              }
            }
          }
        };
        $scope.selectMonthNumber = function(month) {
          var i, len, m, ref;
          if ($scope.selected_month && $scope.selected_month.start_date.month() === month) {
            return;
          }
          $scope.notLoaded($scope);
          ref = $scope.months;
          for (i = 0, len = ref.length; i < len; i++) {
            m = ref[i];
            if (m.start_date.month() === month) {
              $scope.selectMonth(m);
            }
          }
          $scope.setLoaded($scope);
          return true;
        };
        $scope.add = function(value) {
          var i, index, len, month, ref;
          ref = $scope.months;
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            month = ref[index];
            if ($scope.selected_month === month && $scope.months[index + value]) {
              $scope.selectMonth($scope.months[index + value]);
              return true;
            }
          }
          return false;
        };
        $scope.subtract = function(value) {
          return $scope.add(-value);
        };
        return $scope.setMonth = function(index, slides_to_show) {
          var last_month_shown;
          if ($scope.months[index]) {
            $scope.selectMonth($scope.months[index]);
            last_month_shown = $scope.months[index + (slides_to_show - 1)];
            return $scope.$emit('month_picker:month_changed', $scope.months[index], last_month_shown);
          }
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbSlick
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbSlick
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * require : '^bbMonthPicker'
  * </pre>
  *
  * Has the following set of methods:
  * - templateUrl(element, attrs)
  * - controller($scope, $element, $attrs)
  *
   */

  angular.module('BB.Directives').directive('bbSlick', function($rootScope, $timeout, $bbug, PathSvc, $compile, $templateCache, $window) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      require: '^bbMonthPicker',
      templateUrl: function(element, attrs) {
        return PathSvc.directivePartial("_month_picker");
      },
      controller: function($scope, $element, $attrs) {
        return $scope.slickOnInit = function() {
          $scope.refreshing = true;
          $scope.$apply();
          $scope.refreshing = false;
          return $scope.$apply();
        };
      }
    };
  });

}).call(this);
