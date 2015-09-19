(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.UserModel
  *
  * @description
  * This is UserModel model for Admin in BB.Models module that creates User object.
  *
  * <pre>
  * //Creates class User that extends BaseModel
  * class User extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  *
  * @returns {object} Newly created User object.
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.UserModel", function($q, BBModel, BaseModel) {
    var User;
    return User = (function(superClass) {
      extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      return User;

    })(BaseModel);
  });

}).call(this);
