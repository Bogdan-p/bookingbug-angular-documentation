
/***
* @ngdoc service
* @name BB.Services:GeolocationService
*
* @description
* Factory GeolocationService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @returns {Promise} This service has the following set of methods:
*
* - haversine(position1, position2)
* - geocode(address, prms = {})
*
 */

(function() {
  angular.module('BB.Services').factory('GeolocationService', function($q) {
    return {
      haversine: function(position1, position2) {
        var R, a, c, chLat, chLon, d, dLat, dLon, distance, distances, lat1, lat2, lon1, lon2, pi, rLat1, rLat2;
        pi = Math.PI;
        R = 6371;
        distances = [];
        lat1 = position1.lat;
        lon1 = position1.long;
        lat2 = position2.lat;
        lon2 = position2.long;
        chLat = lat2 - lat1;
        chLon = lon2 - lon1;
        dLat = chLat * (pi / 180);
        dLon = chLon * (pi / 180);
        rLat1 = lat1 * (pi / 180);
        rLat2 = lat2 * (pi / 180);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        d = d * 0.621371192;
        distance = Math.round(d);
        return distance;
      },
      geocode: function(address, prms) {
        var deferred, ne, request, sw;
        if (prms == null) {
          prms = {};
        }
        deferred = $q.defer();
        request = {
          address: address
        };
        if (prms.region) {
          request.region = prms.region;
        }
        if (prms.componentRestrictions) {
          request.componentRestrictions = prms.componentRestrictions;
        }
        if (prms.bounds) {
          sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y);
          ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y);
          request.bounds = new google.maps.LatLngBounds(sw, ne);
        }
        new google.maps.Geocoder().geocode(request, function(results, status) {
          if (results && status === 'OK') {
            return deferred.resolve({
              results: results,
              status: status
            });
          } else {
            return deferred.reject(status);
          }
        });
        return deferred.promise;
      }
    };
  });

}).call(this);
