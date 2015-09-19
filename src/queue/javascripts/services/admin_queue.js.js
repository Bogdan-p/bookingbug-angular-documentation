
/***
* @ngdoc service
* @name BBQueue.Services:AdminQueueService
*
* @description
* Factory AdminQueueService
*
* @requires $q
* @requires $window
* @requires halClient
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
*
 */

(function() {
  angular.module('BBQueue.Services').factory('AdminQueueService', function($q, $window, halClient, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBQueue.Services:AdminQueueService
      *
      * @description
      * Method query
      *
      * @param {object} prms prms
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
      *
       */
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        prms.company.$get('client_queues').then(function(collection) {
          return collection.$get('client_queues').then(function(client_queues) {
            var models, q;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = client_queues.length; i < len; i++) {
                q = client_queues[i];
                results.push(new BBModel.Admin.ClientQueue(q));
              }
              return results;
            })();
            return deferred.resolve(models);
          }, function(err) {
            return deferred.reject(err);
          });
        }, function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  });

}).call(this);
