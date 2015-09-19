
/***
* @ngdoc directive
* @name BBAdminServices.Directives:scheduleCalendar
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:scheduleCalendar
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
* - scheduleRules()
* - scope.getEvents()
* - scope.addRange(start, end)
* - scope.removeRange(start, end) 
* - scope.toggleRange(start, end)
* - ngModel.$render()
*
* @requires uiCalendarConfig
* @requires BB.Models:ScheduleRules
*
 */

(function() {
  angular.module('BBAdminServices').directive('scheduleCalendar', function(uiCalendarConfig, ScheduleRules) {
    var controller, link;
    controller = function($scope, $attrs) {
      var options;
      $scope.calendarName = 'scheduleCal';
      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            return callback($scope.getEvents());
          }
        }
      ];
      $scope.getCalendarEvents = function(start, end) {
        var events;
        return events = uiCalendarConfig.calendars.scheduleCal.fullCalendar('clientEvents', function(e) {
          return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
        });
      };
      options = $scope.$eval($attrs.scheduleCalendar) || {};
      $scope.options = {
        calendar: {
          editable: false,
          selectable: true,
          defaultView: 'agendaSelectAcrossWeek',
          header: {
            left: 'today,prev,next',
            center: 'title',
            right: 'month,agendaSelectAcrossWeek'
          },
          selectHelper: false,
          eventOverlap: false,
          lazyFetching: false,
          views: {
            agendaSelectAcrossWeek: {
              duration: {
                weeks: 1
              },
              allDaySlot: false,
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
        return uiCalendarConfig.calendars.scheduleCal.fullCalendar('render');
      };
    };
    link = function(scope, element, attrs, ngModel) {
      var scheduleRules;
      scheduleRules = function() {
        return new ScheduleRules(ngModel.$viewValue);
      };
      scope.getEvents = function() {
        return scheduleRules().toEvents();
      };
      scope.addRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().addRange(start, end));
        return ngModel.$render();
      };
      scope.removeRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().removeRange(start, end));
        return ngModel.$render();
      };
      scope.toggleRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().toggleRange(start, end));
        return ngModel.$render();
      };
      return ngModel.$render = function() {
        if (uiCalendarConfig && uiCalendarConfig.calendars.scheduleCal) {
          uiCalendarConfig.calendars.scheduleCal.fullCalendar('refetchEvents');
          return uiCalendarConfig.calendars.scheduleCal.fullCalendar('unselect');
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
