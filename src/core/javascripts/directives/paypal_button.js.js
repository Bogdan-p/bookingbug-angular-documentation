(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPaypal
  * @restrict A
  * @replace true
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbPaypal
  *
  * <pre>
  * restrict: 'A'
  * replace: true
  * scope : {
  *   ppDetails : "=bbPaypal"
  * }
  * templateUrl : PathSvc.directivePartial "paypal_button"
  * </pre>
  *
  * Has the following set of methods:
  * - link(scope, element, attrs)
  *
  * @param {service} PathSvc Info
  * <br>
  * {@link BB.Services:PathSvc more}
  *
   */

  app.directive('bbPaypal', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        ppDetails: "=bbPaypal"
      },
      templateUrl: PathSvc.directivePartial("paypal_button"),
      link: function(scope, element, attrs) {
        var keys;
        scope.inputs = [];
        if (!scope.ppDetails) {
          return;
        }
        keys = _.keys(scope.ppDetails);
        return _.each(keys, function(keyName) {
          var obj;
          obj = {
            name: keyName,
            value: scope.ppDetails[keyName]
          };
          return scope.inputs.push(obj);
        });
      }
    };
  });

}).call(this);
