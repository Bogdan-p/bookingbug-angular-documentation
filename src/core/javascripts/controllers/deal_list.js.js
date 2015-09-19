(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbDeals
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbDeals
  *
  * See Controller {@link BB.Controllers:DealList DealList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'DealList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbDeals', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'DealList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:DealList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller DealList
  *
  * # Has the following set of methods:
  *
  * - init()
  * - $scope.selectDeal(deal)
  * - ModalInstanceCtrl($scope, $modalInstance, item, ValidatorService)
  * - $scope.addToBasket(form)
  * - $scope.cancel
  * - $scope.purchaseDeals
  * - $scope.setReady
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} DealService Info
  * <br>
  * {@link BB.Services:DealService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
  * @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
  * <br>
  * {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs more}
  *
   */

  angular.module('BB.Controllers').controller('DealList', function($scope, $rootScope, DealService, $q, BBModel, AlertService, FormDataStoreService, ValidatorService, $modal) {
    var ModalInstanceCtrl, init;
    $scope.controller = "public.controllers.DealList";
    FormDataStoreService.init('TimeRangeList', $scope, ['deals']);
    $rootScope.connection_started.then(function() {
      return init();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    init = function() {
      var deal_promise;
      $scope.notLoaded($scope);
      if (!$scope.deals) {
        deal_promise = DealService.query($scope.bb.company);
        return deal_promise.then(function(deals) {
          $scope.deals = deals;
          return $scope.setLoaded($scope);
        });
      }
    };
    $scope.selectDeal = function(deal) {
      var iitem, modalInstance;
      iitem = new BBModel.BasketItem(null, $scope.bb);
      iitem.setDefaults($scope.bb.item_defaults);
      iitem.setDeal(deal);
      if (!$scope.bb.company_settings.no_recipient) {
        modalInstance = $modal.open({
          templateUrl: $scope.getPartial('_add_recipient'),
          scope: $scope,
          controller: ModalInstanceCtrl,
          resolve: {
            item: function() {
              return iitem;
            }
          }
        });
        return modalInstance.result.then(function(item) {
          $scope.notLoaded($scope);
          $scope.setBasketItem(item);
          return $scope.addItemToBasket().then(function() {
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        });
      } else {
        $scope.notLoaded($scope);
        $scope.setBasketItem(iitem);
        return $scope.addItemToBasket().then(function() {
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    ModalInstanceCtrl = function($scope, $modalInstance, item, ValidatorService) {
      $scope.controller = 'ModalInstanceCtrl';
      $scope.item = item;
      $scope.recipient = false;
      $scope.addToBasket = function(form) {
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        return $modalInstance.close($scope.item);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    $scope.purchaseDeals = function() {
      if ($scope.bb.basket.items && $scope.bb.basket.items.length > 0) {
        return $scope.decideNextPage();
      } else {
        return AlertService.add('danger', {
          msg: 'You need to select at least one Gift Certificate to continue'
        });
      }
    };
    return $scope.setReady = function() {
      if ($scope.bb.basket.items && $scope.bb.basket.items.length > 0) {
        return true;
      } else {
        return AlertService.add('danger', {
          msg: 'You need to select at least one Gift Certificate to continue'
        });
      }
    };
  });

}).call(this);
