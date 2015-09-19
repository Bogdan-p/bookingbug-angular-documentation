(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:SurveyQuestionModel
  *
  * @description
  * This is SurveyQuestionModel in BB.Models module that creates SurveyQuestion object.
  *
  * <pre>
  * //Creates class SurveyQuestion that extends BaseModel
  * class SurveyQuestion extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @param {model} QuestionService Info
  * <br>
  * {@link BB.Services:QuestionService more}
  *
  * @returns {object} Newly created SurveyQuestion object with the following set of methods:
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("SurveyQuestionModel", function($q, $window, BBModel, BaseModel, QuestionModel) {
    var SurveyQuestion;
    return SurveyQuestion = (function(superClass) {
      extend(SurveyQuestion, superClass);

      function SurveyQuestion() {
        return SurveyQuestion.__super__.constructor.apply(this, arguments);
      }

      return SurveyQuestion;

    })(QuestionModel);
  });

}).call(this);
