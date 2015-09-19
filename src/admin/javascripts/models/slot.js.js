(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.SlotModel
  *
  * @description
  * This is SlotModel for Admin in BB.Models module that creates Admin_Slot object.
  *
  * <pre>
  * //Creates class Admin_Slot that extends TimeSlotModel
  * class Admin_Slot extends TimeSlotModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  *
  * @param {model} TimeSlotModel Info
  *
  * @returns {object} Newly created Admin_Slot object.
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.SlotModel", function($q, BBModel, BaseModel, TimeSlotModel) {
    var Admin_Slot;
    return Admin_Slot = (function(superClass) {
      extend(Admin_Slot, superClass);


      /***
      * @ngdoc method
      * @name constructor
      * @methodOf BB.Models:Admin.SlotModel
      *
      * @description
      * Method constructor. Creates Admin_Slot object with following properties
      *
      * - title
      * - status
      * - datetime
      * - title
      * - start
      * - end
      * - time
      * - allDay
      * - className
      *
      * <pre>
      * if @status == 3 @className = "status_blocked"
      * else if @status == 4  @className = "status_booked"
      * else if @status == 0 @className = "status_available"
      * </pre>
      *
      * @param {object} data Info
       */

      function Admin_Slot(data) {
        Admin_Slot.__super__.constructor.call(this, data);
        this.title = this.full_describe;
        if (this.status === 0) {
          this.title = "Available";
        }
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add(this.duration, 'minutes');
        this.time = this.start.hour() * 60 + this.start.minute();
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        } else if (this.status === 0) {
          this.className = "status_available";
        }
      }

      return Admin_Slot;

    })(TimeSlotModel);
  });

}).call(this);
