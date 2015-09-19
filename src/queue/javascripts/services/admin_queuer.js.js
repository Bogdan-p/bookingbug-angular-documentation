
/***
* @ngdoc service
* @name BBQueue.Services:AdminQueuerService
*
* @description
* Factory AdminQueuerService
*
* @requires $q
* @requires $window
* @requires halClient
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
*
 */

(function() {
  angular.module('BBQueue.Services').factory('AdminQueuerService', function($q, $window, halClient, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBQueue.Services:AdminQueuerService
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
        var defer;
        defer = $q.defer();
        params.company.$flush('queuers');
        params.company.$get('queuers').then(function(collection) {
          return collection.$get('queuers').then(function(queuers) {
            var models, q;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = queuers.length; i < len; i++) {
                q = queuers[i];
                results.push(new BBModel.Admin.Queuer(q));
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
