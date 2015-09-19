
/***
* @ngdoc controller
* @name BBAdmin.Controllers:DashboardContainer
*
* @description
* Controller DashboardContainer
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
* @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs read more}
*
 */

(function() {
  angular.module('BBAdmin.Controllers').controller('DashboardContainer', function($scope, $rootScope, $location, $modal) {
    var ModalInstanceCtrl;
    $scope.selectedBooking = null;
    $scope.poppedBooking = null;
    $scope.selectBooking = function(booking) {
      return $scope.selectedBooking = booking;
    };
    $scope.popupBooking = function(booking) {
      var modalInstance;
      $scope.poppedBooking = booking;
      modalInstance = $modal.open({
        templateUrl: 'full_booking_details',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: true,
        resolve: {
          items: (function(_this) {
            return function() {
              return {
                booking: booking
              };
            };
          })(this)
        }
      });
      return modalInstance.result.then((function(_this) {
        return function(selectedItem) {
          return $scope.selected = selectedItem;
        };
      })(this), (function(_this) {
        return function() {
          return console.log('Modal dismissed at: ' + new Date());
        };
      })(this));
    };
    ModalInstanceCtrl = function($scope, $modalInstance, items) {
      angular.extend($scope, items);
      $scope.ok = function() {
        console.log("closeing", items, items.booking && items.booking.self ? items.booking.$update() : void 0);
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    return $scope.popupTimeAction = function(prms) {
      var modalInstance;
      console.log(prms);
      return modalInstance = $modal.open({
        templateUrl: $scope.partial_url + 'time_popup',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: false,
        resolve: {
          items: (function(_this) {
            return function() {
              return prms;
            };
          })(this)
        }
      });
    };
  });

}).call(this);
