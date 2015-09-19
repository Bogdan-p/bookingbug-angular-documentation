(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbProductList
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbProductList
  *
  * See Controller {@link BB.Controllers:ProductList ProductList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'ProductList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbProductList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ProductList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
        if (attrs.bbShowAll) {
          scope.show_all = true;
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:ProductList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller ProductList
  *
  * # Has the following set of methods:
  *
  * - $scope.init(company)
  * - $scope.selectItem(item, route)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} ItemService Info
  * <br>
  * {@link BB.Services:ItemService more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
  * @param {service} PageControllerService Info
  * <br>
  * {@link BB.Services:PageControllerService more}
  *
  * @param {model} halClient Info
  * <br>
  * {@link angular-hal:halClient more}
  *
   */

  angular.module('BB.Controllers').controller('ProductList', function($scope, $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient) {
    $scope.controller = "public.controllers.ProductList";
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(company) {
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      return company.$get('products').then(function(products) {
        return products.$get('products').then(function(products) {
          $scope.products = products;
          return $scope.setLoaded($scope);
        });
      });
    };
    return $scope.selectItem = function(item, route) {
      if ($scope.$parent.$has_page_control) {
        $scope.product = item;
        return false;
      } else {
        $scope.booking_item.setProduct(item);
        $scope.decideNextPage(route);
        return true;
      }
    };
  });

}).call(this);
