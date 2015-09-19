(function() {
  'use strict';

  /***
  * @ngdoc controller
  * @name BBAdmin.Controllers:DashDayList
  *
  * @description
  * Controller DashDayList
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} AdminDayService service.
  *
   */
  angular.module('BBAdmin.Controllers').controller('DashDayList', function($scope, $rootScope, $q, AdminDayService) {
    $scope.init = (function(_this) {
      return function(company_id) {
        var date, dayListDef, prms, weekListDef;
        $scope.inline_items = "";
        if (company_id) {
          $scope.bb.company_id = company_id;
        }
        if (!$scope.current_date) {
          $scope.current_date = moment().startOf('month');
        }
        date = $scope.current_date;
        prms = {
          date: date.format('DD-MM-YYYY'),
          company_id: $scope.bb.company_id
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        if ($scope.end_date) {
          prms.edate = $scope.end_date.format('DD-MM-YYYY');
        }
        dayListDef = $q.defer();
        weekListDef = $q.defer();
        $scope.dayList = dayListDef.promise;
        $scope.weeks = weekListDef.promise;
        prms.url = $scope.bb.api_url;
        return AdminDayService.query(prms).then(function(days) {
          $scope.sdays = days;
          dayListDef.resolve();
          if ($scope.category) {
            return $scope.update_days();
          }
        });
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.current_date.format(fmt);
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, dayBlock, e) {
        var elm, seldate, xelm;
        if (day.spaces === 0) {
          return false;
        }
        seldate = moment($scope.current_date);
        seldate.date(day.day);
        $scope.selected_date = seldate;
        elm = angular.element(e.toElement);
        elm.parent().children().removeClass("selected");
        elm.addClass("selected");
        xelm = $('#tl_' + $scope.bb.company_id);
        $scope.service_id = dayBlock.service_id;
        $scope.service = {
          id: dayBlock.service_id,
          name: dayBlock.name
        };
        $scope.selected_day = day;
        if (xelm.length === 0) {
          return $scope.inline_items = "/view/dash/time_small";
        } else {
          return xelm.scope().init(day);
        }
      };
    })(this);
    $scope.$watch('current_date', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.bb.company_id) {
          return $scope.init();
        }
      };
    })(this));
    $scope.update_days = (function(_this) {
      return function() {
        var day, i, len, ref, results;
        $scope.dayList = [];
        $scope.service_id = null;
        ref = $scope.sdays;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          day = ref[i];
          if (day.category_id === $scope.category.id) {
            $scope.dayList.push(day);
            results.push($scope.service_id = day.id);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this);
    return $rootScope.$watch('category', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.sdays) {
          return $scope.update_days();
        }
      };
    })(this));
  });

}).call(this);
