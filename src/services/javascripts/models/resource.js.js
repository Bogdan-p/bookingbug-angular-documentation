
/***
* @ngdoc object
* @name BB.Models:Admin.ResourceModel
*
* @description
* This is Admin.ResourceModel in BB.Model module that creates Admin Resource Model object.
*
* <pre>
*  //Creates class Admin_Resources that extends ResourceModel
*   class Admin_Resource extends ResourceModel
* </pre>
*
* @requires $q
* @requires BB.Models:BBModel
* @requires BB.Models:BaseModel
* @requires BB.Models:ResourceModel
*
* @returns {object} Newly created Admin.ResourceModel object with the following set of methods:
*
* - isAvailable(start, end)
*
 */

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ResourceModel", function($q, BBModel, BaseModel, ResourceModel) {
    var Admin_Resource;
    return Admin_Resource = (function(superClass) {
      extend(Admin_Resource, superClass);

      function Admin_Resource() {
        return Admin_Resource.__super__.constructor.apply(this, arguments);
      }


      /***
      * @ngdoc method
      * @name isAvailable
      * @methodOf BB.Models:Admin.ResourceModel
      *
      * @description
      * isAvailable
      *
      * @param {object} start start
      * @param {object} end end
      *
      * @returns {array} this.availability[str]
      *
       */

      Admin_Resource.prototype.isAvailable = function(start, end) {
        var str;
        str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
        this.availability || (this.availability = {});
        if (this.availability[str]) {
          return this.availability[str];
        }
        this.availability[str] = "-";
        if (this.$has('schedule')) {
          this.$get('schedule', {
            start_date: start.format("YYYY-MM-DD"),
            end_date: end.format("YYYY-MM-DD")
          }).then((function(_this) {
            return function(sched) {
              _this.availability[str] = "No";
              if (sched && sched.dates && sched.dates[start.format("YYYY-MM-DD")] && sched.dates[start.format("YYYY-MM-DD")] !== "None") {
                return _this.availability[str] = "Yes";
              }
            };
          })(this));
        } else {
          this.availability[str] = "Yes";
        }
        return this.availability[str];
      };

      return Admin_Resource;

    })(ResourceModel);
  });

}).call(this);
