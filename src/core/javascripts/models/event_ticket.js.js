(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:EventTicketModel
  *
  * @description
  * This is EventTicketModel in BB.Models module that creates EventTicket object.
  *
  * <pre>
  * //Creates class EventTicket that extends BaseModel
  * class EventTicket extends BaseModel
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
  * @returns {object} Newly created EventTicket object with the following set of methods:
  *
  * - constructor(data)
  * - fullName()
  * - getRange(cap)
  * - totalQty()
  * - getMax(cap, ev = null)
  * - add(value)
  * - subtract(value)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("EventTicketModel", function($q, BBModel, BaseModel) {
    var EventTicket;
    return EventTicket = (function(superClass) {
      extend(EventTicket, superClass);

      function EventTicket(data) {
        var ms;
        EventTicket.__super__.constructor.call(this, data);
        this.max = this.max_num_bookings;
        if (this.max_spaces) {
          ms = this.max_spaces;
          if (this.counts_as) {
            ms = this.max_spaces / this.counts_as;
          }
          if (ms < max) {
            this.max = ms;
          }
        }
      }

      EventTicket.prototype.fullName = function() {
        if (this.pool_name) {
          return this.pool_name + " - " + this.name;
        }
        return this.name;
      };

      EventTicket.prototype.getRange = function(cap) {
        var c, i, ref, ref1, results;
        if (cap) {
          c = cap;
          if (this.counts_as) {
            c = cap / this.counts_as;
          }
          if (c + this.min_num_bookings < this.max) {
            this.max = c + this.min_num_bookings;
          }
        }
        return [0].concat((function() {
          results = [];
          for (var i = ref = this.min_num_bookings, ref1 = this.max; ref <= ref1 ? i <= ref1 : i >= ref1; ref <= ref1 ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this));
      };

      EventTicket.prototype.totalQty = function() {
        if (!this.qty) {
          return 0;
        }
        if (!this.counts_as) {
          return this.qty;
        }
        return this.qty * this.counts_as;
      };

      EventTicket.prototype.getMax = function(cap, ev) {
        var c, i, len, live_max, ref, ticket, used;
        if (ev == null) {
          ev = null;
        }
        live_max = this.max;
        if (ev) {
          used = 0;
          ref = ev.tickets;
          for (i = 0, len = ref.length; i < len; i++) {
            ticket = ref[i];
            used += ticket.totalQty();
          }
          if (this.qty) {
            used = used - this.totalQty();
          }
          if (this.counts_as) {
            used = Math.ceil(used / this.counts_as);
          }
          live_max = live_max - used;
          if (live_max < 0) {
            live_max = 0;
          }
        }
        if (cap) {
          c = cap;
          if (this.counts_as) {
            c = cap / this.counts_as;
          }
          if (c + this.min_num_bookings < live_max) {
            return c + this.min_num_bookings;
          }
        }
        return live_max;
      };

      EventTicket.prototype.add = function(value) {
        if (!this.qty) {
          this.qty = 0;
        }
        this.qty = parseInt(this.qty);
        if (angular.isNumber(this.qty) && (this.qty >= this.max && value > 0) || (this.qty === 0 && value < 0)) {
          return;
        }
        return this.qty += value;
      };

      EventTicket.prototype.subtract = function(value) {
        return this.add(-value);
      };

      return EventTicket;

    })(BaseModel);
  });

}).call(this);
