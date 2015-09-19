(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ServiceModel
  *
  * @description
  * This is ServiceModel in BB.Models module that creates Service object.
  *
  * <pre>
  * //Creates class Service that extends BaseModel
  * class Service extends BaseModel
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
  * @returns {object} Newly created Service object with the following set of methods:
  *
  * - Service()
  * - constructor(data)
  * - getPriceByDuration(dur)
  * - getCategoryPromise()
  * - days_array()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ServiceModel", function($q, BBModel, BaseModel) {
    var Service;
    return Service = (function(superClass) {
      extend(Service, superClass);

      function Service(data) {
        this.days_array = bind(this.days_array, this);
        this.getCategoryPromise = bind(this.getCategoryPromise, this);
        Service.__super__.constructor.apply(this, arguments);
        if (this.prices && this.prices.length > 0) {
          this.price = this.prices[0];
        }
        if (this.durations && this.durations.length > 0) {
          this.duration = this.durations[0];
        }
        if (!this.listed_durations) {
          this.listed_durations = this.durations;
        }
        if (this.listed_durations && this.listed_durations.length > 0) {
          this.listed_duration = this.listed_durations[0];
        }
        this.min_advance_datetime = moment().add(this.min_advance_period, 'seconds');
        this.max_advance_datetime = moment().add(this.max_advance_period, 'seconds');
      }

      Service.prototype.getPriceByDuration = function(dur) {
        var d, i, j, len, ref;
        ref = this.durations;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          d = ref[i];
          if (d === dur) {
            return this.prices[i];
          }
        }
      };

      Service.prototype.getCategoryPromise = function() {
        var prom;
        if (!this.$has('category')) {
          return null;
        }
        prom = this.$get('category');
        prom.then((function(_this) {
          return function(cat) {
            return _this.category = new BBModel.Category(cat);
          };
        })(this));
        return prom;
      };

      Service.prototype.days_array = function() {
        var arr, j, ref, ref1, str, x;
        arr = [];
        for (x = j = ref = this.min_bookings, ref1 = this.max_bookings; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
          str = "" + x + " day";
          if (x > 1) {
            str += "s";
          }
          arr.push({
            name: str,
            val: x
          });
        }
        return arr;
      };

      return Service;

    })(BaseModel);
  });

}).call(this);
