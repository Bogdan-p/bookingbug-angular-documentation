(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.LoginMoadel
  *
  * @description
  * This is LoginMoadel for Admin in BB.Models module that creates Admin_Login object.
  *
  * <pre>
  * //Creates class Admin_Login that extends BaseModel
  * class Admin_Login extends BaseModel
  * </pre>
  *
  * @requires {string} $q Document the parameter to a function.
  *
  * @requires {string} BBModel Document the parameter to a function.
  *
  * @requires {string} BaseModel the parameter to a function.
  *
  * @returns {object} Newly created Admin_Login object.
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.LoginMoadel", function($q, BBModel, BaseModel) {

    /***
    * @ngdoc method
    * @name constructor
    * @methodOf BB.Models:Admin.LoginMoadel
    *
    * @description
    * Method constructor. Creates Admin_Login object.
    *
    * @requires {object} data Info
     */
    var Admin_Login;
    return Admin_Login = (function(superClass) {
      extend(Admin_Login, superClass);

      function Admin_Login(data) {
        Admin_Login.__super__.constructor.call(this, data);
      }

      return Admin_Login;

    })(BaseModel);
  });

}).call(this);
