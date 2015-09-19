(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Purchase.TotalModel
  *
  * @description
  * This is TotalModel in BB.Models module that creates Total object.
  *
  * <pre>
  * //Creates class Purchase_Total that extends BaseModel
  * class Purchase_Total extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires $window
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  * @requires $sce
  *
  * @returns {Promise} Newly created Total object with the following set of methods:
  *
  * - constructor(data)
  * - id
  * - icalLink
  * - webcalLink
  * - gcalLink
  * - getItems
  * - getBookingsPromise
  * - getCourseBookingsPromise
  * - getPackages
  * - getProducts
  * - getDeals
  * - getMessages(booking_texts, msg_type)
  * - getClient
  * - getConfirmMessages()
  * - printed_total_price()
  * - newPaymentUrl()
  * - totalDuration()
  * - containsWaitlistItems()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Purchase.TotalModel", function($q, $window, BBModel, BaseModel, $sce) {
    var Purchase_Total;
    return Purchase_Total = (function(superClass) {
      extend(Purchase_Total, superClass);

      function Purchase_Total(data) {
        this.getConfirmMessages = bind(this.getConfirmMessages, this);
        this.getClient = bind(this.getClient, this);
        this.getMessages = bind(this.getMessages, this);
        this.getDeals = bind(this.getDeals, this);
        this.getProducts = bind(this.getProducts, this);
        this.getPackages = bind(this.getPackages, this);
        this.getCourseBookingsPromise = bind(this.getCourseBookingsPromise, this);
        this.getBookingsPromise = bind(this.getBookingsPromise, this);
        this.getItems = bind(this.getItems, this);
        Purchase_Total.__super__.constructor.call(this, data);
        this.getItems().then((function(_this) {
          return function(items) {
            return _this.items = items;
          };
        })(this));
        this.getClient().then((function(_this) {
          return function(client) {
            return _this.client = client;
          };
        })(this));
      }

      Purchase_Total.prototype.id = function() {
        return this.get('id');
      };

      Purchase_Total.prototype.icalLink = function() {
        return this._data.$href('ical');
      };

      Purchase_Total.prototype.webcalLink = function() {
        return this._data.$href('ical');
      };

      Purchase_Total.prototype.gcalLink = function() {
        return this._data.$href('gcal');
      };

      Purchase_Total.prototype.getItems = function() {
        var defer;
        defer = $q.defer();
        if (this.items) {
          defer.resolve(this.items);
        }
        $q.all([this.getBookingsPromise(), this.getCourseBookingsPromise(), this.getPackages(), this.getProducts(), this.getDeals()]).then(function(result) {
          var items;
          items = _.flatten(result);
          return defer.resolve(items);
        });
        return defer.promise;
      };

      Purchase_Total.prototype.getBookingsPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.bookings) {
          defer.resolve(this.bookings);
        }
        if (this._data.$has('bookings')) {
          this._data.$get('bookings').then((function(_this) {
            return function(bookings) {
              var b;
              _this.bookings = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Purchase.Booking(b));
                }
                return results;
              })();
              _this.bookings.sort(function(a, b) {
                return a.datetime.unix() - b.datetime.unix();
              });
              return defer.resolve(_this.bookings);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getCourseBookingsPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.course_bookings) {
          defer.resolve(this.course_bookings);
        }
        if (this._data.$has('course_bookings')) {
          this._data.$get('course_bookings').then((function(_this) {
            return function(bookings) {
              var b;
              _this.course_bookings = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Purchase.CourseBooking(b));
                }
                return results;
              })();
              return $q.all(_.map(_this.course_bookings, function(b) {
                return b.getBookings();
              })).then(function() {
                return defer.resolve(_this.course_bookings);
              });
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getPackages = function() {
        var defer;
        defer = $q.defer();
        if (this.packages) {
          defer.resolve(this.packages);
        }
        if (this._data.$has('packages')) {
          this._data.$get('packages').then((function(_this) {
            return function(packages) {
              _this.packages = packages;
              return defer.resolve(_this.packages);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getProducts = function() {
        var defer;
        defer = $q.defer();
        if (this.products) {
          defer.resolve(this.products);
        }
        if (this._data.$has('products')) {
          this._data.$get('products').then((function(_this) {
            return function(products) {
              _this.products = products;
              return defer.resolve(_this.products);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getDeals = function() {
        var defer;
        defer = $q.defer();
        if (this.deals) {
          defer.resolve(this.deals);
        }
        if (this._data.$has('deals')) {
          this._data.$get('deals').then((function(_this) {
            return function(deals) {
              _this.deals = deals;
              return defer.resolve(_this.deals);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getMessages = function(booking_texts, msg_type) {
        var bt, defer;
        defer = $q.defer();
        booking_texts = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = booking_texts.length; i < len; i++) {
            bt = booking_texts[i];
            if (bt.message_type === msg_type) {
              results.push(bt);
            }
          }
          return results;
        })();
        if (booking_texts.length === 0) {
          defer.resolve([]);
        } else {
          this.getItems().then(function(items) {
            var booking_text, i, item, j, k, len, len1, len2, msgs, ref, type;
            msgs = [];
            for (i = 0, len = booking_texts.length; i < len; i++) {
              booking_text = booking_texts[i];
              for (j = 0, len1 = items.length; j < len1; j++) {
                item = items[j];
                ref = ['company', 'person', 'resource', 'service'];
                for (k = 0, len2 = ref.length; k < len2; k++) {
                  type = ref[k];
                  if (item.$has(type) && item.$href(type) === booking_text.$href('item')) {
                    if (msgs.indexOf(booking_text.message) === -1) {
                      msgs.push(booking_text.message);
                    }
                  }
                }
              }
            }
            return defer.resolve(msgs);
          });
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getClient = function() {
        var defer;
        defer = $q.defer();
        if (this._data.$has('client')) {
          this._data.$get('client').then((function(_this) {
            return function(client) {
              _this.client = new BBModel.Client(client);
              return defer.resolve(_this.client);
            };
          })(this));
        } else {
          defer.reject('No client');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getConfirmMessages = function() {
        var defer;
        defer = $q.defer();
        if (this._data.$has('confirm_messages')) {
          this._data.$get('confirm_messages').then((function(_this) {
            return function(msgs) {
              return _this.getMessages(msgs, 'Confirm').then(function(filtered_msgs) {
                return defer.resolve(filtered_msgs);
              });
            };
          })(this));
        } else {
          defer.reject('no messages');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.printed_total_price = function() {
        if (parseFloat(this.total_price) % 1 === 0) {
          return "£" + parseInt(this.total_price);
        }
        return $window.sprintf("£%.2f", parseFloat(this.total_price));
      };

      Purchase_Total.prototype.newPaymentUrl = function() {
        if (this._data.$has('new_payment')) {
          return $sce.trustAsResourceUrl(this._data.$href('new_payment'));
        }
      };

      Purchase_Total.prototype.totalDuration = function() {
        var duration, i, item, len, ref;
        duration = 0;
        ref = this.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.duration) {
            duration += item.duration;
          }
        }
        duration /= 60;
        return duration;
      };

      Purchase_Total.prototype.containsWaitlistItems = function() {
        var i, item, len, ref, waitlist;
        waitlist = [];
        ref = this.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.on_waitlist === true) {
            waitlist.push(item);
          }
        }
        if (waitlist.length > 0) {
          return true;
        } else {
          return false;
        }
      };

      return Purchase_Total;

    })(BaseModel);
  });

}).call(this);
