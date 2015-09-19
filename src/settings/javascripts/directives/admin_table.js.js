
/***
* @ngdoc directive
* @name BBAdminSettings.Directives:adminTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminSettings.Directives:adminTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getAdministrators()
* - $scope.newAdministrator()
* - success(administrator)
* - $scope.edit(id)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminAdministratorService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminSettings').directive('adminTable', function(AdminCompanyService, AdminAdministratorService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.getAdministrators = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminAdministratorService.query(params).then(function(administrators) {
          $scope.admin_models = administrators;
          return $scope.administrators = _.map(administrators, function(administrator) {
            return _.pick(administrator, 'id', 'name', 'email', 'role');
          });
        });
      };
      $scope.newAdministrator = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Administrator',
          new_rel: 'new_administrator',
          post_rel: 'administrators',
          success: function(administrator) {
            return $scope.administrators.push(administrator);
          }
        });
      };
      return $scope.edit = function(id) {
        var admin;
        admin = _.find($scope.admin_models, function(p) {
          return p.id === id;
        });
        return ModalForm.edit({
          model: admin,
          title: 'Edit Administrator'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getAdministrators();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getAdministrators();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'admin_table_main.html'
    };
  });

}).call(this);
