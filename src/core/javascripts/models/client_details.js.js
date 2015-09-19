(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ClientDetailsModel
  *
  * @description
  * This is ClientDetailsModel in BB.Models module that creates ClientDetails object.
  *
  * <pre>
  * //Creates class ClientDetails that extends BaseModel
  * class ClientDetails extends BaseModel
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
  * @returns {object} Newly created ClientDetails object with the following set of methods:
  *
  * - constructor(data)
  * - getPostData(questions)
  * - setAnswers(answers)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ClientDetailsModel", function($q, BBModel, BaseModel) {
    var ClientDetails;
    return ClientDetails = (function(superClass) {
      extend(ClientDetails, superClass);

      function ClientDetails(data) {
        var i, len, q, ref;
        ClientDetails.__super__.constructor.apply(this, arguments);
        this.questions = [];
        if (this._data) {
          ref = data.questions;
          for (i = 0, len = ref.length; i < len; i++) {
            q = ref[i];
            this.questions.push(new BBModel.Question(q));
          }
        }
        this.hasQuestions = this.questions.length > 0;
      }

      ClientDetails.prototype.getPostData = function(questions) {
        var data, i, len, q;
        data = [];
        for (i = 0, len = questions.length; i < len; i++) {
          q = questions[i];
          data.push({
            answer: q.answer,
            id: q.id,
            price: q.price
          });
        }
        return data;
      };

      ClientDetails.prototype.setAnswers = function(answers) {
        var a, ahash, i, j, len, len1, q, ref, results;
        ahash = {};
        for (i = 0, len = answers.length; i < len; i++) {
          a = answers[i];
          ahash[a.question_id] = a;
        }
        ref = this.questions;
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          q = ref[j];
          if (ahash[q.id]) {
            results.push(q.answer = ahash[q.id].answer);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      return ClientDetails;

    })(BaseModel);
  });

}).call(this);
