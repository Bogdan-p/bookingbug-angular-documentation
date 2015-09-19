
/***
* @ndgoc directive
* @name BBQueue.Directives:bbAdminQueueTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBQueue.Directives:bbAdminQueueTable
*
* # Has the following set of methods:
*
* - link(scope, element, attrs)
*
* @requires $modal
* @requires $log
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
  angular.module('BBQueue').directive('bbAdminQueueTable', function($modal, $log, $rootScope, AdminQueueService, AdminCompanyService, $compile, $templateCache, ModalForm, BBModel) {
    var link;
    link = function(scope, element, attrs) {
      scope.fields || (scope.fields = ['ticket_number', 'first_name', 'last_name', 'email']);
      if (scope.company) {
        return scope.getQueuers();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getQueuers();
        });
      }
    };
    return {
      link: link,
      controller: 'bbQueuers',
      templateUrl: 'queuer_table.html'
    };
  });

}).call(this);
