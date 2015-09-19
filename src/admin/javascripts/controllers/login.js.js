
/***
* @ngdoc directive
* @name BBAdmin.Directives:bbAdminLogin
* @restrict AE
*
* @description
* Directive bbAdminLogin
*
* @example Example that demonstrates basic bookingTable.
  <example>
    <file name="index.html">
      <div class="my-example">
      </div>
    </file>

    <file name="style.css">
      .my-example {
        background: green;
        widht: 200px;
        height: 200px;
      }
    </file>
  </example>
 */

(function() {
  angular.module('BBAdmin.Directives').directive('bbAdminLogin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        onSuccess: '=',
        onCancel: '=',
        onError: '=',
        bb: '='
      },
      controller: 'AdminLogin',
      template: '<div ng-include="login_template"></div>'
    };
  });


  /***
  * @ngdoc controller
  * @name BBAdmin.Controllers:AdminLogin
  *
  * @description
  * Controller AdminLogin
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {object} $sessionStorage The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location read more}
  *
  * @param {service} AdminLoginService Service.
  *
   */

  angular.module('BBAdmin.Controllers').controller('AdminLogin', function($scope, $rootScope, AdminLoginService, $q, $sessionStorage) {
    $scope.login = {
      host: $sessionStorage.getItem('host'),
      email: null,
      password: null
    };
    $scope.login_template = 'admin_login.html';
    $scope.login = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.login.email,
        password: $scope.login.password
      };
      return AdminLoginService.login(params).then(function(user) {
        if (user.company_id != null) {
          $scope.user = user;
          if ($scope.onSuccess) {
            return $scope.onSuccess();
          }
        } else {
          return user.getAdministratorsPromise().then(function(administrators) {
            $scope.administrators = administrators;
            return $scope.pickCompany();
          });
        }
      }, function(err) {
        return $scope.alert = "Sorry, either your email or password was incorrect";
      });
    };
    $scope.pickCompany = function() {
      return $scope.login_template = 'pick_company.html';
    };
    return $scope.selectedCompany = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.email,
        password: $scope.password
      };
      return $scope.selected_admin.$post('login', {}, params).then(function(login) {
        return $scope.selected_admin.getCompanyPromise().then(function(company) {
          $scope.bb.company = company;
          AdminLoginService.setLogin($scope.selected_admin);
          return $scope.onSuccess(company);
        });
      });
    };
  });

}).call(this);
