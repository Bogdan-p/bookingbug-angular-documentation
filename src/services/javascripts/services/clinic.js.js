
/***
* @ngdoc service
* @name BBAdmin.Services:AdminClinicService
*
* @description
* Factory AdminClinicService
*
* path: src/services/javascripts/services/clinic.js.coffee
*
* @requires $q
* @requires $window
* @requires BB.Models:BBModel
* @requires BBAdmin.Services.ClinicCollections
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
* - create(prms, clinic)
* - delete(clinic)
* - update: (clinic)
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminClinicService', function($q, BBModel, ClinicCollections, $window) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminClinicService
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
        var company, defer, existing;
        company = params.company;
        defer = $q.defer();
        existing = ClinicCollections.find(params);
        if (existing) {
          defer.resolve(existing);
        } else {
          company.$get('clinics').then(function(collection) {
            return collection.$get('clinics').then(function(clinics) {
              var models, s;
              models = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = clinics.length; i < len; i++) {
                  s = clinics[i];
                  results.push(new BBModel.Admin.Clinic(s));
                }
                return results;
              })();
              clinics = new $window.Collection.Clinic(collection, models, params);
              ClinicCollections.add(clinics);
              return defer.resolve(clinics);
            }, function(err) {
              return defer.reject(err);
            });
          }, function(err) {
            return defer.reject(err);
          });
        }
        return defer.promise;
      },

      /***
      * @ngdoc method
      * @name create
      * @methodOf BBAdmin.Services:AdminClinicService
      *
      * @description
      * create
      *
      * @params {object} params
      * @params {object} clinic
      *
      * @returns {Promise} deferred.promise
      *
       */
      create: function(prms, clinic) {
        var company, deferred;
        company = prms.company;
        deferred = $q.defer();
        company.$post('clinics', {}, clinic.getPostData()).then((function(_this) {
          return function(clinic) {
            clinic = new BBModel.Admin.Clinic(clinic);
            ClinicCollections.checkItems(clinic);
            return deferred.resolve(clinic);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name delete
      * @methodOf BBAdmin.Services:AdminClinicService
      *
      * @description
      * delete
      *
      * @params {object} clinic
      *
      * @returns {Promise} deferred.promise
      *
       */
      "delete": function(clinic) {
        var deferred;
        deferred = $q.defer();
        clinic.$del('self').then((function(_this) {
          return function(clinic) {
            clinic = new BBModel.Admin.Clinic(clinic);
            ClinicCollections.deleteItems(clinic);
            return deferred.resolve(clinic);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name update
      * @methodOf BBAdmin.Services:AdminClinicService
      *
      * @description
      * update
      *
      * @params {object} clinic
      *
      * @returns {Promise} deferred.promise
      *
       */
      update: function(clinic) {
        var deferred;
        deferred = $q.defer();
        clinic.$put('self', {}, clinic.getPostData()).then((function(_this) {
          return function(c) {
            clinic = new BBModel.Admin.Clinic(c);
            ClinicCollections.checkItems(clinic);
            return deferred.resolve(clinic);
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
