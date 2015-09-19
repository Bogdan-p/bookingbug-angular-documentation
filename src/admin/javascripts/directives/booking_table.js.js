
/***
* @ngdoc directive
* @name BBAdmin.Directives:bookingTable
* @restrict E
*
* @description
* Directive bookingTable
*
* @param {service} $modal $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs read more}
*
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log read more}
*
* @param {service} AdminCompanyService Service AdminCompanyService
* @param {service} AdminBookingService Service AdminBookingService
* @param {service} ModalForm Service ModalForm
*
* @example Example that demonstrates basic bookingTable.
  <example>
    <file name="index.html">
      <div class="my-example">
      </div>
    </file>

    <file name="style.css">
      .my-example {
        background: green;
        widht: 200px;
        height: 200px;
      }
    </file>
  </example>
 */

(function() {
  angular.module('BBAdmin').directive('bookingTable', function(AdminCompanyService, AdminBookingService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'datetime'];
      $scope.getBookings = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminBookingService.query(params).then(function(bookings) {
          return $scope.bookings = bookings;
        });
      };
      $scope.newBooking = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Booking',
          new_rel: 'new_booking',
          post_rel: 'bookings',
          success: function(booking) {
            return $scope.bookings.push(booking);
          }
        });
      };
      return $scope.edit = function(booking) {
        return ModalForm.edit({
          model: booking,
          title: 'Edit Booking'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getBookings();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getBookings();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'booking_table_main.html'
    };
  });

}).call(this);
