
/***
* @ngdoc service
* @name BBAdminEvents.Services:AdminEventGroupService
*
* @description
* Factory AdminEventGroupService
*
* @requires $q
* @requires BBAdminEvents.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
*
 */

(function() {
  angular.module('BBAdminEvents').factory('AdminEventGroupService', function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdminEvents.Services:AdminEventGroupService
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
        company.$get('event_groups').then(function(collection) {
          return collection.$get('event_groups').then(function(event_groups) {
            var e, models;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = event_groups.length; i < len; i++) {
                e = event_groups[i];
                results.push(new BBModel.Admin.EventGroup(e));
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
