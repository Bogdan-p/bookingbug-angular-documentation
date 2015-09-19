(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BBAdmin.Directives:bbPeopleList
  * @restrict AE
  *
  * @description
  * Directive bbPeopleList
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
  angular.module('BBAdmin.Directives').directive('bbPeopleList', function($rootScope) {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: function($scope, $rootScope, PersonService, $q, BBModel, PersonModel) {
        $rootScope.connection_started.then(function() {
          return $scope.bb.company.getPeoplePromise().then(function(people) {
            var i, len, person, results;
            $scope.people = people;
            results = [];
            for (i = 0, len = people.length; i < len; i++) {
              person = people[i];
              results.push(person.show = true);
            }
            return results;
          });
        });
        $scope.show_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = true);
          }
          return results;
        };
        return $scope.hide_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = false);
          }
          return results;
        };
      },
      link: function(scope, element, attrs) {}
    };
  });


  /***
  * @ngdoc directive
  * @name BBAdmin.Directives:bbBookingList
  * @restrict AE
  *
  * @description
  * Directive bbBookingList
  *
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

  angular.module('BBAdmin.Directives').directive('bbBookingList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        bookings: '=',
        cancelled: '=',
        params: '='
      },
      templateUrl: function(tElm, tAttrs) {
        return tAttrs.template;
      },
      controller: function($scope, $filter) {
        var status;
        $scope.title = $scope.params.title;
        status = $scope.params.status;
        return $scope.$watch(function() {
          return $scope.bookings;
        }, function() {
          var bookings, cancelled;
          bookings = $scope.bookings;
          cancelled = $scope.cancelled;
          if (cancelled == null) {
            cancelled = false;
          }
          if ((bookings != null)) {
            bookings = $filter('filter')(bookings, function(booking) {
              var ret;
              ret = booking.is_cancelled === cancelled;
              if ((status != null)) {
                ret &= booking.hasStatus(status);
              } else {
                ret &= (booking.multi_status == null) || Object.keys(booking.multi_status).length === 0;
              }
              ret &= booking.status === 4;
              return ret;
            });
            $scope.relevantBookings = $filter('orderBy')(bookings, 'datetime');
          }
          return $scope.relevantBookings != null ? $scope.relevantBookings : $scope.relevantBookings = [];
        });
      }
    };
  });

}).call(this);
