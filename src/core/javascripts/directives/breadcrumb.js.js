(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbBreadcrumb
  * @restrict A
  * @scope true
  *
  * @description
  * Directive BB.Directives:bbBreadcrumb
  *
  * <pre>
  * restrict: 'A'
  * replace: true
  * scope : true
  * controller : 'Breadcrumbs'
  * </pre>
  * # Has the following set of methods:
  *
  * - templateUrl(element, attrs)
  * - link(scope)
  *
  * @param {service} PathSvc Info
  * <br>
  * {@link BB.Services:PathSvc more}
  *
   */
  angular.module('BB.Directives').directive('bbBreadcrumb', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: 'Breadcrumbs',
      templateUrl: function(element, attrs) {
        if (_.has(attrs, 'complex')) {
          return PathSvc.directivePartial("_breadcrumb_complex");
        } else {
          return PathSvc.directivePartial("_breadcrumb");
        }
      },
      link: function(scope) {}
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Controllers:Breadcrumbs
  * @restrict A
  * @scope true
  *
  * @description
  * Directive Breadcrumbs
  * <br>
  * Used to load the application's content. It uses ng-include.
  *
  * <pre>
  * loadStep        = $scope.loadStep
  * $scope.steps    = $scope.bb.steps
  * $scope.allSteps = $scope.bb.allSteps
  * </pre>
  * # Has the following set of methods:
  *
  * - $scope.loadStep(number)
  * - lastStep()
  * - currentStep(step)
  * - atDisablePoint()
  * - $scope.isDisabledStep(step)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
   */

  angular.module('BB.Controllers').controller('Breadcrumbs', function($scope) {
    var atDisablePoint, currentStep, lastStep, loadStep;
    loadStep = $scope.loadStep;
    $scope.steps = $scope.bb.steps;
    $scope.allSteps = $scope.bb.allSteps;
    $scope.loadStep = function(number) {
      if (!lastStep() && !currentStep(number) && !atDisablePoint()) {
        return loadStep(number);
      }
    };
    lastStep = function() {
      return $scope.bb.current_step === $scope.bb.allSteps.length;
    };
    currentStep = function(step) {
      return step === $scope.bb.current_step;
    };
    atDisablePoint = function() {
      if (!angular.isDefined($scope.bb.disableGoingBackAtStep)) {
        return false;
      }
      return $scope.bb.current_step >= $scope.bb.disableGoingBackAtStep;
    };
    return $scope.isDisabledStep = function(step) {
      if (lastStep() || currentStep(step.number) || !step.passed || atDisablePoint()) {
        return true;
      } else {
        return false;
      }
    };
  });

}).call(this);
