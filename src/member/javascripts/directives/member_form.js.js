
/***
* @ngdoc directive
* @name BBMember.Directives:memberForm
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:memberForm
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.submit(form)
* - link(scope, element, attrs)
*
* @requires $modal
* @requires $log
* @requires $rootScope
* @requires BBMember.Services:MemberLoginService
* @requires BB.Services:MemberBookingService
*
 */

(function() {
  angular.module('BBMember').directive('memberForm', function($modal, $log, $rootScope, MemberLoginService, MemberBookingService) {
    var controller, link;
    controller = function($scope) {
      $scope.loading = true;
      $scope.$watch('member', function(member) {
        if (member != null) {
          return member.$get('edit_member').then(function(member_schema) {
            $scope.form = member_schema.form;
            $scope.schema = member_schema.schema;
            return $scope.loading = false;
          });
        }
      });
      return $scope.submit = function(form) {
        $scope.loading = true;
        return $scope.member.$put('self', {}, form).then(function(member) {
          $log.info("Successfully updated member");
          return $scope.loading = false;
        }, function(err) {
          $log.error("Failed to update member - " + err);
          return $scope.loading = false;
        });
      };
    };
    link = function(scope, element, attrs) {
      var base, base1;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = attrs.apiUrl);
      return (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
    };
    return {
      link: link,
      controller: controller,
      template: "<form sf-schema=\"schema\" sf-form=\"form\" sf-model=\"member\"\n  ng-submit=\"submit(member)\" ng-hide=\"loading\"></form>"
    };
  });

}).call(this);
