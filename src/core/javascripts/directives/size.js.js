(function() {
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbDisplayMode
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  * Directive BB.Directives:bbDisplayMode
  *
  * * <pre>
  * transclude: false,
  * restrict: 'A',
  * template: '<span class="visible-xs"></span>
  *           <span class="visible-sm"></span>
  *           <span class="visible-md"></span>
  *           <span class="visible-lg"></span>'
  * </pre>
  *
  * Has the following set of methods:
  *
  * - link(scope, elem, attrs)
  * - isVisible(element)
  * - getCurrentSize()
  * - update()
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
   */

  app.directive('bbDisplayMode', function($compile, $window, $bbug) {
    return {
      transclude: false,
      restrict: 'A',
      template: '<span class="visible-xs"></span><span class="visible-sm"></span><span class="visible-md"></span><span class="visible-lg"></span>',
      link: function(scope, elem, attrs) {
        var getCurrentSize, isVisible, markers, t, update;
        markers = elem.find('span');
        $bbug(elem).addClass("bb-display-mode");
        scope.display = {};
        isVisible = function(element) {
          return element && element.style.display !== 'none' && element.offsetWidth && element.offsetHeight;
        };
        getCurrentSize = function() {
          var element, i, len;
          for (i = 0, len = markers.length; i < len; i++) {
            element = markers[i];
            if (isVisible(element)) {
              return element.className.slice(8, 11);
            }
            scope.display = {};
            scope.display[element.className.slice(8, 11)] = true;
            return false;
          }
        };
        update = (function(_this) {
          return function() {
            var nsize;
            nsize = getCurrentSize();
            if (nsize !== _this.currentSize) {
              _this.currentSize = nsize;
              scope.display.xs = false;
              scope.display.sm = false;
              scope.display.md = false;
              scope.display.lg = false;
              scope.display.not_xs = true;
              scope.display.not_sm = true;
              scope.display.not_md = true;
              scope.display.not_lg = true;
              scope.display[nsize] = true;
              scope.display["not_" + nsize] = false;
              return true;
            }
            return false;
          };
        })(this);
        t = null;
        angular.element($window).bind('resize', (function(_this) {
          return function() {
            window.clearTimeout(t);
            return t = setTimeout(function() {
              if (update()) {
                return scope.$apply();
              }
            }, 50);
          };
        })(this));
        return angular.element($window).bind('load', (function(_this) {
          return function() {
            if (update()) {
              return scope.$apply();
            }
          };
        })(this));
      }
    };
  });

}).call(this);
