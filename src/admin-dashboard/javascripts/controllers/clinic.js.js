
/***
* @ngdoc controller
* @name BBAdminDashboard.Controllers:bbClinicController
*
* @description
* {@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbClinicCtrl
*
* # Has the following set of methods hakunama:
* - $scope.getClinicItemSetup()
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
  angular.module('BBAdminDashboard').controller('bbClinicController', function($scope, $log, AdminServiceService, AdminResourceService, AdminPersonService, ModalForm, BBModel, $interval, $sessionStorage) {
    $scope.loading = true;
    $scope.clinic || ($scope.clinic = new BBModel.Admin.Clinic());
    return $scope.getClinicItemSetup = function() {
      return console.log("setup");
    };
  });

}).call(this);
