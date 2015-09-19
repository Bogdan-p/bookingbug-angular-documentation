
/***
* @ngdoc object
* @name BB.Models:Purchase.CourseBookingModel
*
* @description
* This is Pourse Booking in BB.Models module that creates Course Booking object.
*
* <pre>
* //Creates class Purchase_Course_Booking that extends BaseModel
* class Purchase_Course_Booking extends BaseModel
* </pre>
*
* @requires $q
* @requires BB.Models:BBModel
* @requires BB.Models:BaseModel
*
* @returns {Promise} Newly created Course Booking object with the following set of methods:
*
* - constructor(data)
* - getBookings
*
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Purchase.CourseBookingModel", function($q, BBModel, BaseModel) {
    var Purchase_Course_Booking;
    return Purchase_Course_Booking = (function(superClass) {
      extend(Purchase_Course_Booking, superClass);

      function Purchase_Course_Booking(data) {
        this.getBookings = bind(this.getBookings, this);
        Purchase_Course_Booking.__super__.constructor.call(this, data);
      }

      Purchase_Course_Booking.prototype.getBookings = function() {
        var defer;
        defer = $q.defer();
        if (this.bookings) {
          defer.resolve(this.bookings);
        }
        if (this._data.$has('bookings')) {
          this._data.$get('bookings').then((function(_this) {
            return function(bookings) {
              var b;
              _this.bookings = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Purchase.Booking(b));
                }
                return results;
              })();
              _this.bookings.sort(function(a, b) {
                return a.datetime.unix() - b.datetime.unix();
              });
              return defer.resolve(_this.bookings);
            };
          })(this));
        } else {
          this.bookings = [];
          defer.resolve(this.bookings);
        }
        return defer.promise;
      };

      return Purchase_Course_Booking;

    })(BaseModel);
  });

}).call(this);
