
/***
* @ngdoc service
* @name BB.Services:RecaptchaService
*
* @description
* Factory RecaptchaService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
* @param {model} halClient Info
*
* @returns {Promise} This service has the following set of methods:
*
* - validateResponse(params)
*
 */

(function() {
  angular.module("BB.Services").factory("RecaptchaService", function($q, halClient, UriTemplate) {
    return {
      validateResponse: function(params) {
        var deferred, href, prms, uri;
        deferred = $q.defer();
        href = params.api_url + "/api/v1/recaptcha";
        uri = new UriTemplate(href);
        prms = {};
        prms.response = params.response;
        halClient.$post(uri, {}, prms).then(function(response) {
          return deferred.resolve(response);
        }, function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  });

}).call(this);
