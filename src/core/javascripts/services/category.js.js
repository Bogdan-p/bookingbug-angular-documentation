
/***
* @ngdoc service
* @name BB.Services:CategoryService
*
* @description
* Factory CategoryService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(company)
*
 */

(function() {
  angular.module('BB.Services').factory("CategoryService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('categories')) {
          deferred.reject("No categories found");
        } else {
          company.$get('named_categories').then((function(_this) {
            return function(resource) {
              return resource.$get('categories').then(function(items) {
                var _i, cat, categories, i, j, len;
                categories = [];
                for (_i = j = 0, len = items.length; j < len; _i = ++j) {
                  i = items[_i];
                  cat = new BBModel.Category(i);
                  cat.order || (cat.order = _i);
                  categories.push(cat);
                }
                return deferred.resolve(categories);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
