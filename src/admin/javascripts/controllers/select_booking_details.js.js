
/***
* @ngdoc controller
* @name BBAdmin.Controllers:SelectedBookingDetails
*
* @description
* Controller SelectedBookingDetails
*
* @param {object} $scope Scope is an object that refers to the application mode.
* <br>
* {@link https://docs.angularjs.org/guide/scope read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {service} $location The $location service parses the URL in the browser address bar
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$location read more}
*
* @param {service} AdminBookingService Service.
*
 */

(function() {
  angular.module('BBAdmin.Controllers').controller('SelectedBookingDetails', function($scope, $location, AdminBookingService, $rootScope) {
    return $scope.$watch('selectedBooking', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue) {
          $scope.booking = newValue;
          return $scope.showItemView = "/view/dash/booking_details";
        }
      };
    })(this));
  });

}).call(this);
