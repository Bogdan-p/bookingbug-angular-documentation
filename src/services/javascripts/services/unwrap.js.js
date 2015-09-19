
/***
* @ngdoc service
* @name BBAdmin.Services:BB.Service.schedule
*
* @description
* Factory BB.Service.schedule
*
* path: src/services/javascripts/services/unwrap.js.coffee
*
* @requires $q
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - unwrap(resource)
*
 */

(function() {
  angular.module('BB.Services').factory("BB.Service.schedule", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Schedule(resource);
      }
    };
  });

}).call(this);
