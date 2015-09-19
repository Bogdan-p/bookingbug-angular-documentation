
/***
* @ngdoc directive
* @name BBMember.Directives:memberBookings
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:memberBookings
*
* # Has the following set of methods:
*
* - link(scope, element, attrs)
*
* @requires $rootScope
*
 */

(function() {
  angular.module('BBMember').directive('memberBookings', function($rootScope) {
    var link;
    link = function(scope, element, attrs) {
      var base, base1;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      return (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
    };
    return {
      link: link,
      templateUrl: 'member_bookings_tabs.html',
      scope: {
        apiUrl: '@',
        member: '='
      }
    };
  });

}).call(this);
