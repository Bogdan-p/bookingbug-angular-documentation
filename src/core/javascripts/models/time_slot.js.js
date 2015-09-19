(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:TimeSlotModel
  *
  * @description
  * This is TimeSlotModel in BB.Models module that creates TimeSlot object.
  *
  * <pre>
  * //Creates class TimeSlot that extends BaseModel
  * class TimeSlot extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created TimeSlot object with the following set of methods:
  *
  * - constructor(data, service)
  * - print_time
  * - print_end_time(dur)
  * - print_time12(show_suffix = true)
  * - print_end_time12(show_suffix = true, dur)
  * - availability
  * - select
  * - disable(reason)
  * - enable
  * - status
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("TimeSlotModel", function($q, $window, BBModel, BaseModel) {
    var TimeSlot;
    return TimeSlot = (function(superClass) {
      extend(TimeSlot, superClass);

      function TimeSlot(data, service) {
        TimeSlot.__super__.constructor.call(this, data);
        this.service = service;
        this.time_12 = this.print_time12();
        this.time_24 = this.print_time();
      }

      TimeSlot.prototype.print_time = function() {
        var min, t;
        if (this.start) {
          return this.start.format("h:mm");
        } else {
          t = this.get('time');
          if (t % 60 < 10) {
            min = "0" + t % 60;
          } else {
            min = t % 60;
          }
          return "" + Math.floor(t / 60) + ":" + min;
        }
      };

      TimeSlot.prototype.print_end_time = function(dur) {
        var min, t;
        if (this.end) {
          return this.end.format("h:mm");
        } else {
          if (!dur) {
            dur = this.service.listed_durations[0];
          }
          t = this.get('time') + dur;
          if (t % 60 < 10) {
            min = "0" + t % 60;
          } else {
            min = t % 60;
          }
          return "" + Math.floor(t / 60) + ":" + min;
        }
      };

      TimeSlot.prototype.print_time12 = function(show_suffix) {
        var h, m, suffix, t, time;
        if (show_suffix == null) {
          show_suffix = true;
        }
        t = this.get('time');
        h = Math.floor(t / 60);
        m = t % 60;
        suffix = 'am';
        if (h >= 12) {
          suffix = 'pm';
        }
        if (h > 12) {
          h -= 12;
        }
        time = $window.sprintf("%d.%02d", h, m);
        if (show_suffix) {
          time += suffix;
        }
        return time;
      };

      TimeSlot.prototype.print_end_time12 = function(show_suffix, dur) {
        var end_time, h, m, suffix, t;
        if (show_suffix == null) {
          show_suffix = true;
        }
        dur = null;
        if (!dur) {
          if (this.service.listed_duration != null) {
            dur = this.service.listed_duration;
          } else {
            dur = this.service.listed_durations[0];
          }
        }
        t = this.get('time') + dur;
        h = Math.floor(t / 60);
        m = t % 60;
        suffix = 'am';
        if (h >= 12) {
          suffix = 'pm';
        }
        if (h > 12) {
          h -= 12;
        }
        end_time = $window.sprintf("%d.%02d", h, m);
        if (show_suffix) {
          end_time += suffix;
        }
        return end_time;
      };

      TimeSlot.prototype.availability = function() {
        return this.avail;
      };

      TimeSlot.prototype.select = function() {
        return this.selected = true;
      };

      TimeSlot.prototype.unselect = function() {
        if (this.selected) {
          return delete this.selected;
        }
      };

      TimeSlot.prototype.disable = function(reason) {
        this.disabled = true;
        return this.disabled_reason = reason;
      };

      TimeSlot.prototype.enable = function() {
        if (this.disabled) {
          delete this.disabled;
        }
        if (this.disabled_reason) {
          return delete this.disabled_reason;
        }
      };

      TimeSlot.prototype.status = function() {
        if (this.selected) {
          return "selected";
        }
        if (this.disabled) {
          return "disabled";
        }
        if (this.availability() > 0) {
          return "enabled";
        }
        return "disabled";
      };

      return TimeSlot;

    })(BaseModel);
  });

}).call(this);
