(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:AnswerModel
  *
  * @description
  * This is AnswerModel in BB.Models module that creates Answer object.
  *
  * <pre>
  * //Creates class Answer that extends BaseModel
  * class Answer extends BaseModel
  * </pre>
  *
  * @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @requires {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
  * @requires {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @requires {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Answer object with the following set of methods:
  *
  * - constructor(data)
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AnswerModel", function($q, BBModel, BaseModel, $bbug) {
    var Answer;
    return Answer = (function(superClass) {
      extend(Answer, superClass);

      function Answer(data) {
        Answer.__super__.constructor.call(this, data);
      }

      Answer.prototype.getQuestion = function() {
        var defer;
        defer = $q.defer();
        if (this.question) {
          defer.resolve(this.question);
        }
        if (this._data.$has('question')) {
          this._data.$get('question').then((function(_this) {
            return function(question) {
              _this.question = question;
              return defer.resolve(_this.question);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      return Answer;

    })(BaseModel);
  });

}).call(this);
