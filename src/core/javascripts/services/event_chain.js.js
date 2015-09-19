
/***
* @ngdoc service
* @name BB.Services:EventChainService
*
* @description
* Factory EventChainService
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
* - query(company, params)
*
 */

(function() {
  angular.module('BB.Services').factory("EventChainService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_chains')) {
          deferred.reject("company does not have event_chains");
        } else {
          company.$get('event_chains', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_chains', params).then(function(event_chains) {
                var event_chain;
                event_chains = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = event_chains.length; i < len; i++) {
                    event_chain = event_chains[i];
                    results.push(new BBModel.EventChain(event_chain));
                  }
                  return results;
                })();
                return deferred.resolve(event_chains);
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
