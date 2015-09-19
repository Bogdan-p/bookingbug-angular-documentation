(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.ClientQueueModel
  *
  * @description
  * This is Admin.ClientQueueModel in BB.Models module that creates Admin ClientQueue object.
  *
  * <pre>
  * //Creates class Admin_ClientQueue that extends BaseModel
  * class Admin_ClientQueue extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ClientQueueModel", function($q, BBModel, BaseModel) {
    var Admin_ClientQueue;
    return Admin_ClientQueue = (function(superClass) {
      extend(Admin_ClientQueue, superClass);

      function Admin_ClientQueue() {
        return Admin_ClientQueue.__super__.constructor.apply(this, arguments);
      }

      return Admin_ClientQueue;

    })(BaseModel);
  });

}).call(this);
