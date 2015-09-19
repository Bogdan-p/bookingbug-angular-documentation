(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.ClinicModel
  *
  * @description
  * path: src/services/javascripts/models/admin_clinic.js.coffee
  *
  * Creates Admin_Clinic object.
  *
  * <pre>
  * angular.module('BB.Models').factory "Admin.ClinicModel", ($q, BBModel, BaseModel) ->
  *   class Admin_Clinic extends BaseModel
  * </pre>
  *
  * ## Returns newly created Admin_Clinic object with the following set of methods:
  * - constructor(data)
  * - setResourcesAndPeople()
  * - setTimes()
  * - getPostData()
  * - save()
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ClinicModel", function($q, BBModel, BaseModel) {
    var Admin_Clinic;
    return Admin_Clinic = (function(superClass) {
      extend(Admin_Clinic, superClass);


      /***
      * @ngdoc method
      * @name constructor
      * @methodOf BB.Models:Admin.ClinicModel
      *
      * @description
      * constructor
      *
      * @param {object} data data
      *
      * @returns {function} this.setResourcesAndPeople()
      *
       */

      function Admin_Clinic(data) {
        Admin_Clinic.__super__.constructor.call(this, data);
        this.setTimes();
        this.setResourcesAndPeople();
      }


      /***
      * @ngdoc method
      * @name setResourcesAndPeople
      * @methodOf BB.Models:Admin.ClinicModel
      *
      * @description
      * setResourcesAndPeople
      *
       */

      Admin_Clinic.prototype.setResourcesAndPeople = function() {
        this.resources = _.reduce(this.resource_ids, function(h, id) {
          h[id] = true;
          return h;
        }, {});
        this.people = _.reduce(this.person_ids, function(h, id) {
          h[id] = true;
          return h;
        }, {});
        this.uncovered = !this.person_ids || this.person_ids.length === 0;
        if (this.uncovered) {
          return this.className = "clinic_uncovered";
        } else {
          return this.className = "clinic_covered";
        }
      };


      /***
      * @ngdoc method
      * @name setTimes
      * @methodOf BB.Models:Admin.ClinicModel
      *
      * @description
      * setTimes
      *
       */

      Admin_Clinic.prototype.setTimes = function() {
        if (this.start_time) {
          this.start_time = moment(this.start_time);
          this.start = this.start_time;
        }
        if (this.end_time) {
          this.end_time = moment(this.end_time);
          this.end = this.end_time;
        }
        return this.title = this.name;
      };


      /***
      * @ngdoc getPostData
      * @name setTimes
      * @methodOf BB.Models:Admin.ClinicModel
      *
      * @description
      * getPostData
      *
      * @returns {object} newly created data object
      *
       */

      Admin_Clinic.prototype.getPostData = function() {
        var data, en, id, ref, ref1;
        data = {};
        data.name = this.name;
        data.start_time = this.start_time;
        data.end_time = this.end_time;
        data.resource_ids = [];
        ref = this.resources;
        for (id in ref) {
          en = ref[id];
          if (en) {
            data.resource_ids.push(id);
          }
        }
        data.person_ids = [];
        ref1 = this.people;
        for (id in ref1) {
          en = ref1[id];
          if (en) {
            data.person_ids.push(id);
          }
        }
        console.log(this.address);
        if (this.address) {
          data.address_id = this.address.id;
        }
        return data;
      };


      /***
      * @ngdoc getPostData
      * @name save
      * @methodOf BB.Models:Admin.ClinicModel
      *
      * @description
      * save
      *
      * @returns {function} this.setResourcesAndPeople()
      *
       */

      Admin_Clinic.prototype.save = function() {
        this.person_ids = _.compact(_.map(this.people, function(present, person_id) {
          if (present) {
            return person_id;
          }
        }));
        this.resource_ids = _.compact(_.map(this.resources, function(present, person_id) {
          if (present) {
            return person_id;
          }
        }));
        return this.$put('self', {}, this).then((function(_this) {
          return function(clinic) {
            _this.updateModel(clinic);
            _this.setTimes();
            return _this.setResourcesAndPeople();
          };
        })(this));
      };

      return Admin_Clinic;

    })(BaseModel);
  });

}).call(this);
