(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbMiniBasket
  * @restrict AE
  * @scope true
  *
  * @description
  * Directive BB.Directives:bbMiniBasket
  *
  * See Controller {@link BB.Controllers:MiniBasket MiniBasket}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'MiniBasket'
  * </pre>
  *
  *
   */
  angular.module('BB.Directives').directive('bbMiniBasket', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'MiniBasket'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:MiniBasket
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller MiniBasket
  *
  * # Has the following set of methods:
  * - $scope.basketDescribe(nothing, single, plural)
  *
  * @requires $scope
  * @requires $q
  * @requires $rootScope
  * @requires BB.Services:BasketService
  *
   */

  angular.module('BB.Controllers').controller('MiniBasket', function($scope, $rootScope, BasketService, $q) {
    $scope.controller = "public.controllers.MiniBasket";
    $scope.setUsingBasket(true);
    $rootScope.connection_started.then((function(_this) {
      return function() {};
    })(this));
    return $scope.basketDescribe = (function(_this) {
      return function(nothing, single, plural) {
        if (!$scope.bb.basket || $scope.bb.basket.length() === 0) {
          return nothing;
        } else if ($scope.bb.basket.length() === 1) {
          return single;
        } else {
          return plural.replace("$0", $scope.bb.basket.length());
        }
      };
    })(this);
  });

  angular.module('BB.Directives').directive('bbBasketList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'BasketList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:BasketList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller BasketList
  *
  * # Has the following set of methods:
  *
  * - $scope.addAnother(route)
  * - $scope.checkout (route)
  * - $scope.applyCoupon(coupon)
  * - $scope.applyDeal(deal_code)
  * - $scope.removeDeal(deal_code)
  * - $scope.setReady
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} BasketService Info
  * <br>
  * {@link BB.Services:BasketService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {service} ErrorService Info
  * <br>
  * {@link BB.Services:ErrorService more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
   */

  angular.module('BB.Controllers').controller('BasketList', function($scope, $rootScope, BasketService, $q, AlertService, ErrorService, FormDataStoreService) {
    $scope.controller = "public.controllers.BasketList";
    $scope.setUsingBasket(true);
    $scope.items = $scope.bb.basket.items;
    $scope.$watch('basket', (function(_this) {
      return function(newVal, oldVal) {
        return $scope.items = _.filter($scope.bb.basket.items, function(item) {
          return !item.is_coupon;
        });
      };
    })(this));
    $scope.addAnother = (function(_this) {
      return function(route) {
        $scope.clearBasketItem();
        $scope.bb.emptyStackedItems();
        $scope.bb.current_item.setCompany($scope.bb.company);
        return $scope.restart();
      };
    })(this);
    $scope.checkout = (function(_this) {
      return function(route) {
        $scope.setReadyToCheckout(true);
        if ($scope.bb.basket.items.length > 0) {
          return $scope.decideNextPage(route);
        } else {
          AlertService.clear();
          AlertService.add('info', ErrorService.getError('EMPTY_BASKET_FOR_CHECKOUT'));
          return false;
        }
      };
    })(this);
    $scope.applyCoupon = (function(_this) {
      return function(coupon) {
        var params;
        AlertService.clear();
        $scope.notLoaded($scope);
        params = {
          bb: $scope.bb,
          coupon: coupon
        };
        return BasketService.applyCoupon($scope.bb.company, params).then(function(basket) {
          var i, item, len, ref;
          ref = basket.items;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            item.storeDefaults($scope.bb.item_defaults);
            item.reserve_without_questions = $scope.bb.reserve_without_questions;
          }
          basket.setSettings($scope.bb.basket.settings);
          $scope.setBasket(basket);
          return $scope.setLoaded($scope);
        }, function(err) {
          if (err && err.data && err.data.error) {
            AlertService.clear();
            AlertService.add("danger", {
              msg: err.data.error
            });
          }
          return $scope.setLoaded($scope);
        });
      };
    })(this);
    $scope.applyDeal = (function(_this) {
      return function(deal_code) {
        var params;
        AlertService.clear();
        if ($scope.client) {
          params = {
            bb: $scope.bb,
            deal_code: deal_code,
            member_id: $scope.client.id
          };
        } else {
          params = {
            bb: $scope.bb,
            deal_code: deal_code,
            member_id: null
          };
        }
        return BasketService.applyDeal($scope.bb.company, params).then(function(basket) {
          var i, item, len, ref;
          ref = basket.items;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            item.storeDefaults($scope.bb.item_defaults);
            item.reserve_without_questions = $scope.bb.reserve_without_questions;
          }
          basket.setSettings($scope.bb.basket.settings);
          $scope.setBasket(basket);
          $scope.items = $scope.bb.basket.items;
          return $scope.deal_code = null;
        }, function(err) {
          if (err && err.data && err.data.error) {
            AlertService.clear();
            return AlertService.add("danger", {
              msg: err.data.error
            });
          }
        });
      };
    })(this);
    $scope.removeDeal = (function(_this) {
      return function(deal_code) {
        var params;
        params = {
          bb: $scope.bb,
          deal_code_id: deal_code.id
        };
        return BasketService.removeDeal($scope.bb.company, params).then(function(basket) {
          var i, item, len, ref;
          ref = basket.items;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            item.storeDefaults($scope.bb.item_defaults);
            item.reserve_without_questions = $scope.bb.reserve_without_questions;
          }
          basket.setSettings($scope.bb.basket.settings);
          $scope.setBasket(basket);
          return $scope.items = $scope.bb.basket.items;
        }, function(err) {
          if (err && err.data && err.data.error) {
            AlertService.clear();
            return AlertService.add("danger", {
              msg: err.data.error
            });
          }
        });
      };
    })(this);
    return $scope.setReady = function() {
      if ($scope.bb.basket.items.length > 0) {
        return $scope.setReadyToCheckout(true);
      } else {
        return AlertService.add('info', ErrorService.getError('EMPTY_BASKET_FOR_CHECKOUT'));
      }
    };
  });

}).call(this);
