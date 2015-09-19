(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbMultiServiceSelect
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbMultiServiceSelect
  *
  * See Controller {@link BB.Controllers:MultiServiceSelect MultiServiceSelect}
  *
  * <pre>
  * restrict: 'AE'
  * scope : true
  * controller : 'MultiServiceSelect'
  * </pre>
  *
   */
  var hasProp = {}.hasOwnProperty;

  angular.module('BB.Directives').directive('bbMultiServiceSelect', function() {
    return {
      restrict: 'AE',
      scope: true,
      controller: 'MultiServiceSelect'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:MultiServiceSelect
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller MultiServiceSelect
  *
  * # Has the following set of methods:
  *
  * - initialise()
  * - checkItemDefaults()
  * - initialiseCategories(categories)
  * - $scope.changeCategory(category_name, services)
  * - $scope.changeCategoryName()
  * - $scope.addItem(item, duration)
  * - $scope.removeItem(item, options)
  * - $scope.nextStep()
  * - $scope.addService()
  * - $scope.setReady()
  * - $scope.selectDuration(service)
  * - controller($scope, $modalInstance, service)
  * - $scope.cancel
  * - $scope.setDuration()
  * - service
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {function} angular.element Wraps a raw DOM element or HTML string as a jQuery element.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/function/angular.element more}
  *
  * @param {service} $attrs Info
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
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
   */

  angular.module('BB.Controllers').controller('MultiServiceSelect', function($scope, $rootScope, $q, $attrs, BBModel, AlertService, CategoryService, FormDataStoreService, $modal) {
    var checkItemDefaults, initialise, initialiseCategories;
    FormDataStoreService.init('MultiServiceSelect', $scope, ['selected_category_name']);
    $scope.options = $scope.$eval($attrs.bbMultiServiceSelect) || {};
    $scope.options.max_services = $scope.options.max_services || Infinity;
    $scope.options.ordered_categories = $scope.options.ordered_categories || false;
    $scope.options.services = $scope.options.services || 'items';
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company.$has('parent') && !$scope.bb.company.$has('company_questions')) {
        $scope.bb.company.getParentPromise().then(function(parent) {
          $scope.company = parent;
          return initialise();
        });
      } else {
        $scope.company = $scope.bb.company;
      }
      return $scope.$watch($scope.options.services, function(newval, oldval) {
        if (newval && angular.isArray(newval)) {
          $scope.items = newval;
          return initialise();
        }
      });
    });
    initialise = function() {
      var promises;
      if (!$scope.items || !$scope.company) {
        return;
      }
      $scope.initialised = true;
      promises = [];
      promises.push(CategoryService.query($scope.bb.company));
      if ($scope.company.$has('company_questions')) {
        promises.push($scope.company.getCompanyQuestionsPromise());
      }
      return $q.all(promises).then(function(result) {
        var item, j, k, len, len1, ref, ref1, stacked_item;
        $scope.company_questions = result[1];
        initialiseCategories(result[0]);
        if (($scope.bb.basket && $scope.bb.basket.items.length > 0) || ($scope.bb.stacked_items && $scope.bb.stacked_items.length > 0)) {
          if ($scope.bb.basket && $scope.bb.basket.items.length > 0 && $scope.bb.basket.items[0].service) {
            if (!$scope.bb.stacked_items || $scope.bb.stacked_items.length === 0) {
              $scope.bb.setStackedItems($scope.bb.basket.items);
            }
          }
          if ($scope.bb.stacked_items && $scope.bb.stacked_items.length > 0) {
            ref = $scope.bb.stacked_items;
            for (j = 0, len = ref.length; j < len; j++) {
              stacked_item = ref[j];
              ref1 = $scope.items;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                item = ref1[k];
                if (item.self === stacked_item.service.self) {
                  stacked_item.service = item;
                  stacked_item.service.selected = true;
                  break;
                }
              }
            }
          }
        } else {
          checkItemDefaults();
        }
        if ($scope.bb.moving_booking) {
          $scope.nextStep();
        }
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    checkItemDefaults = function() {
      var j, len, ref, service;
      if (!$scope.bb.item_defaults.service) {
        return;
      }
      ref = $scope.items;
      for (j = 0, len = ref.length; j < len; j++) {
        service = ref[j];
        if (service.self === $scope.bb.item_defaults.service.self) {
          $scope.addItem(service);
          return;
        }
      }
    };
    initialiseCategories = function(categories) {
      var all_categories, category, category_details, category_id, grouped_sub_categories, grouped_sub_category, j, k, key, len, len1, results, services, sub_categories, sub_category, value;
      if ($scope.options.ordered_categories) {
        for (j = 0, len = categories.length; j < len; j++) {
          category = categories[j];
          category.order = parseInt(category.name.slice(0, 2));
          category.name = category.name.slice(3);
        }
      }
      $scope.all_categories = _.indexBy(categories, 'id');
      all_categories = _.groupBy($scope.items, function(item) {
        return item.category_id;
      });
      sub_categories = _.findWhere($scope.company_questions, {
        name: 'Extra Category'
      });
      if (sub_categories) {
        sub_categories = _.map(sub_categories.question_items, function(sub_category) {
          return sub_category.name;
        });
      }
      categories = {};
      for (key in all_categories) {
        if (!hasProp.call(all_categories, key)) continue;
        value = all_categories[key];
        if (value.length > 0) {
          categories[key] = value;
        }
      }
      $scope.categories = [];
      results = [];
      for (category_id in categories) {
        services = categories[category_id];
        grouped_sub_categories = [];
        if (sub_categories) {
          for (k = 0, len1 = sub_categories.length; k < len1; k++) {
            sub_category = sub_categories[k];
            grouped_sub_category = {
              name: sub_category,
              services: _.filter(services, function(service) {
                return service.extra.extra_category === sub_category;
              })
            };
            if (grouped_sub_category.services.length > 0) {
              grouped_sub_categories.push(grouped_sub_category);
            }
          }
        }
        if ($scope.all_categories[category_id]) {
          category_details = {
            name: $scope.all_categories[category_id].name,
            description: $scope.all_categories[category_id].description
          };
        }
        category = {
          name: category_details.name,
          description: category_details.description,
          sub_categories: grouped_sub_categories
        };
        if ($scope.options.ordered_categories) {
          category.order = $scope.all_categories[category_id].order;
        }
        $scope.categories.push(category);
        if ($scope.selected_category_name && $scope.selected_category_name === category_details.name) {
          results.push($scope.selected_category = $scope.categories[$scope.categories.length - 1]);
        } else if ($scope.bb.item_defaults.category && $scope.bb.item_defaults.category.name === category_details.name && !$scope.selected_category) {
          $scope.selected_category = $scope.categories[$scope.categories.length - 1];
          results.push($scope.selected_category_name = $scope.selected_category.name);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $scope.changeCategory = function(category_name, services) {
      if (category_name && services) {
        $scope.selected_category = {
          name: category_name,
          sub_categories: services
        };
        $scope.selected_category_name = $scope.selected_category.name;
        return $rootScope.$broadcast("multi_service_select:category_changed");
      }
    };
    $scope.changeCategoryName = function() {
      $scope.selected_category_name = $scope.selected_category.name;
      return $rootScope.$broadcast("multi_service_select:category_changed");
    };
    $scope.addItem = function(item, duration) {
      var i, iitem, j, len, ref, results;
      if ($scope.bb.stacked_items.length < $scope.options.max_services) {
        $scope.bb.clearStackedItemsDateTime();
        item.selected = true;
        iitem = new BBModel.BasketItem(null, $scope.bb);
        iitem.setDefaults($scope.bb.item_defaults);
        iitem.setService(item);
        if (duration) {
          iitem.setDuration(duration);
        }
        iitem.setGroup(item.group);
        $scope.bb.stackItem(iitem);
        return $rootScope.$broadcast("multi_service_select:item_added");
      } else {
        ref = $scope.items;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          i.popover = "Sorry, you can only book a maximum of " + $scope.options.max_services + " treatments";
          results.push(i.popoverText = i.popover);
        }
        return results;
      }
    };
    $scope.removeItem = function(item, options) {
      var i, j, len, ref, results;
      item.selected = false;
      if (options && options.type === 'BasketItem') {
        $scope.bb.deleteStackedItem(item);
      } else {
        $scope.bb.deleteStackedItemByService(item);
      }
      $scope.bb.clearStackedItemsDateTime();
      $rootScope.$broadcast("multi_service_select:item_removed");
      ref = $scope.items;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        if (i.self === item.self) {
          i.selected = false;
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $scope.removeStackedItem = function(item) {
      return $scope.removeItem(item, {
        type: 'BasketItem'
      });
    };
    $scope.nextStep = function() {
      if ($scope.bb.stacked_items.length > 1) {
        return $scope.decideNextPage();
      } else if ($scope.bb.stacked_items.length === 1) {
        if ($scope.bb.basket && $scope.bb.basket.items.length > 0) {
          $scope.quickEmptybasket({
            preserve_stacked_items: true
          });
        }
        $scope.setBasketItem($scope.bb.stacked_items[0]);
        return $scope.decideNextPage();
      } else {
        AlertService.clear();
        return AlertService.add("danger", {
          msg: "You need to select at least one treatment to continue"
        });
      }
    };
    $scope.addService = function() {
      return $rootScope.$broadcast("multi_service_select:add_item");
    };
    $scope.setReady = function() {
      if ($scope.bb.stacked_items.length > 1) {
        return true;
      } else if ($scope.bb.stacked_items.length === 1) {
        if ($scope.bb.basket && $scope.bb.basket.items.length > 0) {
          $scope.quickEmptybasket({
            preserve_stacked_items: true
          });
        }
        $scope.setBasketItem($scope.bb.stacked_items[0]);
        return true;
      } else {
        AlertService.clear();
        AlertService.add("danger", {
          msg: "You need to select at least one treatment to continue"
        });
        return false;
      }
    };
    return $scope.selectDuration = function(service) {
      var modalInstance;
      if (service.max_bookings === 1) {
        return $scope.addItem(service);
      } else {
        modalInstance = $modal.open({
          templateUrl: $scope.getPartial('_select_duration_modal'),
          scope: $scope,
          controller: function($scope, $modalInstance, service) {
            var range;
            range = _.range(service.max_bookings);
            $scope.durations = _.map(range, function(x) {
              return service.listed_durations * (x + 1);
            });
            $scope.duration = $scope.durations[0];
            $scope.service = service;
            $scope.cancel = function() {
              return $modalInstance.dismiss('cancel');
            };
            return $scope.setDuration = function() {
              return $modalInstance.close({
                service: $scope.service,
                duration: $scope.duration
              });
            };
          },
          resolve: {
            service: function() {
              return service;
            }
          }
        });
        return modalInstance.result.then(function(result) {
          return $scope.addItem(result.service, result.duration);
        });
      }
    };
  });

}).call(this);
