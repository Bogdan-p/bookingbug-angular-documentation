(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Purchase.BookingModel
  *
  * @description
  * This is Purchase BookingModel in BB.Models module that creates Booking object.
  *
  * <pre>
  * //Creates class Purchase_Booking that extends BaseModel
  * class Purchase_Booking extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires $window
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  * @requires $bbug
  *
  * @returns {Promise} Newly created Booking object with the following set of methods:
  *
  * - constructor(data)
  * - getGroup()
  * - getColour()
  * - getCompany()
  * - getAnswersPromise()
  * - getSurveyAnswersPromise()
  * - getPostData()
  * - checkReady
  * - printed_price()
  * - getDateString()
  * - getTimeInMins()
  * - getAttachments()
  * - canCancel()
  * - canMove()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Purchase.BookingModel", function($q, $window, BBModel, BaseModel, $bbug) {
    var Purchase_Booking;
    return Purchase_Booking = (function(superClass) {
      extend(Purchase_Booking, superClass);

      function Purchase_Booking(data) {
        this.getSurveyAnswersPromise = bind(this.getSurveyAnswersPromise, this);
        this.getAnswersPromise = bind(this.getAnswersPromise, this);
        Purchase_Booking.__super__.constructor.call(this, data);
        this.ready = false;
        this.datetime = moment.parseZone(this.datetime);
        if (this.time_zone) {
          this.datetime.tz(this.time_zone);
        }
        this.original_datetime = moment(this.datetime);
        this.end_datetime = moment.parseZone(this.end_datetime);
        if (this.time_zone) {
          this.end_datetime.tz(this.time_zone);
        }
      }

      Purchase_Booking.prototype.getGroup = function() {
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

      Purchase_Booking.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Purchase_Booking.prototype.getCompany = function() {
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

      Purchase_Booking.prototype.getAnswersPromise = function() {
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

      Purchase_Booking.prototype.getSurveyAnswersPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.survey_answers) {
          defer.resolve(this.survey_answers);
        }
        if (this._data.$has('survey_answers')) {
          this._data.$get('survey_answers').then((function(_this) {
            return function(survey_answers) {
              var a;
              _this.survey_answers = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = survey_answers.length; i < len; i++) {
                  a = survey_answers[i];
                  results.push(new BBModel.Answer(a));
                }
                return results;
              })();
              return defer.resolve(_this.survey_answers);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Booking.prototype.getPostData = function() {
        var data, formatted_survey_answers, i, len, q, ref;
        data = {};
        data.attended = this.attended;
        data.client_id = this.client_id;
        data.company_id = this.company_id;
        data.time = (this.datetime.hour() * 60) + this.datetime.minute();
        data.date = this.datetime.toISODate();
        data.deleted = this.deleted;
        data.describe = this.describe;
        data.duration = this.duration;
        data.end_datetime = this.end_datetime;
        if (this.event) {
          data.event_id = this.event.id;
        }
        if (this.time && this.time.event_id) {
          data.event_id = this.time.event_id;
        }
        data.full_describe = this.full_describe;
        data.id = this.id;
        data.min_cancellation_time = this.min_cancellation_time;
        data.on_waitlist = this.on_waitlist;
        data.paid = this.paid;
        data.person_name = this.person_name;
        data.price = this.price;
        data.purchase_id = this.purchase_id;
        data.purchase_ref = this.purchase_ref;
        data.quantity = this.quantity;
        data.self = this.self;
        if (this.move_item_id) {
          data.move_item_id = this.move_item_id;
        }
        if (this.srcBooking) {
          data.move_item_id = this.srcBooking.id;
        }
        if (this.person) {
          data.person_id = this.person.id;
        }
        if (this.service) {
          data.service_id = this.service.id;
        }
        if (this.resource) {
          data.resource_id = this.resource.id;
        }
        if (this.item_details) {
          data.questions = this.item_details.getPostData();
        }
        data.service_name = this.service_name;
        data.settings = this.settings;
        if (this.status) {
          data.status = this.status;
        }
        if (this.email != null) {
          data.email = this.email;
        }
        if (this.email_admin != null) {
          data.email_admin = this.email_admin;
        }
        formatted_survey_answers = [];
        if (this.survey_questions) {
          data.survey_questions = this.survey_questions;
          ref = this.survey_questions;
          for (i = 0, len = ref.length; i < len; i++) {
            q = ref[i];
            formatted_survey_answers.push({
              value: q.answer,
              outcome: q.outcome,
              detail_type_id: q.id,
              price: q.price
            });
          }
          data.survey_answers = formatted_survey_answers;
        }
        return data;
      };

      Purchase_Booking.prototype.checkReady = function() {
        if (this.datetime && this.id && this.purchase_ref) {
          return this.ready = true;
        }
      };

      Purchase_Booking.prototype.printed_price = function() {
        if (parseFloat(this.price) % 1 === 0) {
          return "£" + parseInt(this.price);
        }
        return $window.sprintf("£%.2f", parseFloat(this.price));
      };

      Purchase_Booking.prototype.getDateString = function() {
        return this.datetime.toISODate();
      };

      Purchase_Booking.prototype.getTimeInMins = function() {
        return (this.datetime.hour() * 60) + this.datetime.minute();
      };

      Purchase_Booking.prototype.getAttachments = function() {
        if (this.attachments) {
          return this.attachments;
        }
        if (this.$has('attachments')) {
          return this._data.$get('attachments').then((function(_this) {
            return function(atts) {
              _this.attachments = atts.attachments;
              return _this.attachments;
            };
          })(this));
        }
      };

      Purchase_Booking.prototype.canCancel = function() {
        return moment(this.min_cancellation_time).isAfter(moment());
      };

      Purchase_Booking.prototype.canMove = function() {
        return this.canCancel();
      };

      return Purchase_Booking;

    })(BaseModel);
  });

}).call(this);
