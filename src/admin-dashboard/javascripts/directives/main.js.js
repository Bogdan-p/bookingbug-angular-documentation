
/***
* @ngdoc directive
* @name BBAdminDashboard.Directives:bbIfLogin
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminDashboard.Directives:bbIfLogin
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
  angular.module('BBAdminDashboard').directive('bbIfLogin', function($modal, $log, $q, $rootScope, AdminCompanyService, $compile, $templateCache, ModalForm, BBModel) {
    var compile, link;
    compile = function() {
      return {
        pre: function(scope, element, attributes) {
          scope.notLoaded = function(sc) {
            return null;
          };
          scope.setLoaded = function(sc) {
            return null;
          };
          scope.setPageLoaded = function() {
            return null;
          };
          $rootScope.start_deferred = $q.defer();
          $rootScope.connection_started = $rootScope.start_deferred.promise;
          this.whenready = $q.defer();
          scope.loggedin = this.whenready.promise;
          return AdminCompanyService.query(attributes).then(function(company) {
            scope.company = company;
            scope.bb || (scope.bb = {});
            scope.bb.company = company;
            this.whenready.resolve();
            return $rootScope.start_deferred.resolve();
          });
        },
        post: function(scope, element, attributes) {}
      };
    };
    link = function(scope, element, attrs) {};
    return {
      compile: compile
    };
  });

}).call(this);
