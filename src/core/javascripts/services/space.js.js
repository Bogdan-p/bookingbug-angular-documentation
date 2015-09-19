
/***
* @ngdoc service
* @name BB.Services:SpaceService
*
* @description
* Factory SpaceService
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
  angular.module('BB.Services').factory("SpaceService", [
    '$q', function($q, BBModel) {
      return {
        query: function(company) {
          var deferred;
          deferred = $q.defer();
          if (!company.$has('spaces')) {
            deferred.reject("No spaces found");
          } else {
            company.$get('spaces').then((function(_this) {
              return function(resource) {
                return resource.$get('spaces').then(function(items) {
                  var i, j, len, spaces;
                  spaces = [];
                  for (j = 0, len = items.length; j < len; j++) {
                    i = items[j];
                    spaces.push(new BBModel.Space(i));
                  }
                  return deferred.resolve(spaces);
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
    }
  ]);

}).call(this);
