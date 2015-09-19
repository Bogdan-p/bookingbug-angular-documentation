(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Space = (function(superClass) {
    extend(Space, superClass);

    function Space() {
      return Space.__super__.constructor.apply(this, arguments);
    }

    Space.prototype.checkItem = function(item) {
      return Space.__super__.checkItem.apply(this, arguments);
    };

    return Space;

  })(window.Collection.Base);


  /***
  * @ngdoc object
  * @name BB.Services:SpaceCollections
  *
  * @description
  * It creates new SpaceCollections
  *
  * # Has the following set of methods:
  *
  * - $get
  *
   */

  angular.module('BB.Services').provider("SpaceCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);
