
/***
* @ngdoc service
* @name BB.Services:CompanyService
*
* @description
* Factory CompanyService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} halClient Info
* <br>
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(company_id, options)
* - queryChildren(company)
*
 */

(function() {
  angular.module('BB.Services').factory("CompanyService", function($q, halClient, BBModel) {
    return {
      query: function(company_id, options) {
        var deferred, url;
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/company/" + company_id;
        deferred = $q.defer();
        halClient.$get(url, options).then((function(_this) {
          return function(company) {
            return deferred.resolve(company);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      queryChildren: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('companies')) {
          deferred.reject("No child companies found");
        } else {
          company.$get('companies').then((function(_this) {
            return function(resource) {
              return resource.$get('companies').then(function(items) {
                var companies, i, j, len;
                companies = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  companies.push(new BBModel.Company(i));
                }
                return deferred.resolve(companies);
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
