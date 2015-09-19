
/***
* @ngdoc service
* @name BB.Services:MemberPrePaidBookingService
*
* @description
* Factory MemberPrePaidBookingService
*
* @requires $q
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(member, params)
*
 */

(function() {
  angular.module('BB.Services').factory("MemberPrePaidBookingService", function($q, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BB.Services:MemberPrePaidBookingService
      *
      * @description
      * Method refresh
      *
      * @param {object} member member
      * @param {object} params params
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
      *
       */
      query: function(member, params) {
        var deferred;
        deferred = $q.defer();
        if (!member.$has('pre_paid_bookings')) {
          deferred.reject("member does not have pre paid bookings");
        } else {
          member.$get('pre_paid_bookings', params).then((function(_this) {
            return function(bookings) {
              var booking;
              if (angular.isArray(bookings)) {
                bookings = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = bookings.length; i < len; i++) {
                    booking = bookings[i];
                    results.push(new BBModel.Member.PrePaidBooking(booking));
                  }
                  return results;
                })();
                return deferred.resolve(bookings);
              } else {
                return bookings.$get('pre_paid_bookings', params).then(function(bookings) {
                  bookings = (function() {
                    var i, len, results;
                    results = [];
                    for (i = 0, len = bookings.length; i < len; i++) {
                      booking = bookings[i];
                      results.push(new BBModel.Member.PrePaidBooking(booking));
                    }
                    return results;
                  })();
                  return deferred.resolve(bookings);
                });
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
