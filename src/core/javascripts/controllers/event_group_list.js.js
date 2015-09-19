(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbEventGroups
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbEventGroups
  *
  * See Controller {@link BB.Controllers:EventGroupList EventGroupList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'EventGroupList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbEventGroups', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'EventGroupList',
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
  * @name BB.Controllers:EventGroupList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller EventGroupList
  *
  * # Has the following set of methods:
  *
  * - $scope.init(comp)
  * - setEventGroupItem(items)
  * - $scope.selectItem(item, route)
  * - $scope.setReady()
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

  angular.module('BB.Controllers').controller('EventGroupList', function($scope, $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient) {
    var setEventGroupItem;
    $scope.controller = "public.controllers.EventGroupList";
    FormDataStoreService.init('EventGroupList', $scope, ['event_group']);
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(comp) {
      var ppromise;
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      ppromise = comp.getEventGroupsPromise();
      return ppromise.then(function(items) {
        var filterItems, i, item, j, len, len1;
        filterItems = $attrs.filterServices === 'false' ? false : true;
        if (filterItems) {
          if ($scope.booking_item.service_ref && !$scope.show_all) {
            items = items.filter(function(x) {
              return x.api_ref === $scope.booking_item.service_ref;
            });
          } else if ($scope.booking_item.category && !$scope.show_all) {
            items = items.filter(function(x) {
              return x.$has('category') && x.$href('category') === $scope.booking_item.category.self;
            });
          }
        }
        if (items.length === 1 && !$scope.allowSinglePick) {
          if (!$scope.selectItem(items[0], $scope.nextRoute)) {
            setEventGroupItem(items);
          } else {
            $scope.skipThisStep();
          }
        } else {
          setEventGroupItem(items);
        }
        if ($scope.booking_item.defaultService()) {
          for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (item.self === $scope.booking_item.defaultService().self) {
              $scope.selectItem(item, $scope.nextRoute);
            }
          }
        }
        if ($scope.booking_item.event_group) {
          for (j = 0, len1 = items.length; j < len1; j++) {
            item = items[j];
            item.selected = false;
            if (item.self === $scope.booking_item.event_group.self) {
              $scope.event_group = item;
              item.selected = true;
              $scope.booking_item.setEventGroup($scope.event_group);
            }
          }
        }
        $scope.setLoaded($scope);
        if ($scope.booking_item.event_group || (!$scope.booking_item.person && !$scope.booking_item.resource)) {
          return $scope.bookable_services = $scope.items;
        }
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    setEventGroupItem = function(items) {
      $scope.items = items;
      if ($scope.event_group) {
        return _.each(items, function(item) {
          if (item.id === $scope.event_group.id) {
            return $scope.event_group = item;
          }
        });
      }
    };
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.event_group = item;
          return false;
        } else {
          $scope.booking_item.setEventGroup(item);
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.$watch('event_group', (function(_this) {
      return function(newval, oldval) {
        if ($scope.event_group) {
          if (!$scope.booking_item.event_group || $scope.booking_item.event_group.self !== $scope.event_group.self) {
            $scope.booking_item.setEventGroup($scope.event_group);
            return $scope.broadcastItemUpdate();
          }
        }
      };
    })(this));
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.event_group) {
          $scope.booking_item.setEventGroup($scope.event_group);
          return true;
        } else {
          return false;
        }
      };
    })(this);
  });

}).call(this);
