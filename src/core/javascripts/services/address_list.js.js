
/***
* @ngdoc service
* @name BB.Services:AddressListService
*
* @description
* Factory AddressListService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window more}
*
* @param {model} halClient Info
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
* - getAddress(prms)
*
 */

(function() {
  angular.module('BB.Services').factory("AddressListService", function($q, $window, halClient, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/company/{company_id}/addresses/{post_code}";
        uri = new UriTemplate(href).fillFromObject({
          company_id: prms.company.id,
          post_code: prms.post_code
        });
        halClient.$get(uri, {}).then(function(addressList) {
          return deferred.resolve(addressList);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      getAddress: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/company/{company_id}/addresses/address/{id}";
        uri = new UriTemplate(href).fillFromObject({
          company_id: prms.company.id,
          id: prms.id
        });
        halClient.$get(uri, {}).then(function(customerAddress) {
          return deferred.resolve(customerAddress);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
