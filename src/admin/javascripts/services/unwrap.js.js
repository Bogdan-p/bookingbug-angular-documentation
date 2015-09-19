
/***
* @ngdoc service
* @name  BBAdmin.Services:BB.Service.login
*
* @description
* Factory BB.Service.login
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
 */

(function() {
  angular.module('BB.Services').factory("BB.Service.login", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Login(resource);
      }
    };
  });


  /***
  * @ngdoc service
  * @name  BBAdmin.Services:BB.Service.base_login
  *
  * @description
  * Factory BB.Service.base_login
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
   */

  angular.module('BB.Services').factory("BB.Service.base_login", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Login(resource);
      }
    };
  });

}).call(this);
