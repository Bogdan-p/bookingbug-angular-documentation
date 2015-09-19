
/***
* @ngdoc service
* @name BB.Services:SSOService
*
* @description
* Factory SSOService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
* @param {model} halClient Info
*
* @returns {Promise} This service has the following set of methods:
*
* - memberLogin(options)
* - adminLogin: (options)
*
 */

(function() {
  angular.module('BB.Services').factory("SSOService", function($q, $rootScope, halClient, LoginService) {
    return {
      memberLogin: function(options) {
        var data, deferred, url;
        deferred = $q.defer();
        options.root || (options.root = "");
        url = options.root + "/api/v1/login/sso/" + options.company_id;
        data = {
          token: options.member_sso
        };
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              member = LoginService.setLogin(member);
              return deferred.resolve(member);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      adminLogin: function(options) {
        var data, deferred, url;
        deferred = $q.defer();
        options.root || (options.root = "");
        url = options.root + "/api/v1/login/admin_sso/" + options.company_id;
        data = {
          token: options.admin_sso
        };
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('administrator').then(function(admin) {
              return deferred.resolve(admin);
            });
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
