
/***
* @ngdoc service
* @name BB.Services:TimeSlotService
*
* @description
* Factory TimeSlotService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
*
 */

(function() {
  angular.module('BB.Services').factory('TimeSlotService', function($q, BBModel) {
    return {
      query: function(params) {
        var company, defer;
        defer = $q.defer();
        company = params.company;
        company.$get('slots', params).then(function(collection) {
          return collection.$get('slots').then(function(slots) {
            var s;
            slots = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = slots.length; i < len; i++) {
                s = slots[i];
                results.push(new BBModel.TimeSlot(s));
              }
              return results;
            })();
            return defer.resolve(slots);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);
