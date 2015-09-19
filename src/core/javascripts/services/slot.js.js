
/***
* @ngdoc service
* @name BB.Services:SlotService
*
* @description
* Factory SlotService
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
  angular.module('BB.Services').factory("SlotService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('slots')) {
          deferred.resolve([]);
        } else {
          if (params.item) {
            if (params.item.resource) {
              params.resource_id = params.item.resource.id;
            }
            if (params.item.person) {
              params.person_id = params.item.person.id;
            }
          }
          company.$get('slots', params).then((function(_this) {
            return function(resource) {
              return resource.$get('slots', params).then(function(slots) {
                var slot;
                slots = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = slots.length; i < len; i++) {
                    slot = slots[i];
                    results.push(new BBModel.Slot(slot));
                  }
                  return results;
                })();
                return deferred.resolve(slots);
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
