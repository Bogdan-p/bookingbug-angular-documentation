
/***
* @ngdoc service
* @name BBAdmin.Services:AdminAddressService
*
* @description
* Factory AdminAddressService
*
* path: src/services/javascripts/services/address.js.coffee
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
  angular.module('BBAdmin.Services').factory('AdminAddressService', function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminAddressService
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
        company.$get('addresses').then(function(collection) {
          return collection.$get('addresses').then(function(addresss) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = addresss.length; i < len; i++) {
                s = addresss[i];
                results.push(new BBModel.Admin.Address(s));
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
