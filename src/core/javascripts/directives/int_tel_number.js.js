(function() {
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:intTelNumber
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:intTelNumber
  *
  * International Telephone Input directive
  *
  * http://www.tooorangey.co.uk/posts/that-international-telephone-input-umbraco-7-property-editor/
  *
  * https://github.com/Bluefieldscom/intl-tel-input
  *
  * <pre>
  * restrict: "A"
  * require: "ngModel"
  * </pre>
  *
  * Has the following set of methods:
  *
  * - link(scope, element, attrs, ctrl)
  * - convertNumber(value)
  *
   */

  app.directive("intTelNumber", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ctrl) {
        var convertNumber, options;
        options = scope.$eval(attrs.intTelNumber);
        element.intlTelInput(options);
        convertNumber = function(value) {
          var str;
          str = "";
          if (scope.$eval(attrs.ngModel + '_prefix') != null) {
            str += "+" + scope.$eval(attrs.ngModel + '_prefix') + " ";
          }
          if (scope.$eval(attrs.ngModel) != null) {
            str += scope.$eval(attrs.ngModel);
          }
          if (str[0] === "+") {
            element.intlTelInput("setNumber", "+" + (scope.$eval(attrs.ngModel + '_prefix')) + " " + (scope.$eval(attrs.ngModel)));
            ctrl.$setValidity("pattern", true);
          }
          return str;
        };
        return ctrl.$formatters.push(convertNumber);
      }
    };
  });

}).call(this);
