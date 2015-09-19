
/***
* @ngdoc service
* @name BB.Services:LoginService
*
* @description
* Factory LoginService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {service} $sessionStorage Info
*
* @param {model} halClient Info
*
* @returns {Promise} This service has the following set of methods:
*
* - companyLogin(company, params, form)
* - login(form, options)
* - companyQuery(id)
* - memberQuery(params)
* - ssoLogin(options, data)
* - isLoggedIn()
* - setLogin(member)
* - member()
* - checkLogin()
* - logout(options)
* - sendPasswordReset(company, params)
* - updatePassword(member, params)
*
 */

(function() {
  angular.module('BB.Services').factory("LoginService", function($q, halClient, $rootScope, BBModel, $sessionStorage) {
    return {
      companyLogin: function(company, params, form) {
        var deferred;
        deferred = $q.defer();
        company.$post('login', params, form).then((function(_this) {
          return function(login) {
            return login.$get('member').then(function(member) {
              _this.setLogin(member);
              return deferred.resolve(member);
            }, function(err) {
              return deferred.reject(err);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/login";
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              _this.setLogin(member);
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
      companyQuery: (function(_this) {
        return function(id) {
          var comp_promise;
          if (id) {
            comp_promise = halClient.$get(location.protocol + '//' + location.host + '/api/v1/company/' + id);
            return comp_promise.then(function(company) {
              return company = new BBModel.Company(company);
            });
          }
        };
      })(this),
      memberQuery: (function(_this) {
        return function(params) {
          var member_promise;
          if (params.member_id && params.company_id) {
            member_promise = halClient.$get(location.protocol + '//' + location.host + ("/api/v1/" + params.company_id + "/") + "members/" + params.member_id);
            return member_promise.then(function(member) {
              return member = new BBModel.Member.Member(member);
            });
          }
        };
      })(this),
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              member = new BBModel.Member.Member(member);
              _this.setLogin(member);
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
      isLoggedIn: function() {
        this.checkLogin();
        if ($rootScope.member && !$rootScope.user) {
          return true;
        } else {
          return false;
        }
      },
      setLogin: function(member) {
        var auth_token;
        auth_token = member.getOption('auth_token');
        member = new BBModel.Member.Member(member);
        $sessionStorage.setItem("login", member.$toStore());
        $sessionStorage.setItem("auth_token", auth_token);
        $rootScope.member = member;
        return member;
      },
      member: function() {
        this.checkLogin();
        return $rootScope.member;
      },
      checkLogin: function() {
        var member;
        if ($rootScope.member) {
          return;
        }
        member = $sessionStorage.getItem("login");
        if (member) {
          return $rootScope.member = halClient.createResource(member);
        }
      },
      logout: function(options) {
        var deferred, url;
        $rootScope.member = null;
        $sessionStorage.removeItem("login");
        $sessionStorage.removeItem('auth_token');
        $sessionStorage.clear();
        deferred = $q.defer();
        options || (options = {});
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/logout";
        halClient.$del(url, options, {}).then((function(_this) {
          return function(logout) {
            return deferred.resolve(true);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      sendPasswordReset: function(company, params) {
        var deferred;
        deferred = $q.defer();
        company.$post('email_password_reset', {}, params).then((function(_this) {
          return function() {
            return deferred.resolve(true);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      updatePassword: function(member, params) {
        var deferred;
        if (member && params['new_password'] && params['confirm_new_password']) {
          deferred = $q.defer();
          member.$post('update_password', {}, params).then((function(_this) {
            return function(login) {
              return login.$get('member').then(function(member) {
                _this.setLogin(member);
                return deferred.resolve(member);
              }, function(err) {
                return deferred.reject(err);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
          return deferred.promise;
        }
      }
    };
  });

}).call(this);
