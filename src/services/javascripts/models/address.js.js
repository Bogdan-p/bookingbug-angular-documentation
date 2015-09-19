(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.AddressModel
  *
  * @description
  * path: src/services/javascripts/models/address.js.coffee
  *
  * This is AddressModel in BB.Model module that creates Address Model object.
  *
  * <pre>
  * //Creates class Admin_Address class that extends AddressModel
  *   class Admin_Address extends AddressModel
  * </pre>
  *
  * ## Returns newly created AddressModel object with the following set of methods:
  * - distanceFrom: (address, options)
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  * @requires BB.Models:AddressModel
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.AddressModel", function($q, BBModel, BaseModel, AddressModel) {
    var Admin_Address;
    return Admin_Address = (function(superClass) {
      extend(Admin_Address, superClass);

      function Admin_Address() {
        return Admin_Address.__super__.constructor.apply(this, arguments);
      }


      /***
      * @ngdoc method
      * @name distanceFrom
      * @methodOf BB.Models:Admin.AddressModel
      *
      * @description
      * distanceFrom
      *
      * @param {object} address address
      * @param {object} options options
      *
      * @returns {array} this.dists[address]
      *
       */

      Admin_Address.prototype.distanceFrom = function(address, options) {
        var base;
        this.dists || (this.dists = []);
        (base = this.dists)[address] || (base[address] = Math.round(Math.random() * 50, 0));
        return this.dists[address];
      };

      return Admin_Address;

    })(AddressModel);
  });

}).call(this);
