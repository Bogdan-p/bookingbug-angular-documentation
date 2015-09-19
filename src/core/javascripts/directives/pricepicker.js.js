
/***
* @ngdoc directive
* @name BB.Directives:pricepicker
* @link link
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:pricepicker
*
* <pre>
* require: 'ngModel'
* link: link
* controller: controller
* scope: {
*   currency: '@'
* }
* template: """
* </pre>
*
* Has the following set of methods:
*
* - controller($scope)
* - link(scope, element, attrs, ngModel)
* - ngModel.$render()
* - scope.updateModel(value)
*
 */

(function() {
  angular.module('BB.Directives').directive('pricepicker', function() {
    var controller, link;
    controller = function($scope) {
      return $scope.$watch('price', function(price) {
        if (price != null) {
          return $scope.updateModel(price);
        }
      });
    };
    link = function(scope, element, attrs, ngModel) {
      ngModel.$render = function() {
        if (ngModel.$viewValue) {
          return scope.price = ngModel.$viewValue;
        }
      };
      return scope.updateModel = function(value) {
        return ngModel.$setViewValue(value);
      };
    };
    return {
      require: 'ngModel',
      link: link,
      controller: controller,
      scope: {
        currency: '@'
      },
      template: "<span>{{0 | currency: currency | limitTo: 1}}</span>\n<input type=\"number\" ng-model=\"price\" class=\"form-control\" step=\"0.01\">"
    };
  });

}).call(this);
