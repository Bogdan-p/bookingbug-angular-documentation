(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:CompanyModel
  *
  * @description
  * This is CompanyModel in BB.Models module that creates Company object.
  *
  * <pre>
  * //Creates class Company that extends BaseModel
  * class Company extends BaseModel
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
  * @param {model} halClient Info
  *
  * @returns {object} Newly created Company object with the following set of methods:
  *
  * - constructor(data)
  * - getCompanyByRef(ref)
  * - findChildCompany(id)
  * - getSettings()
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("CompanyModel", function($q, BBModel, BaseModel, halClient) {
    var Company;
    return Company = (function(superClass) {
      extend(Company, superClass);

      function Company(data) {
        Company.__super__.constructor.call(this, data);
        if (this.companies) {
          this.companies = _.map(this.companies, function(c) {
            return new BBModel.Company(halClient.$parse(c));
          });
        }
      }

      Company.prototype.getCompanyByRef = function(ref) {
        var defer;
        defer = $q.defer();
        this.$get('companies').then(function(companies) {
          var company;
          company = _.find(companies, function(c) {
            return c.reference === ref;
          });
          if (company) {
            return defer.resolve(company);
          } else {
            return defer.reject('No company for ref ' + ref);
          }
        }, function(err) {
          console.log('err ', err);
          return defer.reject(err);
        });
        return defer.promise;
      };

      Company.prototype.findChildCompany = function(id) {
        var c, cname, i, j, len, len1, name, ref1, ref2;
        if (!this.companies) {
          return null;
        }
        ref1 = this.companies;
        for (i = 0, len = ref1.length; i < len; i++) {
          c = ref1[i];
          if (c.id === parseInt(id)) {
            return c;
          }
          if (c.ref && c.ref === String(id)) {
            return c;
          }
        }
        if (typeof id === "string") {
          name = id.replace(/[\s\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '').toLowerCase();
          ref2 = this.companies;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            c = ref2[j];
            cname = c.name.replace(/[\s\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '').toLowerCase();
            if (name === cname) {
              return c;
            }
          }
        }
        return null;
      };

      Company.prototype.getSettings = function() {
        var def;
        def = $q.defer();
        if (this.settings) {
          def.resolve(this.settings);
        } else {
          if (this.$has('settings')) {
            this.$get('settings').then((function(_this) {
              return function(set) {
                _this.settings = new BBModel.CompanySettings(set);
                return def.resolve(_this.settings);
              };
            })(this));
          } else {
            def.reject("Company has no settings");
          }
        }
        return def.promise;
      };

      return Company;

    })(BaseModel);
  });

}).call(this);
