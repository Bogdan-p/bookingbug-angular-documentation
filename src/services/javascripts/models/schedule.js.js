(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.ScheduleModel
  *
  * @description
  * This is Admin.ScheduleModel in BB.Model module that creates Admin Resource Model object.
  *
  * <pre>
  *  //Creates class Admin_Schedule that extends BaseModel
  *   class Admin_Schedule extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
  * @returns {object} Newly created Admin.ScheduleModel object with the following set of methods:
  *
  * - constructor(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ScheduleModel", function($q, BBModel, BaseModel) {
    var Admin_Schedule;
    return Admin_Schedule = (function(superClass) {
      extend(Admin_Schedule, superClass);

      function Admin_Schedule(data) {
        Admin_Schedule.__super__.constructor.call(this, data);
      }

      return Admin_Schedule;

    })(BaseModel);
  });

}).call(this);
