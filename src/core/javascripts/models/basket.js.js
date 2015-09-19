(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:BasketModel
  *
  * @description
  * This is BasketModel in BB.Models module that creates Basket object.
  *
  * <pre>
  * //Creates class Basket that extends BaseModel
  * class Basket extends BaseModel
  * </pre>
  *
  * @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @requires {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @requires {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Basket object with the following set of methods:
  *
  * - constructor(data, scope)
  * - addItem(item)
  * - clear()
  * - readyToCheckout()
  * - timeItems()
  * - couponItems()
  * - removeCoupons()
  * - setSettings(set)
  * - setClient(client)
  * - setClientDetails(client_details)
  * - getPostData()
  * - dueTotal()
  * - length()
  * - questionPrice(options)
  * - totalPrice(options)
  * - updateTotalPrice()
  * - fullPrice()
  * - hasCoupon()
  * - totalCoupons()
  * - totalDuration()
  * - containsDeal()
  * - hasDeal()
  * - getDealCodes()
  * - totalDeals()
  * - totalDealPaid()
  * - remainingDealBalance()
  * - hasWaitlistItem()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("BasketModel", function($q, BBModel, BaseModel) {
    var Basket;
    return Basket = (function(superClass) {
      extend(Basket, superClass);

      function Basket(data, scope) {
        if (scope && scope.isAdmin) {
          this.is_admin = scope.isAdmin;
        } else {
          this.is_admin = false;
        }
        if ((scope != null) && scope.parent_client) {
          this.parent_client_id = scope.parent_client.id;
        }
        this.items = [];
        Basket.__super__.constructor.call(this, data);
      }

      Basket.prototype.addItem = function(item) {
        var i, j, len, ref;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (i === item) {
            return;
          }
          if (i.id && item.id && i.id === item.id) {
            return;
          }
        }
        return this.items.push(item);
      };

      Basket.prototype.clear = function() {
        return this.items = [];
      };

      Basket.prototype.clearItem = function(item) {
        return this.items = this.items.filter(function(i) {
          return i !== item;
        });
      };

      Basket.prototype.readyToCheckout = function() {
        if (this.items.length > 0) {
          return true;
        } else {
          return false;
        }
      };

      Basket.prototype.timeItems = function() {
        var i, j, len, ref, titems;
        titems = [];
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (!i.is_coupon && !i.ready) {
            titems.push(i);
          }
        }
        return titems;
      };

      Basket.prototype.couponItems = function() {
        var citems, i, j, len, ref;
        citems = [];
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (i.is_coupon) {
            citems.push(i);
          }
        }
        return citems;
      };

      Basket.prototype.removeCoupons = function() {
        var i, item, j, len, ref;
        ref = this.items;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          item = ref[i];
          if (item.is_coupon) {
            this.items.splice(i, 1);
          }
        }
        return this.items;
      };

      Basket.prototype.setSettings = function(set) {
        if (!set) {
          return;
        }
        this.settings || (this.settings = {});
        return $.extend(this.settings, set);
      };

      Basket.prototype.setClient = function(client) {
        return this.client = client;
      };

      Basket.prototype.setClientDetails = function(client_details) {
        return this.client_details = new BBModel.PurchaseItem(client_details);
      };

      Basket.prototype.getPostData = function() {
        var item, j, len, post, ref;
        post = {
          client: this.client.getPostData(),
          settings: this.settings,
          reference: this.reference
        };
        post.is_admin = this.is_admin;
        post.parent_client_id = this.parent_client_id;
        post.items = [];
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          post.items.push(item.getPostData());
        }
        return post;
      };

      Basket.prototype.dueTotal = function() {
        var item, j, len, ref, total;
        total = this.totalPrice();
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.isWaitlist()) {
            total -= item.price;
          }
        }
        if (total < 0) {
          total = 0;
        }
        return total;
      };

      Basket.prototype.length = function() {
        return this.items.length;
      };

      Basket.prototype.questionPrice = function(options) {
        var item, j, len, price, ref, unready;
        unready = options && options.unready;
        price = 0;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if ((!item.ready && unready) || !unready) {
            price += item.questionPrice();
          }
        }
        return price;
      };

      Basket.prototype.totalPrice = function(options) {
        var item, j, len, price, ref, unready;
        unready = options && options.unready;
        price = 0;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if ((!item.ready && unready) || !unready) {
            price += item.totalPrice();
          }
        }
        return price;
      };

      Basket.prototype.updateTotalPrice = function(options) {
        return this.total_price = this.totalPrice(options);
      };

      Basket.prototype.fullPrice = function() {
        var item, j, len, price, ref;
        price = 0;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          price += item.fullPrice();
        }
        return price;
      };

      Basket.prototype.hasCoupon = function() {
        var item, j, len, ref;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.is_coupon) {
            return true;
          }
        }
        return false;
      };

      Basket.prototype.totalCoupons = function() {
        return this.fullPrice() - this.totalPrice() - this.totalDealPaid();
      };

      Basket.prototype.totalDuration = function() {
        var duration, item, j, len, ref;
        duration = 0;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.service && item.service.listed_duration) {
            duration += item.service.listed_duration;
          }
        }
        return duration;
      };

      Basket.prototype.containsDeal = function() {
        var item, j, len, ref;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.deal_id) {
            return true;
          }
        }
        return false;
      };

      Basket.prototype.hasDeal = function() {
        var item, j, len, ref;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.deal_codes && item.deal_codes.length > 0) {
            return true;
          }
        }
        return false;
      };

      Basket.prototype.getDealCodes = function() {
        this.deals = this.items[0] && this.items[0].deal_codes ? this.items[0].deal_codes : [];
        return this.deals;
      };

      Basket.prototype.totalDeals = function() {
        var deal, j, len, ref, value;
        value = 0;
        ref = this.getDealCodes();
        for (j = 0, len = ref.length; j < len; j++) {
          deal = ref[j];
          value += deal.value;
        }
        return value;
      };

      Basket.prototype.totalDealPaid = function() {
        var item, j, len, ref, total_cert_paid;
        total_cert_paid = 0;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.certificate_paid) {
            total_cert_paid += item.certificate_paid;
          }
        }
        return total_cert_paid;
      };

      Basket.prototype.remainingDealBalance = function() {
        return this.totalDeals() - this.totalDealPaid();
      };

      Basket.prototype.hasWaitlistItem = function() {
        var item, j, len, ref;
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.isWaitlist()) {
            return true;
          }
        }
        return false;
      };

      return Basket;

    })(BaseModel);
  });

}).call(this);
