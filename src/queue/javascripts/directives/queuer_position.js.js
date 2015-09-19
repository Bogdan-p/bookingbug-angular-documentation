(function() {
  'use strict';

  /***
  * @ndgoc directive
  * @name BBQueue.Directives:bbQueuerPosition
  *
  * @restrict EA
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBQueue.Directives:bbQueuerPosition
  *
  * <pre>
  *  restrict: 'AE'
  *  replace: true
  *  controller: 'QueuerPosition'
  *  templateUrl: 'queuer_position.html'
  * </pre>
  *
   */
  angular.module('BBQueue.Directives').directive('bbQueuerPosition', function() {
    return {
      restrict: 'AE',
      replace: true,
      controller: 'QueuerPosition',
      templateUrl: 'queuer_position.html',
      scope: {
        id: '=',
        apiUrl: '@'
      }
    };
  });

}).call(this);
