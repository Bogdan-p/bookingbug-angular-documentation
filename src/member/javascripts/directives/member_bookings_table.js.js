
/***
* @ngdoc directive
* @name BBMember.Directives:memberBookingsTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBMember.Directives:memberBookingsTable
*
* # Has the following set of methods:
*
* - controller($scope, $modal)
* - $scope.edit(id)
* - getBookings($scope, member)
* - link(scope, element, attrs)
*
* @requires $modal
* @requires $log
* @requires $rootScope
* @requires BBMember.Services:MemberLoginService
* @requires BB.Services:MemberBookingService
* @requires $compile
* @requires $templateCache
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBMember').directive('memberBookingsTable', function($modal, $log, $rootScope, MemberLoginService, MemberBookingService, $compile, $templateCache, ModalForm) {
    var controller, link;
    controller = function($scope, $modal) {
      var getBookings;
      $scope.loading = true;
      $scope.fields || ($scope.fields = ['describe', 'full_describe']);
      $scope.$watch('member', function(member) {
        if (member != null) {
          return getBookings($scope, member);
        }
      });
      $scope.edit = function(id) {
        var booking;
        booking = _.find($scope.booking_models, function(b) {
          return b.id === id;
        });
        return booking.getAnswersPromise().then(function(answers) {
          var answer, i, len, ref;
          ref = answers.answers;
          for (i = 0, len = ref.length; i < len; i++) {
            answer = ref[i];
            booking["question" + answer.question_id] = answer.value;
          }
          return ModalForm.edit({
            model: booking,
            title: 'Booking Details',
            templateUrl: 'edit_booking_modal_form.html'
          });
        });
      };
      return getBookings = function($scope, member) {
        var params;
        params = {
          start_date: moment().format('YYYY-MM-DD')
        };
        return MemberBookingService.query(member, params).then(function(bookings) {
          $scope.booking_models = bookings;
          $scope.bookings = _.map(bookings, function(booking) {
            return _.pick(booking, 'id', 'full_describe', 'describe');
          });
          return $scope.loading = false;
        }, function(err) {
          $log.error(err.data);
          return $scope.loading = false;
        });
      };
    };
    link = function(scope, element, attrs) {
      var base, base1;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      return (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
    };
    return {
      link: link,
      controller: controller,
      templateUrl: 'member_bookings_table.html',
      scope: {
        apiUrl: '@',
        fields: '=?',
        member: '='
      }
    };
  });

}).call(this);
