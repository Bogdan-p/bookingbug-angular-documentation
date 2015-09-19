
/***
* @ngdoc directive
* @name BBAdminServices.Directives:scheduleEdit
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminServices.Directives:scheduleEdit
*
* # Has the following set of methods:
*
* - link (scope, element, attrs, ngModel)
* - ngModel.$render ()
*
 */

(function() {
  angular.module('BBAdminServices').directive('scheduleEdit', function() {
    var link;
    link = function(scope, element, attrs, ngModel) {
      ngModel.$render = function() {
        return scope.$$value$$ = ngModel.$viewValue;
      };
      return scope.$watch('$$value$$', function(value) {
        if (value != null) {
          return ngModel.$setViewValue(value);
        }
      });
    };
    return {
      link: link,
      templateUrl: 'schedule_edit_main.html',
      require: 'ngModel'
    };
  });

  angular.module('schemaForm').config(function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'schedule', 'schedule_edit_form.html');
    return schemaFormDecoratorsProvider.createDirective('schedule', 'schedule_edit_form.html');
  });

}).call(this);
