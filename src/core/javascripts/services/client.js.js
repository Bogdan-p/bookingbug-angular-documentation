
/***
* @ngdoc service
* @name BB.Services:ClientService
*
* @description
* Factory ClientService
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
* - create(company, client)
* - update(company, client)
* - create_or_update(company, client)
* - query_by_email(company, email)
*
 */

(function() {
  angular.module('BB.Services').factory("ClientService", function($q, BBModel, MutexService) {
    return {
      create: function(company, client) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('client')) {
          deferred.reject("Cannot create new people for this company");
        } else {
          MutexService.getLock().then(function(mutex) {
            return company.$post('client', {}, client.getPostData()).then((function(_this) {
              return function(cl) {
                deferred.resolve(new BBModel.Client(cl));
                return MutexService.unlock(mutex);
              };
            })(this), (function(_this) {
              return function(err) {
                deferred.reject(err);
                return MutexService.unlock(mutex);
              };
            })(this));
          });
        }
        return deferred.promise;
      },
      update: function(company, client) {
        var deferred;
        deferred = $q.defer();
        MutexService.getLock().then(function(mutex) {
          return client.$put('self', {}, client.getPostData()).then((function(_this) {
            return function(cl) {
              deferred.resolve(new BBModel.Client(cl));
              return MutexService.unlock(mutex);
            };
          })(this), (function(_this) {
            return function(err) {
              deferred.reject(err);
              return MutexService.unlock(mutex);
            };
          })(this));
        });
        return deferred.promise;
      },
      create_or_update: function(company, client) {
        if (client.$has('self')) {
          return this.update(company, client);
        } else {
          return this.create(company, client);
        }
      },
      query_by_email: function(company, email) {
        var deferred;
        deferred = $q.defer();
        if ((company != null) && (email != null)) {
          company.$get("client_by_email", {
            email: email
          }).then((function(_this) {
            return function(client) {
              if (client != null) {
                return deferred.resolve(new BBModel.Client(client));
              } else {
                return deferred.resolve({});
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        } else {
          deferred.reject("No company or email defined");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
