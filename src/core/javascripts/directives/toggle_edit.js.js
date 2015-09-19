
/***
* @ngdoc directive
* @name BB.Directives:bbToggleEdit
* @restrict AE
* @replace true
* @scope true
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:bbToggleEdit
*
* <pre>
* restrict: 'AE'
* </pre>
*
* @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$compile more}
*
* @param {service} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window more}
*
* @param {service} $document A jQuery or jqLite wrapper for the browser's window.document object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$document more}
*
*
 */

(function() {
  angular.module('BB.Directives').directive('bbToggleEdit', function($compile, $window, $document) {
    return {
      restrict: 'AE',
      link: function(scope, element, attr) {
        scope.editing = false;
        element.on('dblclick', (function(_this) {
          return function(event) {
            return scope.$apply(function() {
              return scope.editing = true;
            });
          };
        })(this));
        $document.on('click', (function(_this) {
          return function() {
            if (!element.is(':hover')) {
              return scope.$apply(function() {
                return scope.editing = false;
              });
            }
          };
        })(this));
        return true;
      }
    };
  });

}).call(this);
