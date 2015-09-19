
/***
* @ngdoc directive
* @name BBMember.Directives:loginMember
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:loginMember
*
* # Has the following set of methods:
*
* - loginMemberController($scope, $modalInstance, company_id)
*   - $scope.submit(form)
*   - $scope.cancel()
* -  pickCompanyController($scope, $modalInstance, companies)
*   - $scope.submit(form)
*   - $scope.cancel()
* - link(scope, element, attrs)
*   - loginModal()
*     - company_id()
* - pickCompanyModal(companies)
*   - companies()
* - tryLogin()
*
* @requires $modal
* @requires $log
* @requires $rootScope
* @requires BBMember.Services:MemberLoginService
* @requires $templateCache
* @requires $q
*
 */

(function() {
  angular.module('BBMember').directive('loginMember', function($modal, $log, $rootScope, MemberLoginService, $templateCache, $q) {
    var link, loginMemberController, pickCompanyController;
    loginMemberController = function($scope, $modalInstance, company_id) {
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
        return MemberLoginService.login(form, options).then(function(member) {
          member.email = form.email;
          member.password = form.password;
          return $modalInstance.close(member);
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
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      loginModal = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'login_modal_form.html',
          controller: loginMemberController,
          resolve: {
            company_id: function() {
              return scope.companyId;
            }
          }
        });
        return modalInstance.result.then(function(result) {
          scope.memberEmail = result.email;
          scope.memberPassword = result.password;
          if (result.$has('members')) {
            return result.$get('members').then(function(members) {
              var m;
              scope.members = members;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = members.length; i < len; i++) {
                  m = members[i];
                  results.push(m.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.member = result;
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
          email: scope.memberEmail,
          password: scope.memberPassword
        };
        options = {
          company_id: scope.companyId
        };
        return MemberLoginService.login(login_form, options).then(function(result) {
          if (result.$has('members')) {
            return result.$get('members').then(function(members) {
              var m;
              scope.members = members;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = members.length; i < len; i++) {
                  m = members[i];
                  results.push(m.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.member = result;
          }
        }, function(err) {
          return loginModal();
        });
      };
      if (scope.memberEmail && scope.memberPassword) {
        return tryLogin();
      } else {
        return loginModal();
      }
    };
    return {
      link: link,
      scope: {
        memberEmail: '@',
        memberPassword: '@',
        companyId: '@',
        apiUrl: '@',
        member: '='
      },
      transclude: true,
      template: "<div ng-show='member' ng-transclude></div>"
    };
  });

}).call(this);
