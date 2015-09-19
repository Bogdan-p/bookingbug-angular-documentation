(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.EventChainModel
  *
  * @description
  * This is Admin.EventChainModel in BB.Models module that creates Admin Event object.
  *
  * <pre>
  * //Create class Admin_EventChain that extends BaseModel
  * class Admin_EventChain extends BaseModel
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

  angular.module('BB.Models').factory("Admin.EventChainModel", function($q, BBModel, BaseModel) {
    var Admin_EventChain;
    return Admin_EventChain = (function(superClass) {
      extend(Admin_EventChain, superClass);

      function Admin_EventChain(data) {
        Admin_EventChain.__super__.constructor.call(this, data);
      }

      return Admin_EventChain;

    })(BaseModel);
  });

}).call(this);
