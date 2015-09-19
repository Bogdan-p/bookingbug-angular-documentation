(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:DayModel
  *
  * @description
  * This is DayModel in BB.Models module that creates Day object.
  *
  * <pre>
  * //Creates class Day that extends BaseModel
  * class Day extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Day object with the following set of methods:
  *
  * - constructor(data)
  * - day
  * - off(month)
  * - class(month)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("DayModel", function($q, BBModel, BaseModel) {
    var Day;
    return Day = (function(superClass) {
      extend(Day, superClass);

      function Day(data) {
        Day.__super__.constructor.apply(this, arguments);
        this.string_date = this.date;
        this.date = moment(this.date);
      }

      Day.prototype.day = function() {
        return this.date.date();
      };

      Day.prototype.off = function(month) {
        return this.date.month() !== month;
      };

      Day.prototype["class"] = function(month) {
        var str;
        str = "";
        if (this.date.month() < month) {
          str += "off off-prev";
        }
        if (this.date.month() > month) {
          str += "off off-next";
        }
        if (this.spaces === 0) {
          str += " not-avail";
        }
        return str;
      };

      return Day;

    })(BaseModel);
  });

}).call(this);
