(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.EventModel
  *
  * @description
  * This is Admin.EventModel in BB.Models module that creates Admin Event object.
  *
  * <pre>
  * //Create class Admin_Event that extends BaseModel
  * class Admin_Event extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
  * @returns {object} Newly created Admin Event object with the following set of methods:
  *
  * - constructor(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.EventModel", function($q, BBModel, BaseModel) {
    var Admin_Event;
    return Admin_Event = (function(superClass) {
      extend(Admin_Event, superClass);

      function Admin_Event(data) {
        Admin_Event.__super__.constructor.call(this, data);
      }

      return Admin_Event;

    })(BaseModel);
  });

}).call(this);
