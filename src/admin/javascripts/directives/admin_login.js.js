
/***
* @ngdoc directive
* @name BBAdmin.Directives:adminLogin
* @restrict E
*
* @description
* <br> ---------------------------------------------------------------------------------
* <br> NOTE
* <br> This is the TEST file.
* <br> Formatting of the documentation for this kind of functionality should be done first here
* <br> !To avoid repetition and to mentain consistency.
* <br> After the documentation for TEST file it is defined other files that have the same pattern can be also documented
* <br> This should be the file that sets the STANDARD.
* <br> ---------------------------------------------------------------------------------
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {service} $modal $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs read more}
*
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {service} $templateCache $templateCache
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$templateCachee read more}
*
* @param {service} AdminLoginService Service AdminLoginService
* @requires $http
*
 */

(function() {
  angular.module('BBAdmin.Directives').directive('adminLogin', function($modal, $log, $rootScope, AdminLoginService, $templateCache, $q) {
    var link, loginAdminController, pickCompanyController;
    loginAdminController = function($scope, $modalInstance, company_id) {
      $scope.title = 'Login';
      $scope.schema = {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: 'Email'
          },
          password: {
            type: 'string',
            title: 'Password'
          }
        }
      };
      $scope.form = [
        {
          key: 'email',
          type: 'email',
          feedback: false,
          autofocus: true
        }, {
          key: 'password',
          type: 'password',
          feedback: false
        }
      ];
      $scope.login_form = {};
      $scope.submit = function(form) {
        var options;
        options = {
          company_id: company_id
        };
        return AdminLoginService.login(form, options).then(function(admin) {
          admin.email = form.email;
          admin.password = form.password;
          return $modalInstance.close(admin);
        }, function(err) {
          return $modalInstance.dismiss(err);
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    pickCompanyController = function($scope, $modalInstance, companies) {
      var c;
      $scope.title = 'Pick Company';
      $scope.schema = {
        type: 'object',
        properties: {
          company_id: {
            type: 'integer',
            title: 'Company'
          }
        }
      };
      $scope.schema.properties.company_id["enum"] = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = companies.length; i < len; i++) {
          c = companies[i];
          results.push(c.id);
        }
        return results;
      })();
      $scope.form = [
        {
          key: 'company_id',
          type: 'select',
          titleMap: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = companies.length; i < len; i++) {
              c = companies[i];
              results.push({
                value: c.id,
                name: c.name
              });
            }
            return results;
          })(),
          autofocus: true
        }
      ];
      $scope.pick_company_form = {};
      $scope.submit = function(form) {
        return $modalInstance.close(form.company_id);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    link = function(scope, element, attrs) {
      var base, base1, loginModal, pickCompanyModal, tryLogin;
      console.log('admin login link');
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      loginModal = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'login_modal_form.html',
          controller: loginAdminController,
          resolve: {
            company_id: function() {
              return scope.companyId;
            }
          }
        });
        return modalInstance.result.then(function(result) {
          scope.adminEmail = result.email;
          scope.adminPassword = result.password;
          if (result.$has('admins')) {
            return result.$get('admins').then(function(admins) {
              var m;
              scope.admins = admins;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = admins.length; i < len; i++) {
                  m = admins[i];
                  results.push(m.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.admin = result;
          }
        }, function() {
          return loginModal();
        });
      };
      pickCompanyModal = function(companies) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'pick_company_modal_form.html',
          controller: pickCompanyController,
          resolve: {
            companies: function() {
              return companies;
            }
          }
        });
        return modalInstance.result.then(function(company_id) {
          scope.companyId = company_id;
          return tryLogin();
        }, function() {
          return pickCompanyModal();
        });
      };
      tryLogin = function() {
        var login_form, options;
        login_form = {
          email: scope.adminEmail,
          password: scope.adminPassword
        };
        options = {
          company_id: scope.companyId
        };
        return AdminLoginService.login(login_form, options).then(function(result) {
          if (result.$has('admins')) {
            return result.$get('admins').then(function(admins) {
              var a;
              scope.admins = admins;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = admins.length; i < len; i++) {
                  a = admins[i];
                  results.push(a.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.admin = result;
          }
        }, function(err) {
          return loginModal();
        });
      };
      if (scope.adminEmail && scope.adminPassword) {
        return tryLogin();
      } else {
        return loginModal();
      }
    };
    return {
      link: link,
      scope: {
        adminEmail: '@',
        adminPassword: '@',
        companyId: '@',
        apiUrl: '@',
        admin: '='
      },
      transclude: true,
      template: "<div ng-hide='admin'><img src='/BB_wait.gif' class=\"loader\"></div>\n<div ng-show='admin' ng-transclude></div>"
    };
  });

}).call(this);
