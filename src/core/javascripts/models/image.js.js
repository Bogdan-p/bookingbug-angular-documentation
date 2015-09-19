(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ImageModel
  *
  * @description
  * This is ImageModel in BB.Models module that creates Image object.
  *
  * <pre>
  * //Creates class Image that extends BaseModel
  * class Image extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $filter Filters are used for formatting data displayed to the user.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$filter more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Image object with the following set of methods:
  *
  * - constructor(data)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ImageModel", function($q, $filter, BBModel, BaseModel) {
    var Image;
    return Image = (function(superClass) {
      extend(Image, superClass);

      function Image(data) {
        Image.__super__.constructor.call(this, data);
      }

      return Image;

    })(BaseModel);
  });

}).call(this);
