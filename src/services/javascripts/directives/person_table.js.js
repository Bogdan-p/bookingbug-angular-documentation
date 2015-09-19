
/***
* @ngdoc directive
* @name BBAdminServices.Directives:personTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:personTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getPeople()
* - $scope.newPerson()
* - $scope.delete(person)
* - $scope.edit(person)
* - $scope.schedule(person)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminPersonService
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminServices').directive('personTable', function(AdminCompanyService, AdminPersonService, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getPeople = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminPersonService.query(params).then(function(people) {
          return $scope.people = people;
        });
      };
      $scope.newPerson = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Person',
          new_rel: 'new_person',
          post_rel: 'people',
          success: function(person) {
            return $scope.people.push(person);
          }
        });
      };
      $scope["delete"] = function(person) {
        return person.$del('self').then(function() {
          return $scope.people = _.reject($scope.people, person);
        }, function(err) {
          return $log.error("Failed to delete person");
        });
      };
      $scope.edit = function(person) {
        return ModalForm.edit({
          model: person,
          title: 'Edit Person'
        });
      };
      return $scope.schedule = function(person) {
        return person.$get('schedule').then(function(schedule) {
          return ModalForm.edit({
            model: schedule,
            title: 'Edit Schedule'
          });
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getPeople();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getPeople();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'person_table_main.html'
    };
  });

}).call(this);
