(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Booking = (function(superClass) {
    extend(Booking, superClass);

    function Booking() {
      return Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.prototype.checkItem = function(item) {
      return Booking.__super__.checkItem.apply(this, arguments);
    };

    Booking.prototype.matchesParams = function(item) {
      if (this.params.start_date != null) {
        if (this.start_date == null) {
          this.start_date = moment(this.params.date);
        }
        if (this.start_date.isAfter(item.start)) {
          return false;
        }
      }
      if (this.params.end_date != null) {
        if (this.end_date == null) {
          this.end_date = moment(this.params.end_date);
        }
        if (this.end_date.isBefore(item.start.clone().startOf('day'))) {
          return false;
        }
      }
      if (!this.params.include_cancelled && item.is_cancelled) {
        return false;
      }
      return true;
    };

    return Booking;

  })(window.Collection.Base);


  /***
  * @ngdoc object
  * @name BB.Services:BookingCollections
  *
  * @description
  * It creates new Booking Collections
  *
  * # Has the following set of methods:
  * - $get
  *
   */

  angular.module('BB.Services').provider("BookingCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);
