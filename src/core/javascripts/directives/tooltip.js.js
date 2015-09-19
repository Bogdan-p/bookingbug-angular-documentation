
/***
* @ngdoc directive
* @name BB.Directives:popover
* @restrict EA
* @priority: -1000
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:popover
*
*  The default behavior for the 'click' event for the popover is to hide the
*  popover if the click occurs on the element but it doesn't hide if you click
*  anywhere else as the event has to occur on the element. So we add additional
*  check on the container to check if the popover is still open on a click
*  event. Clearly this will fail if the event propogation is stopped in the
*  code, but that is bad practise so shouldn't be happening.
*
* <pre>
* restrict: 'EA',
* priority: -1000,
* </pre>
* - link(scope, element)
*
 */

(function() {
  angular.module('BB.Directives').directive('popover', function() {
    var openElement, openScope;
    openElement = null;
    openScope = null;
    $('div[ng-controller="BBCtrl"]').off('.bbtooltip').on('click.bbtooltip', function(e) {
      var target;
      target = $(e.target).closest('[popover]')[0];
      if (!target && openElement && openScope) {
        $(openElement).next('.popover').remove();
        openScope.tt_isOpen = false;
      }
      return true;
    });
    return {
      restrict: 'EA',
      priority: -1000,
      link: function(scope, element) {
        element.on('click.bbtooltip', function(e) {
          if (openElement === $(e.target).closest('[popover]')[0]) {
            e.preventDefault();
            return;
          }
          if (openElement && openScope) {
            $(openElement).next('.popover').remove();
            openScope.tt_isOpen = false;
          }
          openElement = element[0];
          return openScope = scope;
        });
        return scope.$on('$destroy', function() {
          return $(element).off('.bbtooltip');
        });
      }
    };
  });

}).call(this);
