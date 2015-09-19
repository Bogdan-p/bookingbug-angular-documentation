
/***
* @ngdoc directive
* @name BBAdminServices.Directives:scheduleTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:scheduleTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getSchedules()
* - $scope.newSchedule()
* - $scope.delete(schedule)
* - $scope.edit(schedule)
* - link(scope, element, attrs)
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminScheduleService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBAdminServices').directive('scheduleTable', function(AdminCompanyService, AdminScheduleService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getSchedules = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminScheduleService.query(params).then(function(schedules) {
          return $scope.schedules = schedules;
        });
      };
      $scope.newSchedule = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Schedule',
          new_rel: 'new_schedule',
          post_rel: 'schedules',
          size: 'lg',
          success: function(schedule) {
            return $scope.schedules.push(schedule);
          }
        });
      };
      $scope["delete"] = function(schedule) {
        return schedule.$del('self').then(function() {
          return $scope.schedules = _.reject($scope.schedules, schedule);
        }, function(err) {
          return $log.error("Failed to delete schedule");
        });
      };
      return $scope.edit = function(schedule) {
        return ModalForm.edit({
          model: schedule,
          title: 'Edit Schedule',
          size: 'lg'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getSchedules();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getSchedules();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'schedule_table_main.html'
    };
  });

}).call(this);
