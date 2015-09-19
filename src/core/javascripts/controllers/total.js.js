(function() {
  'use strict';

  /***
  * @ndgoc directive
  * @name BB.Directives:bbTotal
  *
  * @restrict AE
  * @scope true
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbTotal
  *
  * # Has the following set of methods:
  *
   */
  angular.module('BB.Directives').directive('bbTotal', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Total'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Total
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Total
  *
  * # Has the following set of methods:
  *
  * - $scope.print()
  *
  * @requires $scope
  * @requires $rootScope
  * @requires $q
  * @requires $location
  * @requires $window
  * @requires BB.Services:PurchaseService
  * @requires BB.Services:QueryStringService
  *
   */

  angular.module('BB.Controllers').controller('Total', function($scope, $rootScope, $q, $location, $window, PurchaseService, QueryStringService) {
    $scope.controller = "public.controllers.Total";
    $scope.notLoaded($scope);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var id;
        $scope.bb.payment_status = null;
        id = $scope.bb.total ? $scope.bb.total.long_id : QueryStringService('purchase_id');
        if (id) {
          return PurchaseService.query({
            url_root: $scope.bb.api_url,
            purchase_id: id
          }).then(function(total) {
            $scope.total = total;
            $scope.setLoaded($scope);
            if (total.paid === total.total_price) {
              return $scope.$emit("checkout:success", total);
            }
          });
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    return $scope.print = (function(_this) {
      return function() {
        $window.open($scope.bb.partial_url + 'print_purchase.html?id=' + $scope.total.long_id, '_blank', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        return true;
      };
    })(this);
  });

}).call(this);
