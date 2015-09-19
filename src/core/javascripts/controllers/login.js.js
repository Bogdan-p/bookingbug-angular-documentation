
/***
* @ngdoc directive
* @name BB.Directives:bbLogin
* @restrict AE
* @scope true
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}

* Directive BB.Directives:bbLogin
*
* See Controller {@link BB.Controllers:Login Login}
*
* <pre>
* restrict: 'AE'
* replace: true
* scope : true
* controller : 'Login'
* </pre>
*
 */

(function() {
  angular.module('BB.Directives').directive('bbLogin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Login'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Login
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Login
  *
  * # Has the following set of methods:
  *
  * - $scope.login_sso(token, route)
  * - $scope.login_with_password(email, password)
  * - $scope.showEmailPasswordReset()
  * - $scope.isLoggedIn()
  * - $scope.sendPasswordReset(email)
  * - $scope.updatePassword(new_password, confirm_new_password)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} LoginService Info
  * <br>
  * {@link BB.Services:LoginService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  *
   */

  angular.module('BB.Controllers').controller('Login', function($scope, $rootScope, LoginService, $q, ValidatorService, BBModel, $location) {
    $scope.controller = "public.controllers.Login";
    $scope.error = false;
    $scope.password_updated = false;
    $scope.password_error = false;
    $scope.email_sent = false;
    $scope.success = false;
    $scope.login_error = false;
    $scope.validator = ValidatorService;
    $scope.login_sso = (function(_this) {
      return function(token, route) {
        return $rootScope.connection_started.then(function() {
          return LoginService.ssoLogin({
            company_id: $scope.bb.company.id,
            root: $scope.bb.api_url
          }, {
            token: token
          }).then(function(member) {
            if (route) {
              return $scope.showPage(route);
            }
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.login_with_password = (function(_this) {
      return function(email, password) {
        $scope.login_error = false;
        return LoginService.companyLogin($scope.bb.company, {}, {
          email: email,
          password: password
        }).then(function(member) {
          $scope.member = new BBModel.Member.Member(member);
          $scope.success = true;
          return $scope.login_error = false;
        }, function(err) {
          return $scope.login_error = err;
        });
      };
    })(this);
    $scope.showEmailPasswordReset = (function(_this) {
      return function() {
        return $scope.showPage('email_reset_password');
      };
    })(this);
    $scope.isLoggedIn = (function(_this) {
      return function() {
        return LoginService.isLoggedIn();
      };
    })(this);
    $scope.sendPasswordReset = (function(_this) {
      return function(email) {
        $scope.error = false;
        return LoginService.sendPasswordReset($scope.bb.company, {
          email: email,
          custom: true
        }).then(function() {
          return $scope.email_sent = true;
        }, function(err) {
          return $scope.error = err;
        });
      };
    })(this);
    return $scope.updatePassword = (function(_this) {
      return function(new_password, confirm_new_password) {
        var auth_token;
        auth_token = $scope.member.getOption('auth_token');
        $scope.password_error = false;
        $scope.error = false;
        if ($scope.member && auth_token && new_password && confirm_new_password && (new_password === confirm_new_password)) {
          return LoginService.updatePassword($rootScope.member, {
            auth_token: auth_token,
            new_password: new_password,
            confirm_new_password: confirm_new_password
          }).then(function(member) {
            if (member) {
              $scope.password_updated = true;
              return $scope.showPage('login');
            }
          }, function(err) {
            return $scope.error = err;
          });
        } else {
          return $scope.password_error = true;
        }
      };
    })(this);
  });

}).call(this);
