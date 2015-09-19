
/***
* @ngdoc directive
* @name BBAdminDashboard.Directives:bbResourceCalendar
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminDashboard.Directives:bbResourceCalendar
*
* # Has the following set of methods:
*
* - controller($scope, $attrs)
* - events(start, end, timezone, callback)
* - eventDrop(event, delta, revertFunc)
* - eventClick(event, jsEvent, view)
* - resourceRender(resource, resourceTDs, dataTDs)
* - eventRender(event, element)
* - eventAfterRender(event, elements, view)
* - select(start, end, jsEvent, view, resource)
* - viewRender(view, element)
* - eventResize(event, delta, revertFunc, jsEvent, ui, view)
* - resources: (callback)
* - $scope.getPeople(callback)
* - $scope.updateBooking(booking)
* - $scope.editBooking(booking)
* - $scope.pusherSubscribe()
* - $scope.openDatePicker($event)
* - $scope.updateDate(date)
* - scope.getCompanyPromise()
* - link(scope, element, attrs)
*
* @requires uiCalendarConfig 
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdmin.Services:AdminBookingService
* @requires BBAdmin.Services:AdminPersonService
* @requires $q
* @requires $sessionStorage
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
* @requires BB.Directives:AdminBookingPopup
* @requires $window
* @requires $bbug
* @requires BBAdmin.Services:ColorPalette
* @requires AppConfig
* @requires BB.Services:Dialog
* @requires $timeout
* @requires $compile
* @requires $templateCache
*
 */

(function() {
  angular.module('BBAdminDashboard').directive('bbResourceCalendar', function(uiCalendarConfig, AdminCompanyService, AdminBookingService, AdminPersonService, $q, $sessionStorage, ModalForm, BBModel, AdminBookingPopup, $window, $bbug, ColorPalette, AppConfig, Dialog, $timeout, $compile, $templateCache) {
    var controller, link;
    controller = function($scope, $attrs) {
      var height;
      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            $scope.loading = true;
            return $scope.getCompanyPromise().then(function(company) {
              var params;
              params = {
                company: company,
                start_date: start.format('YYYY-MM-DD'),
                end_date: end.format('YYYY-MM-DD')
              };
              return AdminBookingService.query(params).then(function(bookings) {
                var b, i, len;
                $scope.loading = false;
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  b.resourceId = b.person_id;
                }
                return callback(bookings);
              });
            });
          }
        }
      ];
      $scope.options = $scope.$eval($attrs.bbResourceCalendar);
      $scope.options || ($scope.options = {});
      height = $scope.options.header_height ? $bbug($window).height() - $scope.options.header_height : 800;
      $scope.uiCalOptions = {
        calendar: {
          eventStartEditable: true,
          eventDurationEditable: false,
          height: height,
          header: {
            left: 'today,prev,next',
            center: 'title',
            right: 'timelineDay,agendaWeek,month'
          },
          defaultView: 'timelineDay',
          views: {
            agendaWeek: {
              slotDuration: $scope.options.slotDuration || "00:05"
            },
            month: {
              eventLimit: 5
            },
            timelineDay: {
              slotDuration: $scope.options.slotDuration || "00:05",
              eventOverlap: false,
              slotWidth: 44
            }
          },
          resourceLabelText: 'Staff',
          selectable: true,
          resources: function(callback) {
            return $scope.getPeople(callback);
          },
          eventDrop: function(event, delta, revertFunc) {
            return Dialog.confirm({
              model: event,
              body: "Are you sure you want to move this booking?",
              success: (function(_this) {
                return function(model) {
                  return $scope.updateBooking(event);
                };
              })(this),
              fail: function() {
                return revertFunc();
              }
            });
          },
          eventClick: function(event, jsEvent, view) {
            return $scope.editBooking(event);
          },
          resourceRender: function(resource, resourceTDs, dataTDs) {
            var dataTD, i, j, len, len1, resourceTD, results;
            for (i = 0, len = resourceTDs.length; i < len; i++) {
              resourceTD = resourceTDs[i];
              resourceTD.style.height = "44px";
              resourceTD.style.verticalAlign = "middle";
            }
            results = [];
            for (j = 0, len1 = dataTDs.length; j < len1; j++) {
              dataTD = dataTDs[j];
              results.push(dataTD.style.height = "44px");
            }
            return results;
          },
          eventRender: function(event, element) {
            var service;
            service = _.findWhere($scope.services, {
              id: event.service_id
            });
            element.css('background-color', service.color);
            element.css('color', service.textColor);
            return element.css('border-color', service.textColor);
          },
          eventAfterRender: function(event, elements, view) {
            var element, i, len;
            if (view.type === "timelineDay") {
              for (i = 0, len = elements.length; i < len; i++) {
                element = elements[i];
                element.style.height = "27px";
              }
            }
            return elements.draggable();
          },
          select: function(start, end, jsEvent, view, resource) {
            view.calendar.unselect();
            return AdminBookingPopup.open({
              date: start.format('YYYY-MM-DD'),
              time: start.format('HH:mm'),
              person: resource ? resource.id : void 0
            });
          },
          viewRender: function(view, element) {
            var date;
            date = uiCalendarConfig.calendars.resourceCalendar.fullCalendar('getDate');
            return $scope.currentDate = moment(date).format('YYYY-MM-DD');
          },
          eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
            event.duration = event.end.diff(event.start, 'minutes');
            return $scope.updateBooking(event);
          }
        }
      };
      $scope.getPeople = function(callback) {
        $scope.loading = true;
        return $scope.getCompanyPromise().then(function(company) {
          var params;
          params = {
            company: company
          };
          return AdminPersonService.query(params).then(function(people) {
            var i, len, p, ref;
            $scope.loading = false;
            $scope.people = _.sortBy(people, 'name');
            ref = $scope.people;
            for (i = 0, len = ref.length; i < len; i++) {
              p = ref[i];
              p.title = p.name;
            }
            uiCalendarConfig.calendars.resourceCalendar.fullCalendar('refetchEvents');
            return callback($scope.people);
          });
        });
      };
      $scope.updateBooking = function(booking) {
        booking.person_id = booking.resourceId;
        return booking.$update().then(function(response) {
          booking.resourceId = booking.person_id;
          return uiCalendarConfig.calendars.resourceCalendar.fullCalendar('updateEvent', booking);
        });
      };
      $scope.editBooking = function(booking) {
        return ModalForm.edit({
          templateUrl: 'edit_booking_modal_form.html',
          model: booking,
          title: 'Edit Booking',
          success: (function(_this) {
            return function(response) {
              if (response.is_cancelled) {
                return uiCalendarConfig.calendars.resourceCalendar.fullCalendar('removeEvents', [response.id]);
              } else {
                booking.resourceId = booking.person_id;
                return uiCalendarConfig.calendars.resourceCalendar.fullCalendar('updateEvent', booking);
              }
            };
          })(this)
        });
      };
      $scope.pusherSubscribe = (function(_this) {
        return function() {
          var channelName, pusherEvent;
          if (($scope.company != null) && (typeof Pusher !== "undefined" && Pusher !== null) && ($scope.pusher == null)) {
            $scope.pusher = new Pusher('c8d8cea659cc46060608', {
              authEndpoint: $scope.company.$link('pusher').href,
              auth: {
                headers: {
                  'App-Id': AppConfig.appId,
                  'App-Key': AppConfig.appKey,
                  'Auth-Token': $sessionStorage.getItem('auth_token')
                }
              }
            });
            channelName = "private-c" + $scope.company.id + "-w" + $scope.company.numeric_widget_id;
            if ($scope.pusher.channel(channelName) == null) {
              $scope.pusher_channel = $scope.pusher.subscribe(channelName);
              pusherEvent = function(res) {
                if (res.id != null) {
                  return setTimeout((function() {
                    var prms;
                    prms = {
                      company: $scope.company,
                      id: res.id
                    };
                    return AdminBookingService.getBooking(prms).then(function(booking) {});
                  }), 2000);
                }
              };
              $scope.pusher_channel.bind('booking', pusherEvent);
              $scope.pusher_channel.bind('cancellation', pusherEvent);
              return $scope.pusher_channel.bind('updating', pusherEvent);
            }
          }
        };
      })(this);
      $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.datePickerOpened = true;
      };
      $scope.updateDate = function(date) {
        if (uiCalendarConfig.calendars.resourceCalendar) {
          return uiCalendarConfig.calendars.resourceCalendar.fullCalendar('gotoDate', date);
        }
      };
      $scope.lazyUpdateDate = _.debounce($scope.updateDate, 400);
      $scope.datePickerOptions = {
        showButtonBar: false
      };
      return $scope.$watch('currentDate', function(newDate, oldDate) {
        return $scope.lazyUpdateDate(newDate);
      });
    };
    link = function(scope, element, attrs) {
      scope.getCompanyPromise = function() {
        var defer;
        defer = $q.defer();
        if (scope.company) {
          defer.resolve(scope.company);
        } else {
          AdminCompanyService.query(attrs).then(function(company) {
            scope.company = company;
            scope.pusherSubscribe();
            return defer.resolve(scope.company);
          });
        }
        return defer.promise;
      };
      scope.getCompanyPromise().then(function(company) {
        return company.$get('services').then(function(collection) {
          return collection.$get('services').then(function(services) {
            var s;
            scope.services = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = services.length; i < len; i++) {
                s = services[i];
                results.push(new BBModel.Admin.Service(s));
              }
              return results;
            })();
            return ColorPalette.setColors(scope.services);
          });
        });
      });
      return $timeout(function() {
        var datePickerElement, toolbarElement, toolbarLeftElement, uiCalElement;
        uiCalElement = angular.element(element.children()[1]);
        toolbarElement = angular.element(uiCalElement.children()[0]);
        toolbarLeftElement = angular.element(toolbarElement.children()[0]);
        scope.currentDate = moment().format();
        datePickerElement = $compile($templateCache.get('calendar_date_picker.html'))(scope);
        return toolbarLeftElement.append(datePickerElement);
      }, 0);
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'resource_calendar_main.html'
    };
  });

}).call(this);
