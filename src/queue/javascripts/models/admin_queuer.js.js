(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:Admin.QueuerModel
  *
  * @description
  * This is Admin.QueuerModel in BB.Models module that creates Admin Queuer object.
  *
  * <pre>
  * //Creates class Admin_ClientQueue that extends BaseModel
  * class Admin_Queuer extends BaseModel
  * </pre>
  *
  * @requires $q
  * @requires BB.Models:BBModel
  * @requires BB.Models:BaseModel
  *
  * @returns {object} Newly created Admin Queuer object with the following set of methods:
  *
  * - constructor()
  * - remaining()
  * - startServing(person)
  * - finishServing()
  * - extendAppointment (minutes)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.QueuerModel", function($q, BBModel, BaseModel) {
    var Admin_Queuer;
    return Admin_Queuer = (function(superClass) {
      extend(Admin_Queuer, superClass);

      function Admin_Queuer(data) {
        Admin_Queuer.__super__.constructor.call(this, data);
        this.start = moment.parseZone(this.start);
        this.due = moment.parseZone(this.due);
        this.end = moment(this.start).add(this.duration, 'minutes');
      }

      Admin_Queuer.prototype.remaining = function() {
        var d;
        d = this.due.diff(moment.utc(), 'seconds');
        this.remaining_signed = Math.abs(d);
        return this.remaining_unsigned = d;
      };

      Admin_Queuer.prototype.startServing = function(person) {
        var defer;
        defer = $q.defer();
        if (this.$has('start_serving')) {
          person.$flush('self');
          this.$post('start_serving', {
            person_id: person.id
          }).then((function(_this) {
            return function(q) {
              person.$get('self').then(function(p) {
                return person.updateModel(p);
              });
              _this.updateModel(q);
              return defer.resolve(_this);
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

      Admin_Queuer.prototype.finishServing = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('finish_serving')) {
          this.$post('finish_serving').then((function(_this) {
            return function(q) {
              _this.updateModel(q);
              return defer.resolve(_this);
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

      Admin_Queuer.prototype.extendAppointment = function(minutes) {
        var d, defer, new_duration;
        defer = $q.defer();
        if (this.end.isBefore(moment())) {
          d = moment.duration(moment().diff(this.start));
          new_duration = d.as('minutes') + minutes;
        } else {
          new_duration = this.duration + minutes;
        }
        this.$put('self', {}, {
          duration: new_duration
        }).then((function(_this) {
          return function(q) {
            _this.updateModel(q);
            _this.end = moment(_this.start).add(_this.duration, 'minutes');
            return defer.resolve(_this);
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      return Admin_Queuer;

    })(BaseModel);
  });

}).call(this);
