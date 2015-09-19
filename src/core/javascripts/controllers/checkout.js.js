(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbCheckout', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Checkout'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Checkout
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Checkout
  *
  * # Has the following set of methods:
  *
  * - $scope.print()
  * - $scope.printElement(id, stylesheet)
  * -
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} BasketService Info
  * <br>
  * {@link BB.Services:BasketService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
   */

  angular.module('BB.Controllers').controller('Checkout', function($scope, $rootScope, $attrs, BasketService, $q, $location, $window, $bbug, FormDataStoreService, $timeout) {
    $scope.controller = "public.controllers.Checkout";
    $scope.notLoaded($scope);
    $scope.options = $scope.$eval($attrs.bbCheckout) || {};
    FormDataStoreService.destroy($scope);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.bb.basket.setClient($scope.client);
        $scope.loadingTotal = BasketService.checkout($scope.bb.company, $scope.bb.basket, {
          bb: $scope.bb
        });
        return $scope.loadingTotal.then(function(total) {
          $scope.total = total;
          if (!total.$has('new_payment')) {
            $scope.$emit("checkout:success", total);
            $scope.bb.total = $scope.total;
            $scope.bb.payment_status = 'complete';
            if (!$scope.options.disable_confirmation) {
              $scope.skipThisStep();
              $scope.decideNextPage();
            }
          }
          $scope.checkoutSuccess = true;
          return $scope.setLoaded($scope);
        }, function(err) {
          $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          $scope.checkoutFailed = true;
          return $scope.$emit("checkout:fail", err);
        });
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.print = (function(_this) {
      return function() {
        $window.open($scope.bb.partial_url + 'print_purchase.html?id=' + $scope.total.long_id, '_blank', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        return true;
      };
    })(this);
    return $scope.printElement = function(id, stylesheet) {
      var data, mywindow;
      data = $bbug('#' + id).html();
      mywindow = $window.open('', '', 'height=600,width=800');
      return $timeout(function() {
        mywindow.document.write('<html><head><title>Booking Confirmation</title>');
        if (stylesheet) {
          mywindow.document.write('<link rel="stylesheet" href="' + stylesheet + '" type="text/css" />');
        }
        mywindow.document.write('</head><body>');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        return $timeout(function() {
          mywindow.document.close();
          mywindow.focus();
          mywindow.print();
          return mywindow.close();
        }, 100);
      }, 2000);
    };
  });

}).call(this);
