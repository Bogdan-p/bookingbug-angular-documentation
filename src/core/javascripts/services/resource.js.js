
/***
* @ngdoc service
* @name BB.Services:ResourceService
*
* @description
* Factory ResourceService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(company)
*
 */

(function() {
  angular.module('BB.Services').factory("ResourceService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('resources')) {
          deferred.reject("No resource found");
        } else {
          company.$get('resources').then((function(_this) {
            return function(resource) {
              return resource.$get('resources').then(function(items) {
                var i, j, len, resources;
                resources = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  resources.push(new BBModel.Resource(i));
                }
                return deferred.resolve(resources);
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
