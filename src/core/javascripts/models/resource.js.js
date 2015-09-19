(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ResourceModel
  *
  * @description
  * This is ResourceModel in BB.Models module that creates Resource object.
  *
  * <pre>
  * //Creates class Resource that extends BaseModel
  * class Resource extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
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
  * @returns {object} Newly created Resource object with the following set of methods:
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ResourceModel", function($q, BBModel, BaseModel) {
    var Resource;
    return Resource = (function(superClass) {
      extend(Resource, superClass);

      function Resource() {
        return Resource.__super__.constructor.apply(this, arguments);
      }

      return Resource;

    })(BaseModel);
  });

}).call(this);
