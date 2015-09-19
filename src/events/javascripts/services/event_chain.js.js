
/***
* @ngdoc service
* @name BBAdminEvents.Services:AdminEventChainService
*
* @description
* Factory AdminEventChainService
*
* @requires $q
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
*
 */

(function() {
  angular.module('BBAdminEvents').factory('AdminEventChainService', function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdminEvents.Services:AdminEventChainService
      *
      * @description
      * Method query
      *
      * @param {object} params params
      *
      * @returns {Promise} defer.reject(err) or defer.promise
      *
       */
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('event_chains').then(function(collection) {
          return collection.$get('event_chains').then(function(event_chains) {
            var e, models;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = event_chains.length; i < len; i++) {
                e = event_chains[i];
                results.push(new BBModel.Admin.EventChain(e));
              }
              return results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);
