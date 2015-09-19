
/***
* @ngdoc directive
* @name BBAdminServices.Directives:scheduleWeekdays
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:scheduleWeekdays
*
* # Has the following set of methods:
*
* - controller($scope, $attrs)
* - events(start, end, timezone, callback)
* - $scope.getCalendarEvents(start, end)
* - select(start, end, jsEvent, view)
* - eventResizeStop(event, jsEvent, ui, view)
* - eventDrop(event, delta, revertFunc, jsEvent, ui, view)
* - eventClick(event, jsEvent, view)
* - $scope.render()
* - link(scope, element, attrs, ngModel)
* - scheduleRules ()
* - scope.getEvents()
* - scope.addRange(start, end)
* - scope.removeRange(start, end)
* - ngModel.$render()
*
* @requires uiCalendarConfig
* @requires BB.Models:ScheduleRules
*
 */

(function() {
  angular.module('BBAdminServices').directive('scheduleWeekdays', function(uiCalendarConfig, ScheduleRules) {
    var controller, link;
    controller = function($scope, $attrs) {
      var options;
      $scope.calendarName = 'scheduleWeekdays';
      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            return callback($scope.getEvents());
          }
        }
      ];
      $scope.getCalendarEvents = function(start, end) {
        var events;
        return events = uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('clientEvents', function(e) {
          return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
        });
      };
      options = $scope.$eval($attrs.scheduleWeekdays) || {};
      $scope.options = {
        calendar: {
          editable: false,
          selectable: true,
          defaultView: 'agendaSelectAcrossWeek',
          header: {
            left: '',
            center: 'title',
            right: ''
          },
          selectHelper: false,
          eventOverlap: false,
          views: {
            agendaSelectAcrossWeek: {
              duration: {
                weeks: 1
              },
              titleFormat: '[]',
              allDaySlot: false,
              columnFormat: 'ddd',
              slotEventOverlap: false,
              minTime: options.min_time || '00:00:00',
              maxTime: options.max_time || '24:00:00'
            }
          },
          select: function(start, end, jsEvent, view) {
            var events;
            events = $scope.getCalendarEvents(start, end);
            if (events.length > 0) {
              return $scope.removeRange(start, end);
            } else {
              return $scope.addRange(start, end);
            }
          },
          eventResizeStop: function(event, jsEvent, ui, view) {
            return $scope.addRange(event.start, event.end);
          },
          eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
            var orig;
            if (event.start.hasTime()) {
              orig = {
                start: moment(event.start).subtract(delta),
                end: moment(event.end).subtract(delta)
              };
              $scope.removeRange(orig.start, orig.end);
              return $scope.addRange(event.start, event.end);
            }
          },
          eventClick: function(event, jsEvent, view) {
            return $scope.removeRange(event.start, event.end);
          }
        }
      };
      return $scope.render = function() {
        return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('render');
      };
    };
    link = function(scope, element, attrs, ngModel) {
      var scheduleRules;
      scheduleRules = function() {
        return new ScheduleRules(ngModel.$viewValue);
      };
      scope.getEvents = function() {
        return scheduleRules().toWeekdayEvents();
      };
      scope.addRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().addWeekdayRange(start, end));
        return ngModel.$render();
      };
      scope.removeRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().removeWeekdayRange(start, end));
        return ngModel.$render();
      };
      return ngModel.$render = function() {
        if (uiCalendarConfig && uiCalendarConfig.calendars.scheduleWeekdays) {
          uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('refetchEvents');
          return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('unselect');
        }
      };
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'schedule_cal_main.html',
      require: 'ngModel',
      scope: {
        render: '=?'
      }
    };
  });

}).call(this);
