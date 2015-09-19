(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.BookingModel
  *
  * @description
  * <br> ---------------------------------------------------------------------------------
  * <br> NOTE
  * <br> This is the TEST file.
  * <br> Formatting of the documentation for this kind of functionality should be done first here
  * <br> !To avoid repetition and to mentain consistency.
  * <br> After the documentation for TEST file it is defined other files that have the same pattern can be also documented
  * <br> This should be the file that sets the STANDARD.
  * <br> ---------------------------------------------------------------------------------<br><br>
  * This is BookingModel for Admin in BB.Models module that creates Admin_Booking object.
  *
  * <pre>
  * //Creates class Admin_booking that extends BaseModel
  * class Admin_Booking extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  *
  *
  * @returns {object} Newly created Admin_Booking object with the following set of methods:
  *
  * - constructor(data)
  * - getPostData()
  * - statusTime()
  * - hasStatus(status)
  * - statusTime(status)
  * - sinceStatus(status)
  * - sinceStart(options)
  * - $update(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.BookingModel", function($q, BBModel, BaseModel) {
    var Admin_Booking;
    return Admin_Booking = (function(superClass) {
      extend(Admin_Booking, superClass);


      /***
      * @ngdoc method
      * @name constructor
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method constructor. Creates Admin_Booking object with following properties
      *
      * - datetime
      * - start
      * - end
      * - title
      * - time
      * - allDay
      * - className
      *
      * <pre>
      * if @status == 3 @className = "status_blocked"
      * else if @status == 4 @className = "status_booked"
      * </pre>
      *
      * @param {object} data Info
       */

      function Admin_Booking(data) {
        Admin_Booking.__super__.constructor.apply(this, arguments);
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add(this.duration, 'minutes');
        this.title = this.full_describe;
        this.time = this.start.hour() * 60 + this.start.minute();
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        }
      }


      /***
      * @ngdoc method
      * @name getPostData
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method getPostData. This method is added to Admin_Booking Object prototype. It returns the data object.
      *
      * data object is created with the following properties
      *
      * - date
      * - time
      * - duration
      * - id
      * - person_id
      *
      * if question == true it will be created an array called results
      *
      * <pre>
      * data.questions = (q.getPostData() for q in @questions)
      * </pre>
      *
      * @returns {object} data
       */

      Admin_Booking.prototype.getPostData = function() {
        var data, q;
        data = {};
        data.date = this.start.format("YYYY-MM-DD");
        data.time = this.start.hour() * 60 + this.start.minute();
        data.duration = this.duration;
        data.id = this.id;
        data.person_id = this.person_id;
        if (this.questions) {
          data.questions = (function() {
            var i, len, ref, results;
            ref = this.questions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              q = ref[i];
              results.push(q.getPostData());
            }
            return results;
          }).call(this);
        }
        return data;
      };


      /***
      * @ngdoc method
      * @name hasStatus
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method hasStatus. This method is added to Admin_Booking Object prototype.
      *
      * @param {object} status Info
      *
      * @returns {object} multi_status[status]
      *
       */

      Admin_Booking.prototype.hasStatus = function(status) {
        return this.multi_status[status] != null;
      };


      /***
      * @ngdoc method
      * @name statusTime
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method statusTime. This method is added to Admin_Booking Object prototype.
      *
      * @param {object} status Info
      *
      * @returns {date} null or new date based on multi_status[status] if multi_status[status] is true
       */

      Admin_Booking.prototype.statusTime = function(status) {
        if (this.multi_status[status]) {
          return moment(this.multi_status[status]);
        } else {
          return null;
        }
      };


      /***
      * @ngdoc method
      * @name sinceStatus
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method sinceStatus. This method is added to Admin_Booking Object prototype.
      *
      * @param {object} status Info
      *
      * @returns {Number} Math.floor()
       */

      Admin_Booking.prototype.sinceStatus = function(status) {
        var s;
        s = this.statusTime(status);
        if (!s) {
          return 0;
        }
        return Math.floor((moment().unix() - s.unix()) / 60);
      };


      /***
      * @ngdoc method
      * @name sinceStart
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method sinceStart. This method is added to Admin_Booking Object prototype.
      *
      * @param {object} options Info
      *
      * @returns {Number} Math.floor()
       */

      Admin_Booking.prototype.sinceStart = function(options) {
        var s, start;
        start = this.datetime.unix();
        if (!options) {
          return Math.floor((moment().unix() - start) / 60);
        }
        if (options.later) {
          s = this.statusTime(options.later).unix();
          if (s > start) {
            return Math.floor((moment().unix() - s) / 60);
          }
        }
        if (options.earlier) {
          s = this.statusTime(options.earlier).unix();
          if (s < start) {
            return Math.floor((moment().unix() - s) / 60);
          }
        }
        return Math.floor((moment().unix() - start) / 60);
      };


      /***
      * @ngdoc method
      * @name $update
      * @methodOf BB.Models:Admin.BookingModel
      *
      * @description
      * Method $update. This method is added to Admin_Booking Object prototype.
      *
      * @param {object} data Info
      *
      * @returns {object} Admin_Booking
       */

      Admin_Booking.prototype.$update = function(data) {
        data || (data = this.getPostData());
        return this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            return _this.constructor(res);
          };
        })(this));
      };

      return Admin_Booking;

    })(BaseModel);
  });

}).call(this);
