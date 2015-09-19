
/***
* @ngdoc object
* @name BB.Models:Member.PrePaidBookingModel
*
* @description
* This is Member.PrePaidBookingModel in BB.Models module that creates PrePaidBookingModel object.
*
* <pre>
* //Creates class Member_PrePaidBooking that extends BaseModel
* class Member_PrePaidBooking extends BaseModel
* </pre>
*
* @requires $q
* @requires BB.Models:BBModel
* @requires BB.Models:BaseModel
*
* @returns {object} Newly created PrePaidBookingModel object with the following set of methods:
*
* - constructor(data)
* - checkValidity(event)
*
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Member.PrePaidBookingModel", function($q, BBModel, BaseModel) {
    var Member_PrePaidBooking;
    return Member_PrePaidBooking = (function(superClass) {
      extend(Member_PrePaidBooking, superClass);

      function Member_PrePaidBooking(data) {
        Member_PrePaidBooking.__super__.constructor.call(this, data);
      }

      Member_PrePaidBooking.prototype.checkValidity = function(event) {
        if (this.service_id && event.service_id && this.service_id !== event.service_id) {
          return false;
        } else if (this.resource_id && event.resource_id && this.resource_id !== event.resource_id) {
          return false;
        } else if (this.person_id && event.person_id && this.person_id !== event.person_id) {
          return false;
        } else {
          return true;
        }
      };

      return Member_PrePaidBooking;

    })(BaseModel);
  });

}).call(this);
