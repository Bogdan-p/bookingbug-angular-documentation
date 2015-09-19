(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Clinic = (function(superClass) {
    extend(Clinic, superClass);

    function Clinic() {
      return Clinic.__super__.constructor.apply(this, arguments);
    }

    Clinic.prototype.checkItem = function(item) {
      return Clinic.__super__.checkItem.apply(this, arguments);
    };

    Clinic.prototype.matchesParams = function(item) {
      if (this.params.start_date) {
        this.start_date || (this.start_date = moment(this.params.start_date));
        if (this.start_date.isAfter(item.date)) {
          return false;
        }
      }
      if (this.params.end_date) {
        this.end_date || (this.end_date = moment(this.params.end_date));
        if (this.end_date.isBefore(item.date)) {
          return false;
        }
      }
      return true;
    };

    return Clinic;

  })(window.Collection.Base);


  /***
  * @ngdoc object
  * @name BBAdmin.Services:ClinicCollections
  *
  * @description
  * It creates new Base Collections
  *
  * # Has the following set of methods:
  * - $get
  *
   */

  angular.module('BBAdmin.Services').provider("ClinicCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);
