
/***
* @ngdoc controller
* @name BBAdmin.Controllers:CategoryList
*
* @description
* Controller CategoryList
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
* @param {service} CategoryService Service.
*
 */

(function() {
  angular.module('BBAdmin.Controllers').controller('CategoryList', function($scope, $location, CategoryService, $rootScope) {
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.categories = CategoryService.query($scope.bb.company);
        return $scope.categories.then(function(items) {});
      };
    })(this));
    $scope.$watch('selectedCategory', (function(_this) {
      return function(newValue, oldValue) {
        var items;
        $rootScope.category = newValue;
        return items = $('.inline_time').each(function(idx, e) {
          return angular.element(e).scope().clear();
        });
      };
    })(this));
    return $scope.$on("Refresh_Cat", (function(_this) {
      return function(event, message) {
        return $scope.$apply();
      };
    })(this));
  });

}).call(this);
