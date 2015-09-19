(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Day = (function(superClass) {
    extend(Day, superClass);

    function Day() {
      return Day.__super__.constructor.apply(this, arguments);
    }

    Day.prototype.checkItem = function(item) {
      return Day.__super__.checkItem.apply(this, arguments);
    };

    return Day;

  })(window.Collection.Base);


  /***
  * @ngdoc object
  * @name BB.Services:DayCollections
  *
  * @description
  * It creates new DayCollections
  *
  * # Has the following set of methods:
  *
  * - $get
  *
   */

  angular.module('BB.Services').provider("DayCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);
