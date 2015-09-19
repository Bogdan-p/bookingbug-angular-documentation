(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:AddressModel
  *
  * @description
  * This is AddressModel in BB.Models module that creates Address object.
  *
  * <pre>
  * //Creates class Address that extends BaseModel
  * class Address extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Address object with the following set of methods:
  *
  * - addressSingleLine()
  * - hasAddress()
  * - addressCsvLine()
  * - addressMultiLine()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AddressModel", function($q, BBModel, BaseModel) {
    var Address;
    return Address = (function(superClass) {
      extend(Address, superClass);

      function Address() {
        return Address.__super__.constructor.apply(this, arguments);
      }

      Address.prototype.addressSingleLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += ", ";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += ", ";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += ", ";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += ", ";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += ", ";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Address.prototype.hasAddress = function() {
        return this.address1 || this.address2 || this.postcode;
      };

      Address.prototype.addressCsvLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        str += ", ";
        if (this.address2) {
          str += this.address2;
        }
        str += ", ";
        if (this.address3) {
          str += this.address3;
        }
        str += ", ";
        if (this.address4) {
          str += this.address4;
        }
        str += ", ";
        if (this.address5) {
          str += this.address5;
        }
        str += ", ";
        if (this.postcode) {
          str += this.postcode;
        }
        str += ", ";
        if (this.country) {
          str += this.country;
        }
        return str;
      };

      Address.prototype.addressMultiLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      return Address;

    })(BaseModel);
  });

}).call(this);
