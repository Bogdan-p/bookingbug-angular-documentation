(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbContentNew
  * @restrict A
  * @scope true;
  *
  * @description
  * Directive BB.Directives:bbContentNew
  *
  * <pre>
  * restrict: 'A'
  * replace: true
  * scope : true
  * templateUrl : PathSvc.directivePartial "content_main"
  * </pre>
  * # Has the following set of methods:
  *
  * - controller($scope)
  *
  * @param {service} PathSvc Info
  * <br>
  * {@link BB.Services:PathSvc more}
  *
   */

  app.directive('bbContentNew', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: PathSvc.directivePartial("content_main"),
      controller: function($scope) {
        $scope.initPage = function() {
          return $scope.$eval('setPageLoaded()');
        };
      }
    };
  });

}).call(this);
