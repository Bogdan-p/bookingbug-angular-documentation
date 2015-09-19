
/***
* @ngdoc service
* @name BBAdmin.Services:AdminAdministratorService
*
* @description
* Factory AdminAdministratorService
*
* path: src/settings/javascripts/services/administrator.js.coffee
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
  angular.module('BBAdmin.Services').factory('AdminAdministratorService', function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminAdministratorService
      *
      * @description
      * query
      *
      * @param {object} params params
      *
      * @returns {Promise} deferred.promise
      *
       */
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('administrators').then(function(collection) {
          return collection.$get('administrators').then(function(administrators) {
            var a, models;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = administrators.length; i < len; i++) {
                a = administrators[i];
                results.push(new BBModel.Admin.Administrator(a));
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
