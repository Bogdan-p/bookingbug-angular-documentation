
/***
* @ngdoc directive
* @name BBAdminServices.Directives:serviceTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:serviceTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getServices()
* - $scope.newService()
* - $scope.delete(service)
* - $scope.edit(service)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminServiceService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminServices').directive('serviceTable', function(AdminCompanyService, AdminServiceService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getServices = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminServiceService.query(params).then(function(services) {
          return $scope.services = services;
        });
      };
      $scope.newService = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Service',
          new_rel: 'new_service',
          post_rel: 'services',
          success: function(service) {
            return $scope.services.push(service);
          }
        });
      };
      $scope["delete"] = function(service) {
        return service.$del('self').then(function() {
          return $scope.services = _.reject($scope.services, service);
        }, function(err) {
          return $log.error("Failed to delete service");
        });
      };
      return $scope.edit = function(service) {
        return ModalForm.edit({
          model: service,
          title: 'Edit Service'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getServices();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getServices();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'service_table_main.html'
    };
  });

}).call(this);
