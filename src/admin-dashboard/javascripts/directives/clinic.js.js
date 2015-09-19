
/***
* @ngdoc directive
* @name BBAdminDashboard.Directives:bbClinicDashboard
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminDashboard.Directives:bbClinicDashboard
*
* # Has the following set of methods:
*
* - controller 'bbClinicDashboardController'
*
* @requires $modal
* @requires $log
* @requires $rootScope
* @requires $compile
* @requires $templateCache
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
*
 */

(function() {
  angular.module('BBAdminDashboard').directive('bbClinicDashboard', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getClinicSetup();
      });
    };
    return {
      link: link,
      controller: 'bbClinicDashboardController'
    };
  });


  /***
  * @ngdoc directive
  * @name BBAdminDashboard.Directives:bbClinicCal
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBAdminDashboard.Directives:bbClinicCal
  *
  * # Has the following set of methods:
  * -controller 'bbClinicCalController'
  *
  * @requires $modal
  * @requires $log
  * @requires $rootScope
  * @requires $compile
  * @requires $templateCache
  * @requires BB.Services:ModalForm
  * @requires BB.Models:BBModel
  *
   */

  angular.module('BBAdminDashboard').directive('bbClinicCal', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getClinicCalSetup();
      });
    };
    return {
      link: link,
      controller: 'bbClinicCalController'
    };
  });


  /***
  * @ngdoc directive
  * @name BBAdminDashboard.Directives:bbClinic
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBAdminDashboard.Directives:bbClinic
  *
  * # Has the following set of methods:
  * -controller 'bbClinicController'
  *
  * @requires $modal
  * @requires $log
  * @requires $rootScope
  * @requires $compile
  * @requires $templateCache
  * @requires BB.Services:ModalForm
  * @requires BB.Models:BBModel
  *
   */

  angular.module('BBAdminDashboard').directive('bbClinic', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getClinicItemSetup();
      });
    };
    return {
      link: link,
      controller: 'bbClinicController'
    };
  });

}).call(this);
