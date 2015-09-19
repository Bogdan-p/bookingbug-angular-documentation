(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BBAdmin.Directives:bbAdminClients
  * @restrict AE
  *
  * @description
  * Directive bbAdminClients
  *
  * @example Example that demonstrates basic bookingTable.
    <example>
      <file name="index.html">
        <div class="my-example">
        </div>
      </file>
  
      <file name="style.css">
        .my-example {
          background: green;
          widht: 200px;
          height: 200px;
        }
      </file>
    </example>
   */
  angular.module('BBAdmin.Directives').directive('bbAdminClients', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AdminClients',
      link: function(scope, element, attrs) {}
    };
  });


  /***
  * @ngdoc controller
  * @name BBAdmin.Controllers:AdminClients
  *
  * @description
  * Controller AdminClients
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} AdminClientService service
  * @param {service} ClientDetailsService Service.
  * @param {service} AlertService Service.
  *
   */

  angular.module('BBAdmin.Controllers').controller('AdminClients', function($scope, $rootScope, $q, AdminClientService, ClientDetailsService, AlertService) {
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 15;
    $scope.total_entries = 0;
    $scope.clients = [];
    $scope.getClients = function(currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
      var clientDef;
      console.log(currentPage, filterBy, filterByFields, orderBy, orderByReverse);
      clientDef = $q.defer();
      $rootScope.connection_started.then(function() {
        $scope.notLoaded($scope);
        return AdminClientService.query({
          company_id: $scope.bb.company_id,
          per_page: $scope.per_page,
          page: currentPage + 1,
          filter_by: filterBy,
          filter_by_fields: filterByFields,
          order_by: orderBy,
          order_by_reverse: orderByReverse
        }).then((function(_this) {
          return function(clients) {
            $scope.clients = clients.items;
            $scope.setLoaded($scope);
            $scope.setPageLoaded();
            $scope.total_entries = clients.total_entries;
            console.log($scope.clients);
            return clientDef.resolve(clients.items);
          };
        })(this), function(err) {
          clientDef.reject(err);
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      });
      return true;
    };
    return $scope.edit = function(item) {
      return console.log(item);
    };
  });

}).call(this);
