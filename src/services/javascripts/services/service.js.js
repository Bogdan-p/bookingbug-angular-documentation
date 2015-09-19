
/***
* @ngdoc service
* @name BBAdmin.Services:AdminServiceService
*
* @description
* Factory AdminServiceService
*
* path: src/services/javascripts/services/service.js.coffee
*
* @requires $q
* @requires $log
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminServiceService', function($q, BBModel, $log) {
    return {

      /***
      	* @ngdoc method
      	* @name query
      	* @methodOf BBAdmin.Services:AdminServiceService
      	*
      	* @description
      	* query
      	*
      	* @params {object} params
      	*
      	* @returns {Promise} deferred.promise
      	*
       */
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('services').then(function(collection) {
          return collection.$get('services').then(function(services) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = services.length; i < len; i++) {
                s = services[i];
                results.push(new BBModel.Admin.Service(s));
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
