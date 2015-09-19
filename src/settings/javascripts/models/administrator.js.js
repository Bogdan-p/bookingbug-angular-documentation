(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.AdministratorModel
  *
  * @description
  * path: src/services/javascripts/models/address.js.coffee
  *
  * This is AdministratorModel in BB.Model module that creates Administrator Model object.
  *
  * <pre>
  * //Creates class Admin_Administrator class that extends BaseModel
  *   class Admin_Administrator extends BaseModel
  * </pre>
  *
  * # Returns newly created AdministratorModel object with the following set of methods:
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

  angular.module('BB.Models').factory("Admin.AdministratorModel", function($q, BBModel, BaseModel) {
    var Admin_Administrator;
    return Admin_Administrator = (function(superClass) {
      extend(Admin_Administrator, superClass);

      function Admin_Administrator(data) {
        Admin_Administrator.__super__.constructor.call(this, data);
      }

      return Admin_Administrator;

    })(BaseModel);
  });

}).call(this);
