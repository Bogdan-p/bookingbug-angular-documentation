(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbPayment
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbPayment
  *
  * See Controller {@link BB.Controllers:Payment Payment}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'Payment'
  * link: linker
  * </pre>
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$sce more}
  *
  * @param {service} SettingsService Info
  * <br>
  * {@link BB.Services:SettingsService more}
  *
   */
  angular.module('BB.Directives').directive('bbPayment', function($window, $location, $sce, SettingsService) {
    var error, getHost, linker, sendLoadEvent;
    error = function(scope, message) {
      return scope.error(message);
    };
    getHost = function(url) {
      var a;
      a = document.createElement('a');
      a.href = url;
      return a['protocol'] + '//' + a['host'];
    };
    sendLoadEvent = function(element, origin, scope) {
      var custom_stylesheet, payload, referrer;
      referrer = $location.protocol() + "://" + $location.host();
      if ($location.port()) {
        referrer += ":" + $location.port();
      }
      if (scope.payment_options.custom_stylesheet) {
        custom_stylesheet = scope.payment_options.custom_stylesheet;
      }
      payload = JSON.stringify({
        'type': 'load',
        'message': referrer,
        'custom_partial_url': scope.bb.custom_partial_url,
        'custom_stylesheet': custom_stylesheet,
        'scroll_offset': SettingsService.getScrollOffset()
      });
      return element.find('iframe')[0].contentWindow.postMessage(payload, origin);
    };
    linker = function(scope, element, attributes) {
      scope.payment_options = scope.$eval(attributes.bbPayment) || {};
      element.find('iframe').bind('load', (function(_this) {
        return function(event) {
          var origin, url;
          url = scope.bb.total.$href('new_payment');
          origin = getHost(url);
          sendLoadEvent(element, origin, scope);
          return scope.$apply(function() {
            return scope.callSetLoaded();
          });
        };
      })(this));
      return $window.addEventListener('message', (function(_this) {
        return function(event) {
          var data;
          if (angular.isObject(event.data)) {
            data = event.data;
          } else if (!event.data.match(/iFrameSizer/)) {
            data = JSON.parse(event.data);
          }
          return scope.$apply(function() {
            if (data) {
              switch (data.type) {
                case "submitting":
                  return scope.callNotLoaded();
                case "error":
                  scope.callSetLoaded();
                  return error(scope, event.data.message);
                case "payment_complete":
                  scope.callSetLoaded();
                  return scope.paymentDone();
              }
            }
          });
        };
      })(this), false);
    };
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Payment',
      link: linker
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Payment
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Payment
  *
  * # Has the following set of methods:
  *
  * - $scope.callNotLoaded()
  * - $scope.callSetLoaded()
  * - $scope.paymentDone()
  * - $scope.error(message)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$sce more}
  *
  * @param {service} $log Simple service for logging.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$log more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
   */

  angular.module('BB.Controllers').controller('Payment', function($scope, $rootScope, $q, $location, $window, $sce, $log, $timeout) {
    $scope.controller = "public.controllers.Payment";
    $scope.notLoaded($scope);
    if ($scope.purchase) {
      $scope.bb.total = $scope.purchase;
    }
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.total) {
          $scope.bb.total = $scope.total;
        }
        return $scope.url = $sce.trustAsResourceUrl($scope.bb.total.$href('new_payment'));
      };
    })(this));
    $scope.callNotLoaded = (function(_this) {
      return function() {
        return $scope.notLoaded($scope);
      };
    })(this);
    $scope.callSetLoaded = (function(_this) {
      return function() {
        return $scope.setLoaded($scope);
      };
    })(this);
    $scope.paymentDone = function() {
      $scope.bb.payment_status = "complete";
      return $scope.decideNextPage();
    };
    return $scope.error = function(message) {
      return $log.warn("Payment Failure: " + message);
    };
  });

}).call(this);
