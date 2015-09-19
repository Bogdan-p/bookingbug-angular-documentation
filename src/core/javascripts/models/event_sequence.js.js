(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:EventSequenceModel
  *
  * @description
  * This is EventSequenceModel in BB.Models module that creates EventSequence object.
  *
  * <pre>
  * //Creates class EventSequence that extends BaseModel
  * class EventSequence extends BaseModel
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
  * @returns {object} Newly created EventSequence object with the following set of methods:
  *
  * - name()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("EventSequenceModel", function($q, BBModel, BaseModel) {
    var EventSequence;
    return EventSequence = (function(superClass) {
      extend(EventSequence, superClass);

      function EventSequence() {
        return EventSequence.__super__.constructor.apply(this, arguments);
      }

      EventSequence.prototype.name = function() {
        return this._data.name;
      };

      return EventSequence;

    })(BaseModel);
  });

}).call(this);
