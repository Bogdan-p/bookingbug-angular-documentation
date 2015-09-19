(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:EventChainModel
  *
  * @description
  * This is EventChainModel in BB.Models module that creates EventChain object.
  *
  * <pre>
  * //Creates class EventChain that extends BaseModel
  * class EventChain extends BaseModel
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
  * @returns {object} Newly created EventChain object with the following set of methods:
  *
  * - name()
  * - isSingleBooking()
  * - hasTickets()
  * - getTickets()
  * - adjustTicketsForRemaining()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("EventChainModel", function($q, BBModel, BaseModel) {
    var EventChain;
    return EventChain = (function(superClass) {
      extend(EventChain, superClass);

      function EventChain() {
        return EventChain.__super__.constructor.apply(this, arguments);
      }

      EventChain.prototype.name = function() {
        return this._data.name;
      };

      EventChain.prototype.isSingleBooking = function() {
        return this.max_num_bookings === 1 && !this.$has('ticket_sets');
      };

      EventChain.prototype.hasTickets = function() {
        return this.$has('ticket_sets');
      };

      EventChain.prototype.getTickets = function() {
        var def;
        def = $q.defer();
        if (this.tickets) {
          def.resolve(this.tickets);
        } else {
          if (this.$has('ticket_sets')) {
            this.$get('ticket_sets').then((function(_this) {
              return function(tickets) {
                var i, len, ticket;
                _this.tickets = [];
                for (i = 0, len = tickets.length; i < len; i++) {
                  ticket = tickets[i];
                  _this.tickets.push(new BBModel.EventTicket(ticket));
                }
                _this.adjustTicketsForRemaining();
                return def.resolve(_this.tickets);
              };
            })(this));
          } else {
            this.tickets = [
              new BBModel.EventTicket({
                name: "Admittance",
                min_num_bookings: 1,
                max_num_bookings: this.max_num_bookings,
                type: "normal",
                price: this.price
              })
            ];
            this.adjustTicketsForRemaining();
            def.resolve(this.tickets);
          }
        }
        return def.promise;
      };

      EventChain.prototype.adjustTicketsForRemaining = function() {
        var i, len, ref, results;
        if (this.tickets) {
          ref = this.tickets;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            this.ticket = ref[i];
            results.push(this.ticket.max_spaces = this.spaces);
          }
          return results;
        }
      };

      return EventChain;

    })(BaseModel);
  });

}).call(this);
