(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:PurchaseItemModel
  *
  * @description
  * This is PurchaseItemModel in BB.Models module that creates PurchaseItem object.
  *
  * <pre>
  * //Creates class PurchaseItem that extends BaseModel
  * class PurchaseItem extends BaseModel
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
  * @returns {object} Newly created PurchaseItem object with the following set of methods:
  *
  * - constructor(data)
  * - describe()
  * - full_describe()
  * - hasPrice()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("PurchaseItemModel", function($q, BBModel, BaseModel) {
    var PurchaseItem;
    return PurchaseItem = (function(superClass) {
      extend(PurchaseItem, superClass);

      function PurchaseItem(data) {
        PurchaseItem.__super__.constructor.call(this, data);
        this.parts_links = {};
        if (data) {
          if (data.$has('service')) {
            this.parts_links.service = data.$href('service');
          }
          if (data.$has('resource')) {
            this.parts_links.resource = data.$href('resource');
          }
          if (data.$has('person')) {
            this.parts_links.person = data.$href('person');
          }
          if (data.$has('company')) {
            this.parts_links.company = data.$href('company');
          }
        }
      }

      PurchaseItem.prototype.describe = function() {
        return this.get('describe');
      };

      PurchaseItem.prototype.full_describe = function() {
        return this.get('full_describe');
      };

      PurchaseItem.prototype.hasPrice = function() {
        return this.price && this.price > 0;
      };

      return PurchaseItem;

    })(BaseModel);
  });

}).call(this);
