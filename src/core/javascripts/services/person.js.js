
/***
* @ngdoc service
* @name BB.Services:PersonService
*
* @description
* Factory PersonService
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
  angular.module('BB.Services').factory("PersonService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('people')) {
          deferred.reject("No people found");
        } else {
          company.$get('people').then((function(_this) {
            return function(resource) {
              return resource.$get('people').then(function(items) {
                var i, j, len, people;
                people = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  people.push(new BBModel.Person(i));
                }
                return deferred.resolve(people);
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
