
/***
* @ngdoc directive
* @name BBMember.Directives:bbMemberPastBookings
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:bbMemberPastBookings
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
  angular.module('BBMember').directive('bbMemberPastBookings', function($rootScope) {
    var link;
    link = function(scope, element, attrs) {
      var base, base1, getBookings;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      getBookings = function() {
        return scope.getPastBookings();
      };
      return getBookings();
    };
    return {
      link: link,
      controller: 'MemberBookings',
      templateUrl: 'member_past_bookings.html',
      scope: {
        apiUrl: '@',
        member: '='
      }
    };
  });

}).call(this);
