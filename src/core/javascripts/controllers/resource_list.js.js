(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbResources
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbResources
  *
  * See Controller {@link BB.Controllers:ResourceList ResourceList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'ResourceList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbResources', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ResourceList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:ResourceList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PurchaseTotal
  *
  * # Has the following set of ResourceList:
  *
  * - loadData()
  * - getItemFromResource(resource)
  * - $scope.selectItem(item, route, skip_step = false)
  * - $scope.$watch 'resource',(newval, oldval)
  * - $scope.$on "currentItemUpdate", (event)
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
  * @param {service} PageControllerService Info
  * <br>
  * {@link BB.Services:PageControllerService more}
  *
  * @param {service} ResourceService Info
  * <br>
  * {@link BB.Services:ResourceService more}
  *
  * @param {service} ItemService Info
  * <br>
  * {@link BB.Services:ItemService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} ResourceModel Info
  * <br>
  * {@link BB.Models:Admin.ResourceModel more}
  *
   */

  angular.module('BB.Controllers').controller('ResourceList', function($scope, $rootScope, $attrs, PageControllerService, ResourceService, ItemService, $q, BBModel, ResourceModel) {
    var getItemFromResource, loadData;
    $scope.controller = "public.controllers.ResourceList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.options = $scope.$eval($attrs.bbResources) || {};
    $rootScope.connection_started.then((function(_this) {
      return function() {
        return loadData();
      };
    })(this));
    loadData = (function(_this) {
      return function() {
        var params, rpromise;
        if (!(($scope.bb.steps && $scope.bb.steps[0].page === "resource_list") || $scope.options.resource_first)) {
          if (!$scope.bb.current_item.service || $scope.bb.current_item.service === $scope.change_watch_item) {
            if (!$scope.bb.current_item.service) {
              $scope.setLoaded($scope);
            }
            return;
          }
        }
        $scope.change_watch_item = $scope.bb.current_item.service;
        $scope.notLoaded($scope);
        rpromise = ResourceService.query($scope.bb.company);
        rpromise.then(function(resources) {
          if ($scope.bb.current_item.group) {
            resources = resources.filter(function(x) {
              return !x.group_id || x.group_id === $scope.bb.current_item.group;
            });
          }
          return $scope.all_resources = resources;
        });
        params = {
          company: $scope.bb.company,
          cItem: $scope.bb.current_item,
          wait: rpromise,
          item: 'resource'
        };
        return ItemService.query(params).then(function(items) {
          var i, j, len, promises;
          promises = [];
          if ($scope.bb.current_item.group) {
            items = items.filter(function(x) {
              return !x.group_id || x.group_id === $scope.bb.current_item.group;
            });
          }
          for (j = 0, len = items.length; j < len; j++) {
            i = items[j];
            promises.push(i.promise);
          }
          return $q.all(promises).then(function(res) {
            var k, len1, resources;
            resources = [];
            for (k = 0, len1 = items.length; k < len1; k++) {
              i = items[k];
              resources.push(i.item);
              if ($scope.bb.current_item && $scope.bb.current_item.resource && $scope.bb.current_item.resource.self === i.item.self) {
                $scope.resource = i.item;
              }
            }
            if (resources.length === 1) {
              if (!$scope.selectItem(items[0].item, $scope.nextRoute, true)) {
                $scope.bookable_resources = resources;
                $scope.bookable_items = items;
              }
            } else {
              $scope.bookable_resources = resources;
              $scope.bookable_items = items;
            }
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          if (!(err === "No service link found" && (($scope.bb.steps && $scope.bb.steps[0].page === 'resource_list') || $scope.options.resource_first))) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          } else {
            return $scope.setLoaded($scope);
          }
        });
      };
    })(this);
    getItemFromResource = (function(_this) {
      return function(resource) {
        var item, j, len, ref;
        if (resource instanceof ResourceModel) {
          if ($scope.bookable_items) {
            ref = $scope.bookable_items;
            for (j = 0, len = ref.length; j < len; j++) {
              item = ref[j];
              if (item.item.self === resource.self) {
                return item;
              }
            }
          }
        }
        return resource;
      };
    })(this);
    $scope.selectItem = (function(_this) {
      return function(item, route, skip_step) {
        if (skip_step == null) {
          skip_step = false;
        }
        if ($scope.$parent.$has_page_control) {
          $scope.resource = item;
          return false;
        } else {
          $scope.bb.current_item.setResource(getItemFromResource(item));
          if (skip_step) {
            $scope.skipThisStep();
          }
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.$watch('resource', (function(_this) {
      return function(newval, oldval) {
        if ($scope.resource) {
          $scope.bb.current_item.setResource(getItemFromResource($scope.resource));
          return $scope.broadcastItemUpdate();
        } else if (newval !== oldval) {
          $scope.bb.current_item.setResource(null);
          return $scope.broadcastItemUpdate();
        }
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return loadData();
    });
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.resource) {
          $scope.bb.current_item.setResource(getItemFromResource($scope.resource));
          return true;
        } else {
          $scope.bb.current_item.setResource(null);
          return true;
        }
      };
    })(this);
  });

}).call(this);
