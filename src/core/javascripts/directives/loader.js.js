(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbLoader
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbLoader
  *
  * Classes or ids will be added to the loading item so they can be styled
  * individually.
  *
  * <pre>
  * Example usage;
   * <div bb-loader>
   * <div bb-loader="#someid">
   * <div bb-loader=".someclass">
  * </pre>
  *
  * Has the following set of methods:
  *
  * - controller($scope)
  * - addScopeId(id)
  * - removeScopeId(id)
  * - showLoader e, cscope)
  * - hideLoader(e, cscope)
  * - link(scope, element, attrs)
  *
   */

  app.directive('bbLoader', function($rootScope, $compile, PathSvc, TemplateSvc) {
    return {
      restrict: 'A',
      replace: false,
      scope: {},
      controllerAs: 'LoaderCtrl',
      controller: function($scope) {
        var addScopeId, hideLoader, parentScopeId, removeScopeId, scopeIdArr, showLoader;
        parentScopeId = $scope.$parent.$id;
        scopeIdArr = [];
        addScopeId = function(id) {
          scopeIdArr.push(id);
          scopeIdArr = _.uniq(scopeIdArr);
        };
        removeScopeId = function(id) {
          scopeIdArr = _.without(scopeIdArr, id);
          return scopeIdArr.length;
        };
        showLoader = function(e, cscope) {
          var sid;
          sid = cscope.$id;
          while (cscope) {
            if (cscope.$id === parentScopeId) {
              addScopeId(sid);
              $scope.scopeLoaded = false;
              break;
            }
            cscope = cscope.$parent;
          }
        };
        hideLoader = function(e, cscope) {
          if (!removeScopeId(cscope.$id)) {
            $scope.scopeLoaded = true;
          }
        };
        $rootScope.$on('show:loader', showLoader);
        $rootScope.$on('hide:loader', hideLoader);
        $scope.scopeLoaded = false;
      },
      link: function(scope, element, attrs) {
        TemplateSvc.get(PathSvc.directivePartial("loader")).then(function(html) {
          var str;
          if (_.isString(attrs.bbLoader)) {
            str = attrs.bbLoader.slice(1);
            if (/^#/.test(attrs.bbLoader)) {
              html.attr('id', str);
            } else if (/^\./.test(attrs.bbLoader)) {
              html.addClass(str);
            }
          }
          element.prepend(html);
          $compile(html)(scope);
        });
      }
    };
  });

}).call(this);
