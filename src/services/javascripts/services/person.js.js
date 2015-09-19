
/***
* @ngdoc service
* @name BBAdmin.Services:AdminPersonService
*
* @description
* Factory AdminPersonService
*
* path: src/services/javascripts/services/person.js.coffee
*
* @requires $q
* @requires $window
* @requires $rootScope
* @requires $log
* @requires angular-hal:halClient
* @requires BB.Services:SlotCollections
* @requires BB.Models:BBModel
* @requires BB.Services:LoginService
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
* - block(company, person, data)
* - signup(user, data)
*
 */

(function() {
  angular.module('BBAdminServices').factory('AdminPersonService', function($q, $window, $rootScope, halClient, SlotCollections, BBModel, LoginService, $log) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminPersonService
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
        if (company.$has('people')) {
          company.$get('people').then(function(collection) {
            return collection.$get('people').then(function(people) {
              var models, p;
              models = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = people.length; i < len; i++) {
                  p = people[i];
                  results.push(new BBModel.Admin.Person(p));
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
        } else {
          $log.warn('company has no people link');
          defer.reject('company has no people link');
        }
        return defer.promise;
      },

      /***
      * @ngdoc method
      * @name block
      * @methodOf BBAdmin.Services:AdminPersonService
      *
      * @description
      * block
      *
      * @params {object} params
      * @params {object} person
      * @params {object} data
      *
      * @returns {Promise} deferred.promise
      *
       */
      block: function(company, person, data) {
        var deferred;
        deferred = $q.defer();
        person.$put('block', {}, data).then((function(_this) {
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
      },

      /***
      * @ngdoc signup
      * @name query
      * @methodOf BBAdmin.Services:AdminPersonService
      *
      * @description
      * block
      *
      * @params {object} user
      * @params {object} data
      *
      * @returns {Promise} deferred.promise
      *
       */
      signup: function(user, data) {
        var defer;
        defer = $q.defer();
        return user.$get('company').then(function(company) {
          var params;
          params = {};
          company.$post('people', params, data).then(function(person) {
            if (person.$has('administrator')) {
              return person.$get('administrator').then(function(user) {
                LoginService.setLogin(user);
                return defer.resolve(person);
              });
            } else {
              return defer.resolve(person);
            }
          }, function(err) {
            return defer.reject(err);
          });
          return defer.promise;
        });
      }
    };
  });

}).call(this);
