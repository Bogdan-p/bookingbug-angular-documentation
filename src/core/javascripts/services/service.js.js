
/***
* @ngdoc service
* @name BB.Services:ServiceService
*
* @description
* Factory ServiceService
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
* - query(company)
*
 */

(function() {
  angular.module('BB.Services').factory("ServiceService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('services')) {
          deferred.reject("No services found");
        } else {
          company.$get('services').then((function(_this) {
            return function(resource) {
              return resource.$get('services').then(function(items) {
                var i, j, len, services;
                services = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  services.push(new BBModel.Service(i));
                }
                return deferred.resolve(services);
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
