
/***
* @ngdoc directive
* @name BB.Directives:datetimepicker
*
* @description
* Directive BB.Directives:datetimepicker
*
* # Has the following set of methods:
*
* -  controller($scope)
* - link(scope, element, attrs, ngModel)
*
* <pre>
* require: 'ngModel'
* link: link
* controller: controller
* scope:
* schemaValidate: '='
* templateUrl: 'datetimepicker.html'
* <pre>
*
*
 */

(function() {
  angular.module('BB.Directives').directive('datetimepicker', function() {
    var controller, link;
    controller = function($scope) {
      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      return $scope.$watch('$$value$$', function(value) {
        if (value != null) {
          return $scope.updateModel(value);
        }
      });
    };
    link = function(scope, element, attrs, ngModel) {
      ngModel.$render = function() {
        if (ngModel.$viewValue) {
          if (moment.isMoment(ngModel.$viewValue)) {
            return scope.$$value$$ = ngModel.$viewValue.format();
          } else {
            return scope.$$value$$ = ngModel.$viewValue;
          }
        } else {
          return scope.$$value$$ = scope.schemaValidate.schema["default"];
        }
      };
      return scope.updateModel = function(value) {
        return ngModel.$setViewValue(moment(value).format());
      };
    };
    return {
      require: 'ngModel',
      link: link,
      controller: controller,
      scope: {
        schemaValidate: '='
      },
      templateUrl: 'datetimepicker.html'
    };
  });

}).call(this);
