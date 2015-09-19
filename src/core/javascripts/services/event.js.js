
/***
* @ngdoc service
* @name BB.Services:EventService
*
* @description
* Factory EventService
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
* - query(company, params)
* - summary(company, params)
*
 */

(function() {
  angular.module('BB.Services').factory("EventService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('events')) {
          deferred.resolve([]);
        } else {
          if (params.item) {
            if (params.item.event_group) {
              params.event_group_id = params.item.event_group.id;
            }
            if (params.item.event_chain) {
              params.event_chain_id = params.item.event_chain.id;
            }
            if (params.item.resource) {
              params.resource_id = params.item.resource.id;
            }
            if (params.item.person) {
              params.person_id = params.item.person.id;
            }
          }
          company.$get('events', params).then((function(_this) {
            return function(resource) {
              return resource.$get('events', params).then(function(events) {
                var event;
                events = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = events.length; i < len; i++) {
                    event = events[i];
                    results.push(new BBModel.Event(event));
                  }
                  return results;
                })();
                return deferred.resolve(events);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      summary: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('events')) {
          deferred.resolve([]);
        } else {
          if (params.item) {
            if (params.item.event_group) {
              params.event_group_id = params.item.event_group.id;
            }
            if (params.item.event_chain) {
              params.event_chain_id = params.item.event_chain.id;
            }
            if (params.item.resource) {
              params.resource_id = params.item.resource.id;
            }
            if (params.item.person) {
              params.person_id = params.item.person.id;
            }
          }
          params.summary = true;
          company.$get('events', params).then((function(_this) {
            return function(resource) {
              return deferred.resolve(resource.events);
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
