
/***
* @ngdoc controller
* @name BBAdmin.Controllers:TimeOptions
*
* @description
* {@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller TimeOptions
*
* # Has the following set of methods:
*
* - $scope.block
*
* @requires $scope
* @requires $location
* @requires $rootScope
* @requires BBAdmin.Services:AdminResourceService
* @requires BBAdmin.Services:AdminPersonService
*
 */

(function() {
  angular.module('BBAdmin.Controllers').controller('TimeOptions', function($scope, $location, $rootScope, AdminResourceService, AdminPersonService) {
    AdminResourceService.query({
      company: $scope.bb.company
    }).then(function(resources) {
      return $scope.resources = resources;
    });
    AdminPersonService.query({
      company: $scope.bb.company
    }).then(function(people) {
      return $scope.people = people;
    });
    return $scope.block = function() {
      if ($scope.person) {
        AdminPersonService.block($scope.bb.company, $scope.person, {
          start_time: $scope.start_time,
          end_time: $scope.end_time
        });
      }
      return $scope.ok();
    };
  });

}).call(this);
