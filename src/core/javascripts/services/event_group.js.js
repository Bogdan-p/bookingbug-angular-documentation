
/***
* @ngdoc service
* @name BB.Services:EventGroupService
*
* @description
* Factory EventGroupService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(company, params)
*
 */

(function() {
  angular.module('BB.Services').factory("EventGroupService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_groups')) {
          deferred.reject("company does not have event_groups");
        } else {
          company.$get('event_groups', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_groups', params).then(function(event_groups) {
                var event_group;
                event_groups = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = event_groups.length; i < len; i++) {
                    event_group = event_groups[i];
                    results.push(new BBModel.EventGroup(event_group));
                  }
                  return results;
                })();
                return deferred.resolve(event_groups);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
