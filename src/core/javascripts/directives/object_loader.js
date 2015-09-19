(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:script
  * @restrict E
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:script
  *
  * <pre>
  * transclude: false,
  * restrict: 'E'
  * </pre>
  *
  * Has the following set of methods:
  * - link(scope, element, attrs)
  *
  * {@link https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements more about transclude}
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {model} halClient Info
  * <br>
  * {@link angular-hal:halClient more}
  *
   */

  app.directive('script', function($compile, halClient) {
    return {
      transclude: false,
      restrict: 'E',
      link: function(scope, element, attrs) {
        var body, json, res;
        if (attrs.type === 'text/hal-object') {
          body = element[0].innerText;
          json = $bbug.parseJSON(body);
          return res = halClient.$parse(json);
        }
      }
    };
  });

}).call(this);
