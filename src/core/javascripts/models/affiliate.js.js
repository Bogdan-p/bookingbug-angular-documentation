(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:AffiliateModel
  *
  * @description
  * This is AffiliateModel in BB.Models module that creates Affiliate object.
  *
  * <pre>
  * //Creates class Affiliate that extends BaseModel
  * class Affiliate extends BaseModel
  * </pre>
  *
  * @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @requires {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @requires {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @returns {object} Newly created Affiliate object with the following set of methods:
  *
  * - constructor(data)
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AffiliateModel", function($q, BBModel, BaseModel) {
    var Affiliate;
    return Affiliate = (function(superClass) {
      extend(Affiliate, superClass);

      function Affiliate(data) {
        Affiliate.__super__.constructor.call(this, data);
        this.test = 1;
      }

      Affiliate.prototype.getCompanyByRef = function(ref) {
        var defer;
        defer = $q.defer();
        this.$get('companies', {
          reference: ref
        }).then(function(company) {
          if (company) {
            return defer.resolve(new BBModel.Company(company));
          } else {
            return defer.reject('No company for ref ' + ref);
          }
        }, function(err) {
          console.log('err ', err);
          return defer.reject(err);
        });
        return defer.promise;
      };

      return Affiliate;

    })(BaseModel);
  });

}).call(this);
