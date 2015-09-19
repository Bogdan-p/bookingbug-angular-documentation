
/***
* @ngdoc directive
* @name BBAdminEvents.Directives:eventGroupTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directives BBAdminEvents.Directives:eventGroupTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getEventGroups()
* - $scope.newEventGroup()
* - $scope.delete(id)
* - $scope.edit(id)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdminEvents.Services:AdminEventGroupService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminEvents').directive('eventGroupTable', function(AdminCompanyService, AdminEventGroupService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.getEventGroups = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminEventGroupService.query(params).then(function(event_groups) {
          $scope.event_groups_models = event_groups;
          return $scope.event_groups = _.map(event_groups, function(event_group) {
            return _.pick(event_group, 'id', 'name', 'mobile');
          });
        });
      };
      $scope.newEventGroup = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Event Group',
          new_rel: 'new_event_group',
          post_rel: 'event_groups',
          success: function(event_group) {
            return $scope.event_groups.push(event_group);
          }
        });
      };
      $scope["delete"] = function(id) {
        var event_group;
        event_group = _.find($scope.event_groups_models, function(p) {
          return p.id === id;
        });
        return event_group.$del('self').then(function() {
          return $scope.event_groups = _.reject($scope.event_groups, function(p) {
            return p.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete event_group");
        });
      };
      return $scope.edit = function(id) {
        var event_group;
        event_group = _.find($scope.event_groups_models, function(p) {
          return p.id === id;
        });
        return ModalForm.edit({
          model: event_group,
          title: 'Edit Event Group'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getEventGroups();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getEventGroups();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'event_group_table_main.html'
    };
  });

}).call(this);
