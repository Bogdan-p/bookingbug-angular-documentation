
/***
* @ngdoc controller
* @name BBAdminDashboard.Controllers:bbClinicDashboardController
*
* @description
* {@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbClinicDashboardCtrl
*
* # Has the following set of methods:
* - $scope.getClinicSetup()
*
* @requires $scope 
* @requires $log
* @requires BBAdmin.Services:AdminServiceService
* @requires BBAdmin.Services:AdminResourceService
* @requires BBAdmin.Services:AdminPersonService
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
* @requires $interval
* @requires $sessionStorage
*
 */

(function() {
  angular.module('BBAdminDashboard').controller('bbClinicDashboardController', function($scope, $log, AdminServiceService, AdminResourceService, AdminPersonService, ModalForm, BBModel, $interval, $sessionStorage) {
    $scope.loading = true;
    return $scope.getClinicSetup = function() {
      var params;
      console.log("setup");
      params = {
        company: $scope.company
      };
      AdminServiceService.query(params).then(function(services) {
        return $scope.services = services;
      }, function(err) {
        return $log.error(err.data);
      });
      AdminResourceService.query(params).then(function(resources) {
        return $scope.resources = resources;
      }, function(err) {
        return $log.error(err.data);
      });
      return AdminPersonService.query(params).then(function(people) {
        return $scope.people = people;
      }, function(err) {
        return $log.error(err.data);
      });
    };
  });

}).call(this);
