
/***
* @ngdoc directive
* @name BB.Directives:ngOptions
* @restrict A
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:ngOptions
*
* there is a some sort of 'redraw' bug in IE with select menus which display
* more than one option and the options are dynamically inserted. So only some of
* the text is displayed in the option until the select element recieves focus,
* at which point all the text is disaplyed. comment out the focus() calls below
* to see what happens.
*
* Has the following set of methods:
* - link(scope, element, attrs)
*
* @param {service} $sniffer AThis is very simple implementation of testing browser's features.
* <br>
* {@link https://github.com/angular/angular.js/blob/master/src/ng/sniffer.js more}
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
 */

(function() {
  angular.module('BB.Directives').directive('ngOptions', function($sniffer, $rootScope) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        var size;
        size = parseInt(attrs['size'], 10);
        if (!isNaN(size) && size > 1 && $sniffer.msie) {
          return $rootScope.$on('loading:finished', function() {
            el.focus();
            return $('body').focus();
          });
        }
      }
    };
  });

}).call(this);
