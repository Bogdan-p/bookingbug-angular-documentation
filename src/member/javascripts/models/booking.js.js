(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Member.BookingModel
  *
  * @description
  * This is Member.BookingModel in BB.Models module that creates Member Booking object.
  *
  * <pre>
  * //Creates class Member_Booking that extends BaseModel
  * class Member_Booking extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires $window
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  * @requires $bbug
  *
  * @returns {object} Newly created Member Booking object with the following set of methods:
  *
  * - constructor(data)
  * - getGroup()
  * - getColour()
  * - getCompany()
  * - getAnswers()
  * - printed_price()
  * - getMemberPromise()
  * - canCancel()
  * - canMove()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Member.BookingModel", function($q, $window, BBModel, BaseModel, $bbug) {
    var Member_Booking;
    return Member_Booking = (function(superClass) {
      extend(Member_Booking, superClass);

      function Member_Booking(data) {
        this.getMemberPromise = bind(this.getMemberPromise, this);
        Member_Booking.__super__.constructor.call(this, data);
        this.datetime = moment.parseZone(this.datetime);
        if (this.time_zone) {
          this.datetime.tz(this.time_zone);
        }
        this.end_datetime = moment.parseZone(this.end_datetime);
        if (this.time_zone) {
          this.end_datetime.tz(this.time_zone);
        }
      }

      Member_Booking.prototype.getGroup = function() {
        if (this.group) {
          return this.group;
        }
        if (this._data.$has('event_groups')) {
          return this._data.$get('event_groups').then((function(_this) {
            return function(group) {
              _this.group = group;
              return _this.group;
            };
          })(this));
        }
      };

      Member_Booking.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Member_Booking.prototype.getCompany = function() {
        if (this.company) {
          return this.company;
        }
        if (this.$has('company')) {
          return this._data.$get('company').then((function(_this) {
            return function(company) {
              _this.company = new BBModel.Company(company);
              return _this.company;
            };
          })(this));
        }
      };

      Member_Booking.prototype.getAnswers = function() {
        var defer;
        defer = $q.defer();
        if (this.answers) {
          defer.resolve(this.answers);
        }
        if (this._data.$has('answers')) {
          this._data.$get('answers').then((function(_this) {
            return function(answers) {
              var a;
              _this.answers = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = answers.length; i < len; i++) {
                  a = answers[i];
                  results.push(new BBModel.Answer(a));
                }
                return results;
              })();
              return defer.resolve(_this.answers);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Member_Booking.prototype.printed_price = function() {
        if (parseFloat(this.price) % 1 === 0) {
          return "£" + this.price;
        }
        return $window.sprintf("£%.2f", parseFloat(this.price));
      };

      Member_Booking.prototype.getMemberPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.member) {
          defer.resolve(this.member);
        }
        if (this._data.$has('member')) {
          this._data.$get('member').then((function(_this) {
            return function(member) {
              _this.member = new BBModel.Member.Member(member);
              return defer.resolve(_this.member);
            };
          })(this));
        }
        return defer.promise;
      };

      Member_Booking.prototype.canCancel = function() {
        return moment(this.min_cancellation_time).isAfter(moment());
      };

      Member_Booking.prototype.canMove = function() {
        return this.canCancel();
      };

      return Member_Booking;

    })(BaseModel);
  });

}).call(this);
