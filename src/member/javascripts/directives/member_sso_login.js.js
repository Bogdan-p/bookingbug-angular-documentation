
/***
* @ngdoc directive
* @name BBMember.Directives:memberSsoLogin
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:memberSsoLogin
*
* # Has the following set methods:
*
* - link(scope, element, attrs)
*
* @requires $rootScope
* @requires BBMember.Services:MemberLoginService
* @requires $sniffer
* @requires $timeout
*
 */

(function() {
  angular.module('BBMember').directive('memberSsoLogin', function($rootScope, LoginService, $sniffer, $timeout) {
    var link;
    link = function(scope, element, attrs) {
      var base, base1, data, options;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      scope.member = null;
      options = {
        root: $rootScope.bb.api_url,
        company_id: scope.companyId
      };
      data = {
        token: scope.token
      };
      if ($sniffer.msie && $sniffer.msie < 10 && $rootScope.iframe_proxy_ready === false) {
        return $timeout(function() {
          return LoginService.ssoLogin(options, data).then(function(member) {
            return scope.member = member;
          });
        }, 2000);
      } else {
        return LoginService.ssoLogin(options, data).then(function(member) {
          return scope.member = member;
        });
      }
    };
    return {
      link: link,
      scope: {
        token: '@memberSsoLogin',
        companyId: '@',
        apiUrl: '@',
        member: '='
      },
      transclude: true,
      template: "<div ng-if='member' ng-transclude></div>"
    };
  });

}).call(this);
