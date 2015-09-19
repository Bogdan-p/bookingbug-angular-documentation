(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.EventGroupModel
  *
  * @description
  * This is Admin.EventGroupModel in BB.Models module that creates Admin Event object.
  *
  * <pre>
  * //Create class Admin_EventGroup that extends BaseModel
  * class Admin_EventGroup extends BaseModel
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

  angular.module('BB.Models').factory("Admin.EventGroupModel", function($q, BBModel, BaseModel) {
    var Admin_EventGroup;
    return Admin_EventGroup = (function(superClass) {
      extend(Admin_EventGroup, superClass);

      function Admin_EventGroup(data) {
        Admin_EventGroup.__super__.constructor.call(this, data);
      }

      return Admin_EventGroup;

    })(BaseModel);
  });

}).call(this);
