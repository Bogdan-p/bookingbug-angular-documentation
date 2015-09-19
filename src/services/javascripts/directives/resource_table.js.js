
/***
* @ngdoc directive
* @name BBAdminServices.Directives:resourceTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:resourceTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getResources()
* - $scope.newResource()
* - $scope.delete(person)
* - $scope.edit(person)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminResourceService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminServices').directive('resourceTable', function(AdminCompanyService, AdminResourceService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getResources = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminResourceService.query(params).then(function(resources) {
          return $scope.resources = resources;
        });
      };
      $scope.newResource = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Resource',
          new_rel: 'new_resource',
          post_rel: 'resources',
          size: 'lg',
          success: function(resource) {
            return $scope.resources.push(resource);
          }
        });
      };
      $scope["delete"] = function(resource) {
        return resource.$del('self').then(function() {
          return $scope.resources = _.reject($scope.resources, function(p) {
            return p.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete resource");
        });
      };
      return $scope.edit = function(resource) {
        return ModalForm.edit({
          model: resource,
          title: 'Edit Resource'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getResources();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getResources();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'resource_table_main.html'
    };
  });

}).call(this);
