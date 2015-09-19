
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminTimeService
*
* @description
* Factory AdminTimeService
*
 @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window read more}
*
* @param {model} halClient Info
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminTimeService', function($q, $window, halClient, BBModel, UriTemplate) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminTimeService
      *
      * @description
      * Method query
      *
      * @param {object} prms Info
      *
      * @returns {Promise} defer.reject(err) or deferred.promise
       */
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.day) {
          prms.date = prms.day.date;
        }
        if (!prms.edate && prms.date) {
          prms.edate = prms.date;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id,person_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {
          no_cache: false
        }).then((function(_this) {
          return function(found) {
            return found.$get('events').then(function(events) {
              var event, eventItem, eventItems, i, j, len, len1, ref, time, ts;
              eventItems = [];
              for (i = 0, len = events.length; i < len; i++) {
                eventItem = events[i];
                event = {};
                event.times = [];
                event.event_id = eventItem.event_id;
                event.person_id = found.person_id;
                ref = eventItem.times;
                for (j = 0, len1 = ref.length; j < len1; j++) {
                  time = ref[j];
                  ts = new BBModel.TimeSlot(time);
                  event.times.push(ts);
                }
                eventItems.push(event);
              }
              return deferred.resolve(eventItems);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
