(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:QuestionModel
  *
  * @description
  * This is QuestionModel in BB.Models module that creates Question object.
  *
  * <pre>
  * //Creates class Question that extends BaseModel
  * class Question extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $filter Filters are used for formatting data displayed to the user.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$filter more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Question object with the following set of methods:
  *
  * - constructor(data)
  * - hasPrice()
  * - selectedPrice()
  * - selectedPriceQty(qty)
  * - getAnswerId()
  * - showElement()
  * - hideElement()
  * - getPostData()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("QuestionModel", function($q, $filter, BBModel, BaseModel) {
    var Question;
    return Question = (function(superClass) {
      extend(Question, superClass);

      function Question(data) {
        var currency, i, len, option, ref;
        Question.__super__.constructor.call(this, data);
        if (this.price) {
          this.price = parseFloat(this.price);
        }
        if (this._data["default"]) {
          this.answer = this._data["default"];
        }
        if (this._data.options) {
          ref = this._data.options;
          for (i = 0, len = ref.length; i < len; i++) {
            option = ref[i];
            if (option.is_default) {
              this.answer = option.name;
            }
            if (this.hasPrice()) {
              option.price = parseFloat(option.price);
              currency = data.currency_code ? data.currency_code : 'GBP';
              option.display_name = option.name + " (" + ($filter('currency')(option.price, currency)) + ")";
            } else {
              option.display_name = option.name;
            }
          }
        }
        if (this._data.detail_type === "check" || this._data.detail_type === "check-price") {
          this.answer = this._data["default"] && this._data["default"] === "1";
        }
        this.currentlyShown = true;
      }

      Question.prototype.hasPrice = function() {
        return this.detail_type === "check-price" || this.detail_type === "select-price" || this.detail_type === "radio-price";
      };

      Question.prototype.selectedPrice = function() {
        var i, len, option, ref;
        if (!this.hasPrice()) {
          return 0;
        }
        if (this.detail_type === "check-price") {
          return (this.answer ? this.price : 0);
        }
        ref = this._data.options;
        for (i = 0, len = ref.length; i < len; i++) {
          option = ref[i];
          if (this.answer === option.name) {
            return option.price;
          }
        }
        return 0;
      };

      Question.prototype.selectedPriceQty = function(qty) {
        var p;
        qty || (qty = 1);
        p = this.selectedPrice();
        if (this.price_per_booking) {
          p = p * qty;
        }
        return p;
      };

      Question.prototype.getAnswerId = function() {
        var i, len, o, ref;
        if (!this.answer || !this.options || this.options.length === 0) {
          return null;
        }
        ref = this.options;
        for (i = 0, len = ref.length; i < len; i++) {
          o = ref[i];
          if (this.answer === o.name) {
            return o.id;
          }
        }
        return null;
      };

      Question.prototype.showElement = function() {
        return this.currentlyShown = true;
      };

      Question.prototype.hideElement = function() {
        return this.currentlyShown = false;
      };

      Question.prototype.getPostData = function() {
        var p, x;
        x = {};
        x.id = this.id;
        x.answer = this.answer;
        if (this.detail_type === "date" && this.answer) {
          x.answer = moment(this.answer).toISODate();
        }
        p = this.selectedPrice();
        if (p) {
          x.price = p;
        }
        return x;
      };

      return Question;

    })(BaseModel);
  });

}).call(this);
