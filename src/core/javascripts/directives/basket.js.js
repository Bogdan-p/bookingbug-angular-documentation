(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbBasket
  * @restrict A
  * @scope true
  *
  * @description
  {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbBasket
  *
  * <pre>
  * restrict: 'A'
  * replace: true
  * scope : true
  * templateUrl : (element, attrs) ->
  *   if _.has attrs, 'mini'
  *   then PathSvc.directivePartial "_basket_mini"
  *   else PathSvc.directivePartial "basket"
  * controllerAs : 'BasketCtrl'
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - templateUrl(element, attrs)
  * - controller($scope, $modal, BasketService)
  * - link : (scope, element, attrs)
  * <br>
  * Stop the default action of links inside directive. You can pass the $event
  * object in from the view to the function bound to ng-click but this keeps
  * the markup tidier.
  *
  * @param {service} PathSvc Info
  * <br>
  * {@link BB.Services:PathSvc more}
  *
   */
  angular.module('BB.Directives').directive('bbBasket', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: function(element, attrs) {
        if (_.has(attrs, 'mini')) {
          return PathSvc.directivePartial("_basket_mini");
        } else {
          return PathSvc.directivePartial("basket");
        }
      },
      controllerAs: 'BasketCtrl',
      controller: function($scope, $modal, BasketService) {
        var BasketInstanceCtrl;
        $scope.setUsingBasket(true);
        this.empty = function() {
          return $scope.$eval('emptyBasket()');
        };
        this.view = function() {
          return $scope.$eval('viewBasket()');
        };
        $scope.showBasketDetails = function() {
          var modalInstance;
          if (($scope.bb.current_page === "basket") || ($scope.bb.current_page === "checkout")) {
            return false;
          } else {
            return modalInstance = $modal.open({
              templateUrl: $scope.getPartial("_basket_details"),
              scope: $scope,
              controller: BasketInstanceCtrl,
              resolve: {
                basket: function() {
                  return $scope.bb.basket;
                }
              }
            });
          }
        };
        BasketInstanceCtrl = function($scope, $rootScope, $modalInstance, basket) {
          $scope.basket = basket;
          return $scope.cancel = function() {
            return $modalInstance.dismiss("cancel");
          };
        };
        $scope.$watch(function() {
          var len;
          $scope.basketItemCount = len = $scope.bb.basket ? $scope.bb.basket.length() : 0;
          if (!len) {
            $scope.basketStatus = "empty";
          } else {
            if (len === 1) {
              $scope.basketStatus = "1 item in your basket";
            } else {
              $scope.basketStatus = len + " items in your basket";
            }
          }
        });
      },
      link: function(scope, element, attrs) {
        return element.bind('click', function(e) {
          return e.preventDefault();
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbMinSpend
  * @restrict A
  * @scope true
  *
  * @description
  * Directive BB.Directives:bbMinSpend
  *
  * <pre>
  * restrict: 'A'
  * scope: true
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - controller($scope, $element, $attrs, AlertService)
  *
   */

  angular.module('BB.Directives').directive('bbMinSpend', function() {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope, $element, $attrs, AlertService) {
        var checkMinSpend, options;
        options = $scope.$eval($attrs.bbMinSpend || {});
        $scope.min_spend = options.min_spend || 0;
        $scope.setReady = function() {
          return checkMinSpend();
        };
        return checkMinSpend = function() {
          var i, item, len1, price, ref;
          price = 0;
          ref = $scope.bb.stacked_items;
          for (i = 0, len1 = ref.length; i < len1; i++) {
            item = ref[i];
            price += item.service.price;
          }
          if (price >= $scope.min_spend) {
            AlertService.clear();
            return true;
          } else {
            AlertService.clear();
            AlertService.add("warning", {
              msg: "You need to spend at least &pound;" + ($scope.min_spend / 100) + " to make a booking."
            });
            return false;
          }
        };
      }
    };
  });

}).call(this);
