
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminLoginService
*
* @description
* Factory AdminLoginService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {service} $cookies Provides read/write access to browser's cookies.
* <br>
* {@link https://docs.angularjs.org/api/ngCookies/service/$cookies read more}
*
* @param {model} halClient Info
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {object} $sessionStorage Info
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
 */

(function() {
  angular.module('BBAdmin.Services').factory("AdminLoginService", function($q, halClient, $rootScope, BBModel, $sessionStorage, $cookies, UriTemplate) {
    return {

      /***
      * @ngdoc method
      * @name login
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method login
      *
      * @param {object} form Info
      *
      * @param {object} options Info
      *
      * @returns {Promise} deferred.promise
       */
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin";
        if ((options != null) && (options.company_id != null)) {
          url = url + "/" + options.company_id;
        }
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var login_model;
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return deferred.resolve(user);
              });
            } else if (login.$has('administrators')) {
              login_model = new BBModel.Admin.Login(login);
              return deferred.resolve(login_model);
            } else {
              return deferred.reject("No admin account for login");
            }
          };
        })(this), (function(_this) {
          return function(err) {
            var login, login_model;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('administrators')) {
                login_model = new BBModel.Admin.Login(login);
                return deferred.resolve(login_model);
              } else {
                return deferred.reject(err);
              }
            } else {
              return deferred.reject(err);
            }
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name ssoLogin
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method ssoLogin
      *
      * @param {object} options Info
      *
      * @param {object} data Info
      *
      * @returns {Promise} deferred.promise
       */
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('user').then(function(user) {
              user = _this.setLogin(user);
              return deferred.resolve(user);
            });
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
      * @name isLoggedIn
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method isLoggedIn
      *
      * @returns {Boolean} returns true if user is logged in otherwise returns false
       */
      isLoggedIn: function() {
        return this.checkLogin().then(function() {
          if ($rootScope.user) {
            return true;
          } else {
            return false;
          }
        });
      },

      /***
      * @ngdoc method
      * @name setLogin
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method setLogin
      *
      * @param {object} user Info
      *
      * @returns {object} returns newly created user object
       */
      setLogin: function(user) {
        var auth_token;
        auth_token = user.getOption('auth_token');
        user = new BBModel.Admin.User(user);
        $sessionStorage.setItem("user", user.$toStore());
        $sessionStorage.setItem("auth_token", auth_token);
        $rootScope.user = user;
        return user;
      },

      /***
      * @ngdoc method
      * @name user
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method user
      *
      * @returns {object} returns $rootScope.use
       */
      user: function() {
        return this.checkLogin().then(function() {
          return $rootScope.user;
        });
      },

      /***
      * @ngdoc method
      * @name checkLogin
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method checkLogin
      *
      * @returns {Promise} defer.resolve() or defer.promise
       */
      checkLogin: function(params) {
        var auth_token, defer, href, options, url, user;
        if (params == null) {
          params = {};
        }
        defer = $q.defer();
        if ($rootScope.user) {
          defer.resolve();
        }
        user = $sessionStorage.getItem("user");
        if (user) {
          $rootScope.user = new BBModel.Admin.User(halClient.createResource(user));
          defer.resolve();
        } else {
          auth_token = $cookies['Auth-Token'];
          if (auth_token) {
            if ($rootScope.bb.api_url) {
              url = $rootScope.bb.api_url + "/api/v1/login{?id,role}";
            } else {
              url = "/api/v1/login{?id,role}";
            }
            params.id = params.companyId || params.company_id;
            params.role = 'admin';
            href = new UriTemplate(url).fillFromObject(params || {});
            options = {
              auth_token: auth_token
            };
            halClient.$get(href, options).then((function(_this) {
              return function(login) {
                if (login.$has('administrator')) {
                  return login.$get('administrator').then(function(user) {
                    $rootScope.user = new BBModel.Admin.User(user);
                    return defer.resolve();
                  });
                } else {
                  return defer.resolve();
                }
              };
            })(this), function() {
              return defer.resolve();
            });
          } else {
            defer.resolve();
          }
        }
        return defer.promise;
      },

      /***
      * @ngdoc method
      * @name logout
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method logout
      *
      * @returns {Promise} defer.reject or defer.promise
       */
      logout: function() {
        $rootScope.user = null;
        $sessionStorage.removeItem("user");
        $sessionStorage.removeItem("auth_token");
        return $cookies['Auth-Token'] = null;
      },

      /***
      * @ngdoc method
      * @name getLogin
      * @methodOf BBAdmin.Services:AdminLoginService
      *
      * @description
      * Method getLogin
      *
      * @param {object} options Info
      *
      * @returns {Promise} defer.reject or defer.promise
       */
      getLogin: function(options) {
        var defer, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin/" + options.company_id;
        halClient.$get(url, options).then((function(_this) {
          return function(login) {
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return defer.resolve(user);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              return defer.reject();
            }
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);
