(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.QueuerModel
  *
  * @description
  * This is Admin.Queuer in BB.Models module that creates Admin Queuer object.
  *
  * <pre>
  * //Creates class QueuerModel that extends BaseModel
  * class Admin_Queuer extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("QueuerModel", [
    "$q", "BBModel", "BaseModel", function($q, BBModel, BaseModel) {
      var Queuer;
      return Queuer = (function(superClass) {
        extend(Queuer, superClass);

        function Queuer() {
          return Queuer.__super__.constructor.apply(this, arguments);
        }

        return Queuer;

      })(BaseModel);
    }
  ]);

}).call(this);
