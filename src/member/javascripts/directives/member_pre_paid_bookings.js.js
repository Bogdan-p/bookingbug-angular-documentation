
/***
* @ngdoc directive
* @name BBMember.Directives:bbMemberPrePaidBookings
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:bbMemberPrePaidBookings
*
* # Has the following set of methods:
*
* -  link(scope, element, attrs)
*    - getBookings()
*
* @requires $rootScope
*
 */

(function() {
  angular.module('BBMember').directive('bbMemberPrePaidBookings', function($rootScope) {
    var link;
    link = function(scope, element, attrs) {
      var base, base1, getBookings;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      scope.loading = true;
      getBookings = function() {
        return scope.getPrePaidBookings({})["finally"](function() {
          return scope.loading = false;
        });
      };
      return getBookings();
    };
    return {
      link: link,
      controller: 'MemberBookings',
      templateUrl: 'member_pre_paid_bookings.html',
      scope: {
        apiUrl: '@',
        member: '='
      }
    };
  });

}).call(this);
