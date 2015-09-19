
/***
* @ngdoc service
* @name BB.Services:MemberBookingService
*
* @description
* Factory MemberBookingService
*
* @requires $q
* @requires SpaceCollections
* @requires $rootScope
* @requires BB.Services:MemberService
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - query(member, params)
* - cancel(member, booking)
* - update(booking)
* - flush(member, params)
*
 */

(function() {
  angular.module('BB.Services').factory("MemberBookingService", function($q, SpaceCollections, $rootScope, MemberService, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BB.Services:MemberBookingService
      *
      * @description
      * Method query
      *
      * @param {object} member member
      * @param {object} params params
      *
      * @returns {Promise} defer.reject(err) or defer.promise
      *
       */
      query: function(member, params) {
        var deferred;
        deferred = $q.defer();
        if (!member.$has('bookings')) {
          deferred.reject("member does not have bookings");
        } else {
          member.$get('bookings', params).then((function(_this) {
            return function(bookings) {
              var booking;
              if (angular.isArray(bookings)) {
                bookings = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = bookings.length; i < len; i++) {
                    booking = bookings[i];
                    results.push(new BBModel.Member.Booking(booking));
                  }
                  return results;
                })();
                return deferred.resolve(bookings);
              } else {
                return bookings.$get('bookings', params).then(function(bookings) {
                  bookings = (function() {
                    var i, len, results;
                    results = [];
                    for (i = 0, len = bookings.length; i < len; i++) {
                      booking = bookings[i];
                      results.push(new BBModel.Member.Booking(booking));
                    }
                    return results;
                  })();
                  return deferred.resolve(bookings);
                }, function(err) {
                  return deferred.reject(err);
                });
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name cancel
      * @methodOf BB.Services:MemberBookingService
      *
      * @description
      * Method cangel
      *
      * @param {object} member member
      * @param {object} booking booking
      *
      * @returns {Promise} defer.reject(err) or defer.promise
      *
       */
      cancel: function(member, booking) {
        var deferred;
        deferred = $q.defer();
        booking.$del('self').then((function(_this) {
          return function(b) {
            booking.deleted = true;
            b = new BBModel.Member.Booking(b);
            MemberService.refresh(member).then(function(member) {
              return member = member;
            }, function(err) {});
            return deferred.resolve(b);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name update
      * @methodOf BB.Services:MemberBookingService
      *
      * @description
      * Method update
      *
      * @param {object} booking booking
      *
      * @returns {Promise} defer.reject(err) or defer.promise
      *
       */
      update: function(booking) {
        var deferred;
        deferred = $q.defer();
        $rootScope.member.flushBookings();
        booking.$put('self', {}, booking).then((function(_this) {
          return function(booking) {
            var book;
            book = new BBModel.Member.Booking(booking);
            SpaceCollections.checkItems(book);
            return deferred.resolve(book);
          };
        })(this), (function(_this) {
          return function(err) {
            _.each(booking, function(value, key, booking) {
              if (key !== 'data' && key !== 'self') {
                return booking[key] = booking.data[key];
              }
            });
            return deferred.reject(err, new BBModel.Member.Booking(booking));
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name flush
      * @methodOf BB.Services:MemberBookingService
      *
      * @description
      * Method flush
      *
      * @param {object} member member
      * @param {object} params params
      *
      * @returns {function} member.$flush('bookings', params)
      *
       */
      flush: function(member, params) {
        if (member.$has('bookings')) {
          return member.$flush('bookings', params);
        }
      }
    };
  });

}).call(this);
