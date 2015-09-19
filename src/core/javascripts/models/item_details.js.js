(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ItemDetailsModel
  *
  * @description
  * This is ItemDetailsModel in BB.Models module that creates ItemDetails object.
  *
  * <pre>
  * //Creates class ItemDetails that extends BaseModel
  * class ItemDetails extends BaseModel
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
  * @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
  * @param {model} QuestionService Info
  * <br>
  * {@link BB.Services:QuestionService more}
  *
  * @returns {object} Newly created ItemDetails object with the following set of methods:
  *
  * - constructor(data)
  * - questionPrice(qty)
  * - getPostData()
  * - setAnswers(answers)
  * - getQuestion(id)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ItemDetailsModel", function($q, BBModel, BaseModel, $bbug, QuestionService) {
    var ItemDetails;
    return ItemDetails = (function(superClass) {
      extend(ItemDetails, superClass);

      function ItemDetails(data) {
        var i, len, q, ref;
        this._data = data;
        if (this._data) {
          this.self = this._data.$href("self");
        }
        this.questions = [];
        this.survey_questions = [];
        if (data) {
          ref = data.questions;
          for (i = 0, len = ref.length; i < len; i++) {
            q = ref[i];
            if (q.outcome === false) {
              if (data.currency_code) {
                q.currency_code = data.currency_code;
              }
              this.questions.push(new BBModel.Question(q));
            } else {
              this.survey_questions.push(new BBModel.SurveyQuestion(q));
            }
          }
        }
        this.hasQuestions = this.questions.length > 0;
        this.hasSurveyQuestions = this.survey_questions.length > 0;
      }

      ItemDetails.prototype.questionPrice = function(qty) {
        var i, len, price, q, ref;
        qty || (qty = 1);
        this.checkConditionalQuestions();
        price = 0;
        ref = this.questions;
        for (i = 0, len = ref.length; i < len; i++) {
          q = ref[i];
          price += q.selectedPriceQty(qty);
        }
        return price;
      };

      ItemDetails.prototype.checkConditionalQuestions = function() {
        return QuestionService.checkConditionalQuestions(this.questions);
      };

      ItemDetails.prototype.getPostData = function() {
        var data, i, len, q, ref;
        data = [];
        ref = this.questions;
        for (i = 0, len = ref.length; i < len; i++) {
          q = ref[i];
          if (q.currentlyShown) {
            data.push(q.getPostData());
          }
        }
        return data;
      };

      ItemDetails.prototype.setAnswers = function(answers) {
        var a, ahash, i, j, len, len1, q, ref;
        ahash = {};
        for (i = 0, len = answers.length; i < len; i++) {
          a = answers[i];
          ahash[a.id] = a;
        }
        ref = this.questions;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          q = ref[j];
          if (ahash[q.id]) {
            q.answer = ahash[q.id].answer;
          }
        }
        return this.checkConditionalQuestions();
      };

      ItemDetails.prototype.getQuestion = function(id) {
        return _.findWhere(this.questions, {
          id: id
        });
      };

      return ItemDetails;

    })(BaseModel);
  });

}).call(this);
