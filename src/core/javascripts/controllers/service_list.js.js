(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbServices
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbServices
  *
  * See Controller {@link BB.Controllers:ServiceList ServiceList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'ServiceList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbServices', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ServiceList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:ServiceList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller ServiceList
  *
  * # Has the following set of ServiceList:
  *
  * - $scope.init(comp)
  * - setServiceItem(items)
  * - $scope.selectItem(item, route)
  * - $scope.$watch 'service', (newval, oldval)
  * - $scope.setReady()
  * - $scope.errorModal()
  * - $scope.filterFunction(service)
  * - $scope.custom_array(match)
  * - $scope.service_name_include(match)
  * - $scope.resetFilters()
  * - $scope.filterChanged()
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
  * @param {service} ModalForm Info
  * <br>
  * {@link BB.Services:ModalForm more}
  *
  * @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$sce more}
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
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {service} ErrorService Info
  * <br>
  * {@link BB.Services:ErrorService more}
  *
  * @param {service} ErrorService Info
  * <br>
  * {@link BB.Services:ErrorService more}
  *
  * @param {service} $filter Filters are used for formatting data displayed to the user.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$filter more}
  *
  * @param {service} CategoryService Info
  * <br>
  * {@link BB.Services:CategoryService more}
  *
   */

  angular.module('BB.Controllers').controller('ServiceList', function($scope, $rootScope, $q, $attrs, $modal, $sce, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient, AlertService, ErrorService, $filter, CategoryService) {
    var setServiceItem;
    $scope.controller = "public.controllers.ServiceList";
    FormDataStoreService.init('ServiceList', $scope, ['service']);
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.validator = ValidatorService;
    $scope.filters = {
      category_name: null,
      service_name: null,
      price: {
        min: 0,
        max: 100
      },
      custom_array_value: null
    };
    $scope.show_custom_array = false;
    $scope.options = $scope.$eval($attrs.bbServices) || {};
    if ($attrs.bbItem) {
      $scope.booking_item = $scope.$eval($attrs.bbItem);
    }
    if ($attrs.bbShowAll || $scope.options.show_all) {
      $scope.show_all = true;
    }
    if ($scope.options.allow_single_pick) {
      $scope.allowSinglePick = true;
    }
    $scope.price_options = {
      min: 0,
      max: 100
    };
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
      if ($scope.bb.company.$has('named_categories')) {
        CategoryService.query($scope.bb.company).then((function(_this) {
          return function(items) {
            return $scope.all_categories = items;
          };
        })(this), function(err) {
          return $scope.all_categories = [];
        });
      } else {
        $scope.all_categories = [];
      }
      if ($scope.service && $scope.service.company_id !== $scope.bb.company.id) {
        $scope.service = null;
      }
      ppromise = comp.getServicesPromise();
      this.skipped = false;
      ppromise.then((function(_this) {
        return function(items) {
          var filterItems, item, j, k, len, len1;
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
          if (!$scope.options.show_event_groups) {
            items = items.filter(function(x) {
              return !x.is_event_group;
            });
          }
          if (items.length === 1 && !$scope.allowSinglePick) {
            if (!$scope.selectItem(items[0], $scope.nextRoute)) {
              setServiceItem(items);
            } else if (!_this.skipped) {
              $scope.skipThisStep();
              _this.skipped = true;
            }
          } else {
            setServiceItem(items);
          }
          if ($scope.booking_item.defaultService()) {
            for (j = 0, len = items.length; j < len; j++) {
              item = items[j];
              if (item.self === $scope.booking_item.defaultService().self || (item.name === $scope.booking_item.defaultService().name && !item.deleted)) {
                $scope.selectItem(item, $scope.nextRoute);
              }
            }
          }
          if ($scope.booking_item.service) {
            for (k = 0, len1 = items.length; k < len1; k++) {
              item = items[k];
              item.selected = false;
              if (item.self === $scope.booking_item.service.self) {
                $scope.service = item;
                item.selected = true;
                $scope.booking_item.setService($scope.service);
              }
            }
          }
          $scope.setLoaded($scope);
          if ($scope.booking_item.service || !(($scope.booking_item.person && !$scope.booking_item.anyPerson()) || ($scope.booking_item.resource && !$scope.booking_item.anyResource()))) {
            return $scope.bookable_services = $scope.items;
          }
        };
      })(this), function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
      if (($scope.booking_item.person && !$scope.booking_item.anyPerson()) || ($scope.booking_item.resource && !$scope.booking_item.anyResource())) {
        return ItemService.query({
          company: $scope.bb.company,
          cItem: $scope.booking_item,
          wait: ppromise,
          item: 'service'
        }).then((function(_this) {
          return function(items) {
            var i, services;
            if ($scope.booking_item.service_ref) {
              items = items.filter(function(x) {
                return x.api_ref === $scope.booking_item.service_ref;
              });
            }
            if ($scope.booking_item.group) {
              items = items.filter(function(x) {
                return !x.group_id || x.group_id === $scope.booking_item.group;
              });
            }
            services = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = items.length; j < len; j++) {
                i = items[j];
                if (i.item != null) {
                  results.push(i.item);
                }
              }
              return results;
            })();
            $scope.bookable_services = services;
            $scope.bookable_items = items;
            if (services.length === 1 && !$scope.allowSinglePick) {
              if (!$scope.selectItem(services[0], $scope.nextRoute)) {
                setServiceItem(services);
              } else if (!_this.skipped) {
                $scope.skipThisStep();
                _this.skipped = true;
              }
            } else {
              setServiceItem(items);
            }
            return $scope.setLoaded($scope);
          };
        })(this), function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    setServiceItem = function(items) {
      $scope.items = items;
      $scope.filtered_items = $scope.items;
      if ($scope.service) {
        return _.each(items, function(item) {
          if (item.id === $scope.service.id) {
            return $scope.service = item;
          }
        });
      }
    };
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.routed) {
          return true;
        }
        if ($scope.$parent.$has_page_control) {
          $scope.service = item;
          return false;
        } else if (item.is_event_group) {
          $scope.booking_item.setEventGroup(item);
          $scope.decideNextPage(route);
          return $scope.routed = true;
        } else {
          $scope.booking_item.setService(item);
          $scope.decideNextPage(route);
          $scope.routed = true;
          return true;
        }
      };
    })(this);
    $scope.$watch('service', (function(_this) {
      return function(newval, oldval) {
        if ($scope.service && $scope.booking_item) {
          if (!$scope.booking_item.service || $scope.booking_item.service.self !== $scope.service.self) {
            $scope.booking_item.setService($scope.service);
            return $scope.broadcastItemUpdate();
          }
        }
      };
    })(this));
    $scope.setReady = (function(_this) {
      return function() {
        if ($scope.service) {
          $scope.booking_item.setService($scope.service);
          return true;
        } else if ($scope.bb.stacked_items && $scope.bb.stacked_items.length > 0) {
          return true;
        } else {
          return false;
        }
      };
    })(this);
    $scope.errorModal = function() {
      var error_modal;
      return error_modal = $modal.open({
        templateUrl: $scope.getPartial('_error_modal'),
        controller: function($scope, $modalInstance) {
          $scope.message = ErrorService.getError('GENERIC').msg;
          return $scope.ok = function() {
            return $modalInstance.close();
          };
        }
      });
    };
    $scope.filterFunction = function(service) {
      if (!service) {
        return false;
      }
      $scope.service_array = [];
      $scope.custom_array = function(match) {
        var item, j, len, ref;
        if (!match) {
          return false;
        }
        if ($scope.options.custom_filter) {
          match = match.toLowerCase();
          ref = service.extra[$scope.options.custom_filter];
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            item = item.toLowerCase();
            if (item === match) {
              $scope.show_custom_array = true;
              return true;
            }
          }
          return false;
        }
      };
      $scope.service_name_include = function(match) {
        var item;
        if (!match) {
          return false;
        }
        if (match) {
          match = match.toLowerCase();
          item = service.name.toLowerCase();
          if (item.includes(match)) {
            return true;
          } else {
            return false;
          }
        }
      };
      return (!$scope.filters.category_name || service.category_id === $scope.filters.category_name.id) && (!$scope.filters.service_name || $scope.service_name_include($scope.filters.service_name)) && (!$scope.filters.custom_array_value || $scope.custom_array($scope.filters.custom_array_value)) && (!service.price || (service.price >= $scope.filters.price.min * 100 && service.price <= $scope.filters.price.max * 100));
    };
    $scope.resetFilters = function() {
      if ($scope.options.clear_results) {
        $scope.show_custom_array = false;
      }
      $scope.filters.category_name = null;
      $scope.filters.service_name = null;
      $scope.filters.price.min = 0;
      $scope.filters.price.max = 100;
      $scope.filters.custom_array_value = null;
      return $scope.filterChanged();
    };
    return $scope.filterChanged = function() {
      return $scope.filtered_items = $filter('filter')($scope.items, $scope.filterFunction);
    };
  });

}).call(this);
