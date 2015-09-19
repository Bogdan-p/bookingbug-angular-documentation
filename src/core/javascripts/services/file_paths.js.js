
/***
* @ngdoc service
* @name BB.Services:PathSvc
*
* @description
* Factory PathSvc
*
* @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$sce more}
*
* @param {object} AppConfig Info
* <br>
* {@link AppConfig more}
*
* @returns {Promise} This service has the following set of methods:
*
* - directivePartial(fileName)
*
 */

(function() {
  angular.module('BB.Services').factory('PathSvc', function($sce, AppConfig) {
    return {
      directivePartial: function(fileName) {
        var partial_url;
        if (AppConfig.partial_url) {
          partial_url = AppConfig.partial_url;
          return $sce.trustAsResourceUrl(partial_url + "/" + fileName + ".html");
        } else {
          return $sce.trustAsResourceUrl(fileName + ".html");
        }
      }
    };
  });

}).call(this);
