
/***
* @ngdoc service
* @name BB.Services:PurchaseService
*
* @description
* Factory PurchaseService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window more}
*
* @param {model} halClient Info
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(params)
* - more mthods
*
 */

(function() {
  angular.module('BB.Services').factory("PurchaseService", function($q, halClient, BBModel, $window, UriTemplate) {
    return {
      query: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = params.url_root + "/api/v1/purchases/" + params.purchase_id;
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      bookingRefQuery: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = new UriTemplate(params.url_root + "/api/v1/purchases/booking_ref/{booking_ref}{?raw}").fillFromObject(params);
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      update: function(params) {
        var bdata, booking, data, defer, i, len, ref;
        defer = $q.defer();
        if (!params.purchase) {
          defer.reject("No purchase present");
          return defer.promise;
        }
        data = {};
        if (params.bookings) {
          bdata = [];
          ref = params.bookings;
          for (i = 0, len = ref.length; i < len; i++) {
            booking = ref[i];
            bdata.push(booking.getPostData());
          }
          data.bookings = bdata;
        }
        params.purchase.$put('self', {}, data).then((function(_this) {
          return function(purchase) {
            purchase = new BBModel.Purchase.Total(purchase);
            return defer.resolve(purchase);
          };
        })(this), (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
        return defer.promise;
      },
      bookWaitlistItem: function(params) {
        var data, defer;
        defer = $q.defer();
        if (!params.purchase) {
          defer.reject("No purchase present");
          return defer.promise;
        }
        data = {};
        if (params.booking) {
          data.booking = params.booking.getPostData();
        }
        data.booking_id = data.booking.id;
        params.purchase.$put('book_waitlist_item', {}, data).then((function(_this) {
          return function(purchase) {
            purchase = new BBModel.Purchase.Total(purchase);
            return defer.resolve(purchase);
          };
        })(this), (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
        return defer.promise;
      },
      delete_all: function(purchase) {
        var defer;
        defer = $q.defer();
        if (!purchase) {
          defer.reject("No purchase present");
          return defer.promise;
        }
        purchase.$del('self').then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
        return defer.promise;
      }
    };
  });

}).call(this);
