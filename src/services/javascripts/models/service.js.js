(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.ServiceModel
  *
  * @description
  * This is Admin.ServiceModel in BB.Models module that creates Admin ServiceModel object.
  *
  * <pre>
  * //Creates class Admin_Service that extends ServiceModel
  * class class Admin_Service extends ServiceModel
  * </pre>
  *
  * @returns {object} Newly created Admin.ServiceModel object with the following set of methods:
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ServiceModel", function($q, BBModel, ServiceModel) {
    var Admin_Service;
    return Admin_Service = (function(superClass) {
      extend(Admin_Service, superClass);

      function Admin_Service() {
        return Admin_Service.__super__.constructor.apply(this, arguments);
      }

      return Admin_Service;

    })(ServiceModel);
  });

}).call(this);
