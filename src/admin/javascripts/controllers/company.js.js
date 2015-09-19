
/***
* @ngdoc controller
* @name BBAdmin.Controllers:CompanyList
*
* @description
* Controller CompanyList
*
* @param {object} $scope Scope is an object that refers to the application mode.
* <br>
* {@link https://docs.angularjs.org/guide/scope read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {service} $location The $location service parses the URL in the browser address bar
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$location read more}
*
 */

(function() {
  angular.module('BBAdmin.Controllers').controller('CompanyList', function($scope, $rootScope, $location) {
    $scope.selectedCategory = null;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var d, date, end, results;
        date = moment();
        $scope.current_date = date;
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        $scope.dates = [];
        end = moment(date).add(21, 'days');
        $scope.end_date = end;
        d = moment(date);
        results = [];
        while (d.isBefore(end)) {
          $scope.dates.push(d.clone());
          results.push(d.add(1, 'days'));
        }
        return results;
      };
    })(this));
    $scope.selectCompany = function(item) {
      return window.location = "/view/dashboard/pick_company/" + item.id;
    };
    $scope.advance_date = function(num) {
      var d, date, results;
      date = $scope.current_date.add(num, 'days');
      $scope.end_date = moment(date).add(21, 'days');
      $scope.current_date = moment(date);
      $scope.dates = [];
      d = date.clone();
      results = [];
      while (d.isBefore($scope.end_date)) {
        $scope.dates.push(d.clone());
        results.push(d.add(1, 'days'));
      }
      return results;
    };
    return $scope.$on("Refresh_Comp", function(event, message) {
      return $scope.$apply();
    });
  });

}).call(this);
