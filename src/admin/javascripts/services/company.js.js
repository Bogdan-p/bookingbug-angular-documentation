
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminCompanyService
*
* @description
* Factory AdminCompanyService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {model} BBModel Info
* <br>
* {@link BBAdmin.Services:AdminBookingService more }
*
* @param {model} AdminLoginService Info
*
* @param {object} $sessionStorage Info
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminCompanyService', function($q, BBModel, AdminLoginService, $rootScope, $sessionStorage) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminCompanyService
      *
      * @description
      * Method query
      *
      * @param {object} params Info
      *
      * @returns {Promise} deferred.promise
       */
      query: function(params) {
        var base, base1, base2, defer;
        defer = $q.defer();
        $rootScope.bb || ($rootScope.bb = {});
        (base = $rootScope.bb).api_url || (base.api_url = $sessionStorage.getItem("host"));
        (base1 = $rootScope.bb).api_url || (base1.api_url = params.apiUrl);
        (base2 = $rootScope.bb).api_url || (base2.api_url = "");
        AdminLoginService.checkLogin(params).then(function() {
          var login_form, options;
          if ($rootScope.user && $rootScope.user.company_id) {
            $rootScope.bb || ($rootScope.bb = {});
            $rootScope.bb.company_id = $rootScope.user.company_id;
            return $rootScope.user.$get('company').then(function(company) {
              return defer.resolve(BBModel.Company(company));
            }, function(err) {
              return defer.reject(err);
            });
          } else {
            login_form = {
              email: params.adminEmail,
              password: params.adminPassword
            };
            options = {
              company_id: params.companyId
            };
            return AdminLoginService.login(login_form, options).then(function(user) {
              return user.$get('company').then(function(company) {
                return defer.resolve(BBModel.Company(company));
              }, function(err) {
                return defer.reject(err);
              });
            }, function(err) {
              return defer.reject(err);
            });
          }
        });
        return defer.promise;
      }
    };
  });

}).call(this);
