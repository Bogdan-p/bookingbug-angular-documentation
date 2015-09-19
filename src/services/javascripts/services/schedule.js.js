
/***
* @ngdoc service
* @name BBAdmin.Services:AdminScheduleService
*
* @description
* Factory AdminScheduleService
*
* path: src/services/javascripts/services/schedule.js.coffee
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
  angular.module('BBAdmin.Services').factory('AdminScheduleService', function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminScheduleService
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
        company.$get('schedules').then(function(collection) {
          return collection.$get('schedules').then(function(schedules) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = schedules.length; i < len; i++) {
                s = schedules[i];
                results.push(new BBModel.Admin.Schedule(s));
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
