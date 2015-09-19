
/***
* @ngdoc service
* @name BBQueue.Services:QueuerService
*
*@description
* Factory QueuerService
*
* @requires $q
* @requires $window
* @requires halClient
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
* - removeFromQueue(params)
*
 */

(function() {
  angular.module('BBQueue.Services').factory('QueuerService', [
    "$q", "$window", "halClient", "BBModel", function($q, UriTemplate, halClient, BBModel) {
      return {

        /***
         * @ngdoc method
         * @name query
         * @methodOf BBQueue.Services:QueuerService
         *
         * @description
         * Method query
         *
         * @param {object} params params
         *
         * @returns {Promise} deferred.promise
         *
         */
        query: function(params) {
          var deferred, href, uri, url;
          deferred = $q.defer();
          url = "";
          if (params.url) {
            url = params.url;
          }
          href = url + "/api/v1/queuers/{id}";
          uri = new UriTemplate(href).fillFromObject(params || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return deferred.resolve(found);
            };
          })(this));
          return deferred.promise;
        },

        /***
         	* @ngdoc method
         	* @name removeFromQueue
         	* @methodOf BBQueue.Services:QueuerService
         	*
         	* @description
         	* Method removeFromQueue
         	*
         	* @param {object} params params
         	*
         	* @returns {Promise} deferred.promise
         	*
         */
        removeFromQueue: function(params) {
          var deferred, href, uri, url;
          deferred = $q.defer();
          url = "";
          if (params.url) {
            url = params.url;
          }
          href = url + "/api/v1/queuers/{id}";
          uri = new UriTemplate(href).fillFromObject(params || {});
          halClient.$del(uri).then((function(_this) {
            return function(found) {
              return deferred.resolve(found);
            };
          })(this));
          return deferred.promise;
        }
      };
    }
  ]);

}).call(this);
