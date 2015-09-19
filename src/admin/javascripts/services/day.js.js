
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminDayService
*
* @description
* Factory AdminDayService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window read more}
*
* @param {model} halClient Info
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminDayService', function($q, $window, halClient, BBModel, UriTemplate) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminDayService
      *
      * @description
      * Method query
      *
      * @param {object} prms Info
      *
      * @returns {Promise} deferred.promise
       */
      query: function(prms) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/day_data{?month,week,date,edate,event_id,service_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            var item, j, len, mdays, ref;
            if (found.items) {
              mdays = [];
              ref = found.items;
              for (j = 0, len = ref.length; j < len; j++) {
                item = ref[j];
                halClient.$get(item.uri).then(function(data) {
                  var days, dcol, i, k, len1, ref1;
                  days = [];
                  ref1 = data.days;
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    i = ref1[k];
                    if (i.type === prms.item) {
                      days.push(new BBModel.Day(i));
                    }
                  }
                  dcol = new $window.Collection.Day(data, days, {});
                  return mdays.push(dcol);
                });
              }
              return deferred.resolve(mdays);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
