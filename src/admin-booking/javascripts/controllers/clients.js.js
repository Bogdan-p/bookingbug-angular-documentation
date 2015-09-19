
/***
* @ndgoc directive
* @name BBAdminBooking.Directives:bbAdminBookingClients
*
* @restrict AE
* @scope true
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminBooking.Directives:bbAdminBookingClients
*
 */

(function() {
  'use strict';
  angular.module('BBAdminBooking').directive('bbAdminBookingClients', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'adminBookingClients'
    };
  });


  /***
  * @ngdoc controller
  * @name BBAdminBooking.Controllers:adminBookingClients
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller adminBookingClients
  *
  * # Has the following set of methods:
  *
  * - $scope.showSearch()
  * - $scope.showClientForm()
  * - $scope.selectClient(client, route)
  * - $scope.checkSearch(search)
  * - $scope.createClient(route)
  * - $scope.getClients(currentPage, filterBy, filterByFields, orderBy, orderByReverse)
  * - $scope.edit(item)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires $q
  * @requires BBAdmin.Services:AdminClientService
  * @requires BB.Services:ClientDetailsService
  * @requires BB.Services:AlertService
  * @requires BB.Services:ClientService
  * @requires BB.Services:ValidatorService
  *
   */

  angular.module('BBAdminBooking').controller('adminBookingClients', function($scope, $rootScope, $q, AdminClientService, ClientDetailsService, AlertService, ClientService, ValidatorService) {
    $scope.validator = ValidatorService;
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 20;
    $scope.total_entries = 0;
    $scope.clients = [];
    $scope.searchClients = false;
    $scope.newClient = false;
    $scope.no_clients = false;
    $scope.search_error = false;

    /***
    * @ngdoc method
    * @name $scope.showSearch
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.showSearch
    *
     */
    $scope.showSearch = (function(_this) {
      return function() {
        $scope.searchClients = true;
        return $scope.newClient = false;
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.showClientForm
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.showClientForm
    *
     */
    $scope.showClientForm = (function(_this) {
      return function() {
        $scope.search_error = false;
        $scope.no_clients = false;
        $scope.searchClients = false;
        $scope.newClient = true;
        return $scope.clearClient();
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.selectClient
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.selectClient
    *
    * @param {object} client client
    * @param {object} client client
    *
     */
    $scope.selectClient = (function(_this) {
      return function(client, route) {
        $scope.search_error = false;
        $scope.no_clients = false;
        $scope.setClient(client);
        $scope.client.setValid(true);
        return $scope.decideNextPage(route);
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.checkSearch
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.checkSearch
    *
    * @param {object} search search
    * 
    * @returns {object} true or false
     */
    $scope.checkSearch = (function(_this) {
      return function(search) {
        if (search.length >= 3) {
          $scope.search_error = false;
          return true;
        } else {
          $scope.search_error = true;
          return false;
        }
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.createClient
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.createClient
    *
    * @param {object} route route
    *
     */
    $scope.createClient = (function(_this) {
      return function(route) {
        $scope.notLoaded($scope);
        if ($scope.bb && $scope.bb.parent_client) {
          $scope.client.parent_client_id = $scope.bb.parent_client.id;
        }
        if ($scope.client_details) {
          $scope.client.setClientDetails($scope.client_details);
        }
        return ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          return $scope.selectClient(client, route);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.getClients
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.getClients
    *
    * @param {object} currentPage currentPage
    * @param {object} filterBy filterBy
    * @param {object} filterByFields filterByFields
    * @param {object} orderBy orderBy
    * @param {object} orderByReverse orderByReverse
    *
    * @returns {object} clientDef.reject(err)
    *
     */
    $scope.getClients = function(currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
      var clientDef, params;
      AlertService.clear();
      $scope.no_clients = false;
      $scope.search_error = false;
      clientDef = $q.defer();
      params = {
        company: $scope.bb.company,
        per_page: $scope.per_page,
        filter_by: filterBy,
        filter_by_fields: filterByFields,
        order_by: orderBy,
        order_by_reverse: orderByReverse
      };
      if (currentPage) {
        params.page = currentPage + 1;
      }
      return $rootScope.connection_started.then(function() {
        $scope.notLoaded($scope);
        if (!$rootScope.bb.api_url && $scope.bb.api_url) {
          $rootScope.bb.api_url = $scope.bb.api_url;
        }
        return AdminClientService.query(params).then((function(_this) {
          return function(clients) {
            $scope.clients = clients.items;
            $scope.setLoaded($scope);
            $scope.setPageLoaded();
            $scope.total_entries = clients.total_entries;
            return clientDef.resolve(clients.items);
          };
        })(this), function(err) {
          $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          return clientDef.reject(err);
        });
      });
    };

    /***
    * @ngdoc method
    * @name $scope.edit
    * @methodOf BBAdminBooking.Controllers:adminBookingClients
    *
    * @description
    * Method $scope.edit
    *
    * @param {object} item item
    *
    * @returns {string} console.log(item)
    *
     */
    return $scope.edit = function(item) {
      return console.log(item);
    };
  });

}).call(this);
