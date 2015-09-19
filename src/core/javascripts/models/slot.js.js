(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:SlotModel
  *
  * @description
  * This is SlotModel in BB.Models module that creates Slot object.
  *
  * <pre>
  * //Creates class Slot that extends BaseModel
  * class Slot extends BaseModel
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
  * @returns {object} Newly created Slot object with the following set of methods:
  *
  * - constructor(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("SlotModel", function($q, BBModel, BaseModel) {
    var Slot;
    return Slot = (function(superClass) {
      extend(Slot, superClass);

      function Slot(data) {
        Slot.__super__.constructor.call(this, data);
        this.datetime = moment(data.datetime);
      }

      return Slot;

    })(BaseModel);
  });

}).call(this);
