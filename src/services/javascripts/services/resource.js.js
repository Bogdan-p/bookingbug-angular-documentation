
/***
* @ngdoc service
* @name BBAdmin.Services:AdminResourceService
*
* @description
* Factory AdminResourceService
*
* path: src/services/javascripts/services/resource.js.coffee
*
* @requires $q
* @requires UriTemplate
* @requires angular-hal:halClient
* @requires BB.Services:SlotCollections
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
* - block(company, resource, data)
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminResourceService', function($q, UriTemplate, halClient, SlotCollections, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminResourceService
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
        company.$get('resources').then(function(collection) {
          return collection.$get('resources').then(function(resources) {
            var models, r;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = resources.length; i < len; i++) {
                r = resources[i];
                results.push(new BBModel.Admin.Resource(r));
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
      },

      /***
      * @ngdoc method
      * @name block
      * @methodOf BBAdmin.Services:AdminResourceService
      *
      * @description
      * block
      *
      * @params {object} params
      * @params {string} resource
      * @params {object} data
      *
      * @returns {Promise} deferred.promise
      *
       */
      block: function(company, resource, data) {
        var deferred, href, prms, uri;
        prms = {
          id: resource.id,
          company_id: company.id
        };
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/resource/{id}/block";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
