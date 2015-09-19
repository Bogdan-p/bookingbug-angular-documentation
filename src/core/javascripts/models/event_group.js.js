(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:EventGroupModel
  *
  * @description
  * This is EventGroupModel in BB.Models module that creates EventGroup object.
  *
  * <pre>
  * //Creates class EventGroup that extends BaseModel
  * class EventGroup extends BaseModel
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
  * @returns {object} Newly created EventGroup object with the following set of methods:
  *
  * - name()
  * - colour()
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("EventGroupModel", function($q, BBModel, BaseModel) {
    var EventGroup;
    return EventGroup = (function(superClass) {
      extend(EventGroup, superClass);

      function EventGroup() {
        return EventGroup.__super__.constructor.apply(this, arguments);
      }

      EventGroup.prototype.name = function() {
        return this._data.name;
      };

      EventGroup.prototype.colour = function() {
        return this._data.colour;
      };

      return EventGroup;

    })(BaseModel);
  });

}).call(this);
