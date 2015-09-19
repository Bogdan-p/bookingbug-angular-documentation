
/***
* @ngdoc directive
* @name BBMember.Directives:bbMemberUpcomingBookings
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:bbMemberUpcomingBookings
*
* # Has the following set of methods:
*
* - link(scope, element, attrs)
*
* @requires $rootScope
*
 */

(function() {
  angular.module('BBMember').directive('bbMemberUpcomingBookings', function($rootScope) {
    var link;
    link = function(scope, element, attrs) {
      var base, base1, getBookings;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      getBookings = function() {
        return scope.getUpcomingBookings();
      };
      scope.$on('updateBookings', function() {
        scope.flushBookings();
        return getBookings();
      });
      return getBookings();
    };
    return {
      link: link,
      controller: 'MemberBookings',
      templateUrl: 'member_upcoming_bookings.html',
      scope: {
        apiUrl: '@',
        member: '='
      }
    };
  });

}).call(this);
