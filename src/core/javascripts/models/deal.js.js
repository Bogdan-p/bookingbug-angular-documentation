(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:DealModel
  *
  * @description
  * This is DealModel in BB.Models module that creates Deal object.
  *
  * <pre>
  * //Creates class Deal that extends BaseModel
  * class Deal extends BaseModel
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
  * @returns {object} Newly created Deal object with the following set of methods:
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("DealModel", function($q, BBModel, BaseModel) {
    var Deal;
    return Deal = (function(superClass) {
      extend(Deal, superClass);

      function Deal() {
        return Deal.__super__.constructor.apply(this, arguments);
      }

      return Deal;

    })(BaseModel);
  });

}).call(this);
