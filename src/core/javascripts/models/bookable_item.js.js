(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:BookableItemModel
  *
  * @description
  * This is BookableItemModel in BB.Models module that creates BookableItem object.
  *
  * <pre>
  * //Creates class BookableItem that extends BaseModel
  * class BookableItem extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created BookableItem object with the following set of methods:
  *
  * - constructor(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("BookableItemModel", function($q, BBModel, BaseModel) {
    var BookableItem;
    return BookableItem = (function(superClass) {
      extend(BookableItem, superClass);

      BookableItem.prototype.item = null;

      BookableItem.prototype.promise = null;

      function BookableItem(data) {
        BookableItem.__super__.constructor.apply(this, arguments);
        this.name = "-Waiting-";
        this.ready = $q.defer();
        this.promise = this._data.$get('item');
        this.promise.then((function(_this) {
          return function(val) {
            var m, n, ref, ref1, ref2;
            if (val.type === "person") {
              _this.item = new BBModel.Person(val);
              if (_this.item) {
                ref = _this.item._data;
                for (n in ref) {
                  m = ref[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _this[n] = m;
                  }
                }
                return _this.ready.resolve();
              } else {
                return _this.ready.resolve();
              }
            } else if (val.type === "resource") {
              _this.item = new BBModel.Resource(val);
              if (_this.item) {
                ref1 = _this.item._data;
                for (n in ref1) {
                  m = ref1[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _this[n] = m;
                  }
                }
                return _this.ready.resolve();
              } else {
                return _this.ready.resolve();
              }
            } else if (val.type === "service") {
              _this.item = new BBModel.Service(val);
              if (_this.item) {
                ref2 = _this.item._data;
                for (n in ref2) {
                  m = ref2[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _this[n] = m;
                  }
                }
                return _this.ready.resolve();
              } else {
                return _this.ready.resolve();
              }
            }
          };
        })(this));
      }

      return BookableItem;

    })(BaseModel);
  });

}).call(this);
