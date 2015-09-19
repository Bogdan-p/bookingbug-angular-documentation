
/***
* @ngdoc service
* @name BB.Services:EventSequenceService
*
* @description
* Factory EventSequenceService
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
  angular.module('BB.Services').factory("EventSequenceService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_sequences')) {
          deferred.reject("company does not have event_sequences");
        } else {
          company.$get('event_sequences', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_sequences', params).then(function(event_sequences) {
                var event_sequence;
                event_sequences = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = event_sequences.length; i < len; i++) {
                    event_sequence = event_sequences[i];
                    results.push(new BBModel.EventSequence(event_sequence));
                  }
                  return results;
                })();
                return deferred.resolve(event_sequences);
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
