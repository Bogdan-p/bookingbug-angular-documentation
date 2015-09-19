(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:EventModel
  *
  * @description
  * This is EventModel in BB.Models module that creates Event object.
  *
  * <pre>
  * //Creates class Event that extends BaseModel
  * class Event extends BaseModel
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
  * @param {model} DateTimeUlititiesService Info
  * <br>
  * {@link BB.Services:DateTimeUlititiesService more}
  *
  * @returns {object} Newly created Event object with the following set of methods:
  *
  * - constructor(data)
  * - getGroup()
  * - getChain()
  * - getDate()
  * - dateString()
  * - getDuration()
  * - printDuration()
  * - getDescription()
  * - getColour()
  * - getPerson()
  * - getPounds()
  * - getPrice()
  * - getPence()
  * - vgetNumBooked()
  * - getSpacesLeft(pool = null)
  * - hasSpace()
  * - hasWaitlistSpace()
  * - getRemainingDescription()
  * - select()
  * - unselect()
  * - prepEvent()
  * - updatePrice()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("EventModel", function($q, BBModel, BaseModel, DateTimeUlititiesService) {
    var Event;
    return Event = (function(superClass) {
      extend(Event, superClass);

      function Event(data) {
        Event.__super__.constructor.call(this, data);
        this.getDate();
        this.time = new BBModel.TimeSlot({
          time: DateTimeUlititiesService.convertMomentToTime(this.date)
        });
        if (this.duration) {
          this.end_datetime = this.date.clone().add(this.duration, 'minutes');
        }
      }

      Event.prototype.getGroup = function() {
        var defer;
        defer = $q.defer();
        if (this.group) {
          defer.resolve(this.group);
        } else if (this.$has('event_groups')) {
          this.$get('event_groups').then((function(_this) {
            return function(group) {
              _this.group = new BBModel.EventGroup(group);
              return defer.resolve(_this.group);
            };
          })(this), function(err) {
            return defer.reject(err);
          });
        } else {
          defer.reject("No event group");
        }
        return defer.promise;
      };

      Event.prototype.getChain = function() {
        var defer;
        defer = $q.defer();
        if (this.chain) {
          defer.resolve(this.chain);
        } else {
          if (this.$has('event_chains')) {
            this.$get('event_chains').then((function(_this) {
              return function(chain) {
                _this.chain = new BBModel.EventChain(chain);
                return defer.resolve(_this.chain);
              };
            })(this));
          } else {
            defer.reject("No event chain");
          }
        }
        return defer.promise;
      };

      Event.prototype.getDate = function() {
        if (this.date) {
          return this.date;
        }
        this.date = moment(this._data.datetime);
        return this.date;
      };

      Event.prototype.dateString = function(str) {
        var date;
        date = this.date();
        if (date) {
          return date.format(str);
        }
      };

      Event.prototype.getDuration = function() {
        var defer;
        defer = new $q.defer();
        if (this.duration) {
          defer.resolve(this.duration);
        } else {
          this.getChain().then((function(_this) {
            return function(chain) {
              _this.duration = chain.duration;
              return defer.resolve(_this.duration);
            };
          })(this));
        }
        return defer.promise;
      };

      Event.prototype.printDuration = function() {
        var h, m;
        if (this.duration < 60) {
          return this.duration + " mins";
        } else {
          h = Math.round(this.duration / 60);
          m = this.duration % 60;
          if (m === 0) {
            return h + " hours";
          } else {
            return h + " hours " + m + " mins";
          }
        }
      };

      Event.prototype.getDescription = function() {
        return this.getChain().description;
      };

      Event.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Event.prototype.getPerson = function() {
        return this.getChain().person_name;
      };

      Event.prototype.getPounds = function() {
        if (this.chain) {
          return Math.floor(this.getPrice()).toFixed(0);
        }
      };

      Event.prototype.getPrice = function() {
        return 0;
      };

      Event.prototype.getPence = function() {
        if (this.chain) {
          return (this.getPrice() % 1).toFixed(2).slice(-2);
        }
      };

      Event.prototype.getNumBooked = function() {
        return this.spaces_blocked + this.spaces_booked + this.spaces_reserved + this.spaces_held;
      };

      Event.prototype.getSpacesLeft = function(pool) {
        if (pool == null) {
          pool = null;
        }
        if (pool && this.ticket_spaces && this.ticket_spaces[pool]) {
          return this.ticket_spaces[pool].left;
        }
        return this.num_spaces - this.getNumBooked();
      };

      Event.prototype.hasSpace = function() {
        return this.getSpacesLeft() > 0;
      };

      Event.prototype.hasWaitlistSpace = function() {
        return this.getSpacesLeft() <= 0 && this.getChain().waitlength > this.spaces_wait;
      };

      Event.prototype.getRemainingDescription = function() {
        var left;
        left = this.getSpacesLeft();
        if (left > 0 && left < 3) {
          return "Only " + left + " " + (left > 1 ? "spaces" : "space") + " left";
        }
        if (this.hasWaitlistSpace()) {
          return "Join Waitlist";
        }
        return "";
      };

      Event.prototype.select = function() {
        return this.selected = true;
      };

      Event.prototype.unselect = function() {
        if (this.selected) {
          return delete this.selected;
        }
      };

      Event.prototype.prepEvent = function() {
        var def;
        def = $q.defer();
        this.getChain().then((function(_this) {
          return function() {
            if (_this.chain.$has('address')) {
              _this.chain.getAddressPromise().then(function(address) {
                return _this.chain.address = address;
              });
            }
            return _this.chain.getTickets().then(function(tickets) {
              var i, len, ref, ticket;
              _this.tickets = tickets;
              _this.price_range = {};
              if (tickets && tickets.length > 0) {
                ref = _this.tickets;
                for (i = 0, len = ref.length; i < len; i++) {
                  ticket = ref[i];
                  if (!_this.price_range.from || (_this.price_range.from && ticket.price < _this.price_range.from)) {
                    _this.price_range.from = ticket.price;
                  }
                  if (!_this.price_range.to || (_this.price_range.to && ticket.price > _this.price_range.to)) {
                    _this.price_range.to = ticket.price;
                  }
                  ticket.old_price = ticket.price;
                }
              } else {
                _this.price_range.from = _this.price;
                _this.price_range.to = _this.price;
              }
              return def.resolve();
            });
          };
        })(this));
        return def.promise;
      };

      Event.prototype.updatePrice = function() {
        var i, len, ref, results, ticket;
        ref = this.tickets;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          ticket = ref[i];
          if (ticket.pre_paid_booking_id) {
            results.push(ticket.price = 0);
          } else {
            results.push(ticket.price = ticket.old_price);
          }
        }
        return results;
      };

      return Event;

    })(BaseModel);
  });

}).call(this);
