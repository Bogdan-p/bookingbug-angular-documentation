
/***
* @ndgoc directive
* @name BBQueue.Directives:bbIfLogin
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBQueue.Directives:bbIfLogin
*
* # Has the following set of methods:
*
* - compile()
* - link(scope, element, attrs)
*
* @requires $modal
* @requires $log
* @requires $q
* @requires $rootScope
* @requires BBQueue.Services:AdminQueueService
* @requires BBAdmin.Services:AdminCompanyService
* @requires $compile
* @requires $templateCache
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
*
 */

(function() {
  angular.module('BBQueue').directive('bbIfLogin', function($modal, $log, $q, $rootScope, AdminQueueService, AdminCompanyService, $compile, $templateCache, ModalForm, BBModel) {
    var compile, link;
    compile = function() {
      return {
        pre: function(scope, element, attributes) {
          this.whenready = $q.defer();
          scope.loggedin = this.whenready.promise;
          return AdminCompanyService.query(attributes).then(function(company) {
            scope.company = company;
            return this.whenready.resolve();
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


  /***
  * @ndgoc directive
  * @name BBQueue.Directives:bbQueueDashboard
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBQueue.Directives:bbQueueDashboard
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
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

  angular.module('BBQueue').directive('bbQueueDashboard', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getSetup();
      });
    };
    return {
      link: link,
      controller: 'bbQueueDashboardController'
    };
  });


  /***
  * @ndgoc directive
  * @name BBQueue.Directives:bbQueues
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBQueue.Directives:bbQueues
  *
  * # Has the following set of methods:
  *
  * - compile()
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

  angular.module('BBQueue').directive('bbQueues', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getQueues();
      });
    };
    return {
      link: link,
      controller: 'bbQueues'
    };
  });


  /***
  * @ndgoc directive
  * @name BBQueue.Directives:bbQueueServers
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBQueue.Directives:bbQueueServers
  *
  * # Has the following set of methods:
  *
  * - compile()
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

  angular.module('BBQueue').directive('bbQueueServers', function($modal, $log, $rootScope, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      return scope.loggedin.then(function() {
        return scope.getServers();
      });
    };
    return {
      link: link,
      controller: 'bbQueueServers'
    };
  });

}).call(this);
