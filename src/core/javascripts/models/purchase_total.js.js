(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:PurchaseTotalModel
  *
  * @description
  * This is PurchaseTotalModel in BB.Models module that creates PurchaseTotal object.
  *
  * <pre>
  * //Creates class PurchaseTotal that extends BaseModel
  * class PurchaseTotal extends BaseModel
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
  * @returns {object} Newly created PurchaseTotal object with the following set of methods:
  *
  * - constructor(data)
  * - icalLink()
  * - webcalLink()
  * - gcalLink()
  * - id()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("PurchaseTotalModel", function($q, BBModel, BaseModel) {
    var PurchaseTotal;
    return PurchaseTotal = (function(superClass) {
      extend(PurchaseTotal, superClass);

      function PurchaseTotal(data) {
        var cprom;
        PurchaseTotal.__super__.constructor.call(this, data);
        this.promise = this._data.$get('purchase_items');
        this.items = [];
        this.promise.then((function(_this) {
          return function(items) {
            var i, item, len, results;
            results = [];
            for (i = 0, len = items.length; i < len; i++) {
              item = items[i];
              results.push(_this.items.push(new BBModel.PurchaseItem(item)));
            }
            return results;
          };
        })(this));
        if (this._data.$has('client')) {
          cprom = data.$get('client');
          cprom.then((function(_this) {
            return function(client) {
              return _this.client = new BBModel.Client(client);
            };
          })(this));
        }
      }

      PurchaseTotal.prototype.icalLink = function() {
        return this._data.$href('ical');
      };

      PurchaseTotal.prototype.webcalLink = function() {
        return this._data.$href('ical');
      };

      PurchaseTotal.prototype.gcalLink = function() {
        return this._data.$href('gcal');
      };

      PurchaseTotal.prototype.id = function() {
        return this.get('id');
      };

      return PurchaseTotal;

    })(BaseModel);
  });

}).call(this);
