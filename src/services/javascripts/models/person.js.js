(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.PersonModel
  *
  * @description
  * path: src/services/javascripts/models/person.js.coffee
  *
  * Creates Admin_Person object.
  *
  * <pre>
  * angular.module('BB.Models').factory "Admin.PersonModel", ($q, BBModel, BaseModel, PersonModel) ->
  *   class Admin_Person extends PersonModel
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

  angular.module('BB.Models').factory("Admin.PersonModel", function($q, BBModel, BaseModel, PersonModel) {
    var Admin_Person;
    return Admin_Person = (function(superClass) {
      extend(Admin_Person, superClass);


      /***
      * @ngdoc method
      * @name constructor
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * constructor
      *
      * @param {object} data data
      *
      * @returns {function} this.setCurrentCustomer()
      *
       */

      function Admin_Person(data) {
        Admin_Person.__super__.constructor.call(this, data);
        if (!this.queuing_disabled) {
          this.setCurrentCustomer();
        }
      }


      /***
      * @ngdoc method
      * @name setCurrentCustomer
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * setCurrentCustomer
      *
      * @returns {Promise} defeder.promise
      *
       */

      Admin_Person.prototype.setCurrentCustomer = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('queuer')) {
          this.$get('queuer').then((function(_this) {
            return function(queuer) {
              _this.serving = new BBModel.Admin.Queuer(queuer);
              return defer.resolve(_this.serving);
            };
          })(this), function(err) {
            return defer.reject(err);
          });
        } else {
          defer.resolve();
        }
        return defer.promise;
      };


      /***
      * @ngdoc method
      * @name setAttendance
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * setCurrentCustomer
      *
      * @param {object} status status
      *
      * @returns {Promise} defeder.promise
      *
       */

      Admin_Person.prototype.setAttendance = function(status) {
        var defer;
        defer = $q.defer();
        this.$put('attendance', {}, {
          status: status
        }).then((function(_this) {
          return function(p) {
            _this.updateModel(p);
            return defer.resolve(_this);
          };
        })(this), (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
        return defer.promise;
      };


      /***
      * @ngdoc method
      * @name finishServing
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * finishServing
      *
      * @returns {Promise} defeder.promise
      *
       */

      Admin_Person.prototype.finishServing = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('finish_serving')) {
          this.$flush('self');
          this.$post('finish_serving').then((function(_this) {
            return function(q) {
              _this.$get('self').then(function(p) {
                return _this.updateModel(p);
              });
              _this.serving = null;
              return defer.resolve(q);
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
        } else {
          defer.reject('finish_serving link not available');
        }
        return defer.promise;
      };


      /***
      * @ngdoc method
      * @name isAvailable
      * @methodOf BB.Models:Admin.PersonModel
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

      Admin_Person.prototype.isAvailable = function(start, end) {
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


      /***
      * @ngdoc method
      * @name startServing
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * startServing
      *
      * @param {object} queuer queuer
      *
      * @returns {Promise} defeder.promise
      *
       */

      Admin_Person.prototype.startServing = function(queuer) {
        var defer, params;
        defer = $q.defer();
        if (this.$has('start_serving')) {
          this.$flush('self');
          params = {
            queuer_id: queuer ? queuer.id : null
          };
          this.$post('start_serving', params).then((function(_this) {
            return function(q) {
              _this.$get('self').then(function(p) {
                return _this.updateModel(p);
              });
              _this.serving = q;
              return defer.resolve(q);
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
        } else {
          defer.reject('start_serving link not available');
        }
        return defer.promise;
      };


      /***
      * @ngdoc method
      * @name getQueuers
      * @methodOf BB.Models:Admin.PersonModel
      *
      * @description
      * getQueuers
      *
      * @returns {Promise} defeder.promise
      *
       */

      Admin_Person.prototype.getQueuers = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('queuers')) {
          this.$flush('queuers');
          this.$get('queuers').then((function(_this) {
            return function(collection) {
              return collection.$get('queuers').then(function(queuers) {
                var models, q;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = queuers.length; i < len; i++) {
                    q = queuers[i];
                    results.push(new BBModel.Admin.Queuer(q));
                  }
                  return results;
                })();
                _this.queuers = models;
                return defer.resolve(models);
              }, function(err) {
                return defer.reject(err);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
        } else {
          defer.reject('queuers link not available');
        }
        return defer.promise;
      };

      return Admin_Person;

    })(PersonModel);
  });

}).call(this);
