
/***
* @ngdoc service
* @name BB.Services:DayService
*
* @description
* Factory DayService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
*
 */

(function() {
  angular.module('BB.Services').factory("DayService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred, extra;
        deferred = $q.defer();
        if (prms.cItem.days_link) {
          extra = {};
          extra.month = prms.month;
          extra.date = prms.date;
          extra.edate = prms.edate;
          if (prms.client) {
            extra.location = prms.client.addressCsvLine();
          }
          if (prms.cItem.person && !prms.cItem.anyPerson()) {
            extra.person_id = prms.cItem.person.id;
          }
          if (prms.cItem.resource && !prms.cItem.anyResource()) {
            extra.resource_id = prms.cItem.resource.id;
          }
          prms.cItem.days_link.$get('days', extra).then((function(_this) {
            return function(found) {
              var afound, days, i, j, len;
              afound = found.days;
              days = [];
              for (j = 0, len = afound.length; j < len; j++) {
                i = afound[j];
                if (i.type === prms.item) {
                  days.push(new BBModel.Day(i));
                }
              }
              return deferred.resolve(days);
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        } else {
          deferred.reject("No Days Link found");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
