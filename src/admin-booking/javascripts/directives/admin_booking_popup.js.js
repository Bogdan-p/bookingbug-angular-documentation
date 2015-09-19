
/***
* @ngdoc directive
* @name BB.Directives:AdminBookingPopup
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:AdminBookingPopup
*
* # Has the following set of methods:
*
* - controller($scope)
* - link(scope, element, attrs)
*
* @requires BB.Directives:AdminBookingPopup
*
 */

(function() {
  angular.module('BBAdminBooking').directive('bbAdminBookingPopup', function(AdminBookingPopup) {
    var controller, link;
    controller = function($scope) {
      return $scope.open = function() {
        return AdminBookingPopup.open();
      };
    };
    link = function(scope, element, attrs) {
      return element.bind('click', function() {
        return scope.open();
      });
    };
    return {
      link: link,
      controller: controller
    };
  });

}).call(this);
