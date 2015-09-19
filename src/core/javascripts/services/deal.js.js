
/***
* @ngdoc service
* @name BB.Services:DealService
*
* @description
* Factory DealService
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
  angular.module('BB.Services').factory("DealService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('deals')) {
          deferred.reject("No Deals found");
        } else {
          company.$get('deals').then((function(_this) {
            return function(resource) {
              return resource.$get('deals').then(function(deals) {
                var deal;
                deals = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = deals.length; i < len; i++) {
                    deal = deals[i];
                    results.push(new BBModel.Deal(deal));
                  }
                  return results;
                })();
                return deferred.resolve(deals);
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
