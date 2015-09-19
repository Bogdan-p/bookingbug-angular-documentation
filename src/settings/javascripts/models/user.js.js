(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.UserModel
  *
  * @description
  * path: src/services/javascripts/models/address.js.coffee
  *
  * This is UserModel in BB.Model module that creates Administrator Model object.
  *
  * <pre>
  * //Creates class Admin_User class that extends BaseModel
  *   class Admin_User extends BaseModel
  * </pre>
  *
  * # Returns newly created UserModel object with the following set of methods:
  *
  * - constructor: (data)
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.UserModel", function($q, BBModel, BaseModel) {
    var Admin_User;
    return Admin_User = (function(superClass) {
      extend(Admin_User, superClass);

      function Admin_User(data) {
        Admin_User.__super__.constructor.call(this, data);
        this.companies = [];
        if (data) {
          if (this.$has('companies')) {
            this.$get('companies').then((function(_this) {
              return function(comps) {
                return _this.companies = comps;
              };
            })(this));
          }
        }
      }

      return Admin_User;

    })(BaseModel);
  });

}).call(this);
