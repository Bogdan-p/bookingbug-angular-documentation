(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbGetAvailability
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbGetAvailability
  *
  * See Controller {@link BB.Controllers:GetAvailability GetAvailability}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'GetAvailability'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbGetAvailability', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'GetAvailability',
      link: function(scope, element, attrs) {
        if (attrs.bbGetAvailability) {
          scope.loadAvailability(scope.$eval(attrs.bbGetAvailability));
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:GetAvailability
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller GetAvailability
  *
  * # Has the following set of methods:
  *
  * - $scope.loadAvailability(prms)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {function} $element angular.element AWraps a raw DOM element or HTML string as a jQuery element.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/function/angular.element more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} AdminTimeService Info
  * <br>
  * {@link BBAdmin.Services:AdminTimeService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} halClient Info
  * <br>
  * {@link angular-hal:halClient more}
  *
  * @param {service} $attrs Info
  *
   */

  angular.module('BB.Controllers').controller('GetAvailability', function($scope, $element, $attrs, $rootScope, $q, TimeService, AlertService, BBModel, halClient) {
    return $scope.loadAvailability = (function(_this) {
      return function(prms) {
        var service;
        service = halClient.$get($scope.bb.api_url + '/api/v1/' + prms.company_id + '/services/' + prms.service);
        return service.then(function(serv) {
          var eday, sday;
          $scope.earliest_day = null;
          sday = moment();
          eday = moment().add(30, 'days');
          return serv.$get('days', {
            date: sday.toISOString(),
            edate: eday.toISOString()
          }).then(function(res) {
            var day, i, len, ref, results;
            ref = res.days;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              day = ref[i];
              if (day.spaces > 0 && !$scope.earliest_day) {
                $scope.earliest_day = moment(day.date);
                if (day.first) {
                  results.push($scope.earliest_day.add(day.first, "minutes"));
                } else {
                  results.push(void 0);
                }
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        });
      };
    })(this);
  });

}).call(this);
