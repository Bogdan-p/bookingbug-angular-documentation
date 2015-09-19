
/***
* @ngdoc service
* @name BB.Services:PurchaseTotalService
*
* @description
* Factory PurchaseTotalService
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
* - query(prms)
*
 */

(function() {
  angular.module('BB.Services').factory("PurchaseTotalService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        if (!prms.company.$has('total')) {
          deferred.reject("No Total link found");
        } else {
          prms.company.$get('total', {
            total_id: prms.total_id
          }).then((function(_this) {
            return function(total) {
              return deferred.resolve(new BBModel.PurchaseTotal(total));
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
