
/***
* @ngdoc service
* @name BB.Services:ClientDetailsService
*
* @description
* Factory ClientDetailsService
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
  angular.module('BB.Services').factory("ClientDetailsService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('client_details')) {
          deferred.reject("No client_details found");
        } else {
          company.$get('client_details').then((function(_this) {
            return function(details) {
              return deferred.resolve(new BBModel.ClientDetails(details));
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
