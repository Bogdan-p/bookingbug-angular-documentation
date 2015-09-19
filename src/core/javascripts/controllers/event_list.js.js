(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbEvents
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbEvents
  *
  * See Controller {@link BB.Controllers:EventList EventList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'EventList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbEvents', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'EventList',
      link: function(scope, element, attrs) {
        var options;
        scope.summary = attrs.summary != null;
        options = scope.$eval(attrs.bbEvents || {});
        scope.mode = options && options.mode ? options.mode : 0;
        if (scope.summary) {
          scope.mode = 0;
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:EventList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller EventList
  *
  * # Has the following set of methods:
  *
  * - $scope.initialise()
  * - $scope.loadEventSummary()
  * - $scope.loadEventChainData(comp)
  * - $scope.loadEventData(comp)
  * - isFullyBooked()
  * - $scope.showDay(day)
  * - $scope.selectItem(item, route)
  * - $scope.setReady()
  * - $scope.filterEvents(item)
  * - filterEventsWithDynamicFilters(item)
  * - $scope.filterDateChanged()
  * - $scope.resetFilters()
  * - buildDynamicFilters(questions)
  * - sort()
  * - $scope.filterChanged()
  * - $scope.pageChanged()
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} EventService Info
  * <br>
  * {@link BB.Services:EventService more}
  *
  * @param {service} EventChainService Info
  * <br>
  * {@link BB.Services:EventChainService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} PageControllerService Info
  * <br>
  * {@link BB.Services:PageControllerService more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} $filter Filters are used for formatting data displayed to the user.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$filter more}
  *
  * @param {service} PaginationService Info
  * <br>
  * {@link BB.Services:PaginationService more}
  *
   */

  angular.module('BB.Controllers').controller('EventList', function($scope, $rootScope, EventService, EventChainService, $q, PageControllerService, FormDataStoreService, $filter, PaginationService) {
    var buildDynamicFilters, filterEventsWithDynamicFilters, isFullyBooked, sort;
    $scope.controller = "public.controllers.EventList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.pick = {};
    $scope.start_date = moment();
    $scope.end_date = moment().add(1, 'year');
    $scope.filters = {};
    $scope.price_options = [0, 1000, 2500, 5000];
    $scope.pagination = PaginationService.initialise({
      page_size: 10,
      max_size: 5
    });
    $scope.events = {};
    $scope.fully_booked = false;
    FormDataStoreService.init('EventList', $scope, ['selected_date', 'event_group_id', 'event_group_manually_set']);
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        if ($scope.bb.item_defaults.event) {
          $scope.skipThisStep();
          $scope.decideNextPage();
        } else if ($scope.bb.company.$has('parent') && !$scope.bb.company.$has('company_questions')) {
          return $scope.bb.company.getParentPromise().then(function(parent) {
            $scope.company_parent = parent;
            return $scope.initialise();
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.initialise();
        }
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.initialise = function() {
      var event_group, promises;
      $scope.notLoaded($scope);
      $scope.event_group_manually_set = ($scope.event_group_manually_set == null) && ($scope.current_item.event_group != null) ? true : false;
      if ($scope.current_item.event && $scope.mode !== 0) {
        event_group = $scope.current_item.event_group;
        $scope.clearBasketItem();
        $scope.emptyBasket();
        if ($scope.event_group_manually_set) {
          $scope.current_item.setEventGroup(event_group);
        }
      }
      promises = [];
      if ($scope.bb.company.$has('company_questions')) {
        promises.push($scope.bb.company.getCompanyQuestionsPromise());
      } else if (($scope.company_parent != null) && $scope.company_parent.$has('company_questions')) {
        promises.push($scope.company_parent.getCompanyQuestionsPromise());
      } else {
        promises.push($q.when([]));
        $scope.has_company_questions = false;
      }
      if (!$scope.current_item.event_group) {
        promises.push($scope.bb.company.getEventGroupsPromise());
      } else {
        promises.push($q.when([]));
      }
      if ($scope.mode === 0 || $scope.mode === 2) {
        promises.push($scope.loadEventSummary());
      } else {
        promises.push($q.when([]));
      }
      if ($scope.mode === 1 || $scope.mode === 2) {
        promises.push($scope.loadEventData());
      } else {
        promises.push($q.when([]));
      }
      return $q.all(promises).then(function(result) {
        var company_questions, event_data, event_groups, event_summary;
        company_questions = result[0];
        event_groups = result[1];
        event_summary = result[2];
        event_data = result[3];
        $scope.has_company_questions = (company_questions != null) && company_questions.length > 0;
        if (company_questions) {
          buildDynamicFilters(company_questions);
        }
        if (event_groups) {
          $scope.event_groups = _.indexBy(event_groups, 'id');
        }
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    $scope.loadEventSummary = function() {
      var comp, current_event, deferred, params;
      deferred = $q.defer();
      current_event = $scope.current_item.event;
      if ($scope.bb.current_item && ($scope.bb.current_item.event_chain_id || $scope.bb.current_item.event_chain)) {
        delete $scope.bb.current_item.event_chain;
        delete $scope.bb.current_item.event_chain_id;
      }
      comp = $scope.bb.company;
      params = {
        item: $scope.bb.current_item,
        start_date: $scope.start_date.toISODate(),
        end_date: $scope.end_date.toISODate()
      };
      if ($scope.bb.item_defaults.event_chain) {
        params.event_chain_id = $scope.bb.item_defaults.event_chain;
      }
      EventService.summary(comp, params).then(function(items) {
        var d, item, item_dates, j, len;
        if (items && items.length > 0) {
          item_dates = [];
          for (j = 0, len = items.length; j < len; j++) {
            item = items[j];
            d = moment(item);
            item_dates.push({
              date: d,
              idate: parseInt(d.format("YYYYDDDD")),
              count: 1,
              spaces: 1
            });
          }
          $scope.item_dates = item_dates.sort(function(a, b) {
            return a.idate - b.idate;
          });
          if ($scope.mode === 0) {
            if ($scope.selected_date && ($scope.selected_date.isAfter($scope.item_dates[0].date) || $scope.selected_date.isSame($scope.item_dates[0].date)) && ($scope.selected_date.isBefore($scope.item_dates[$scope.item_dates.length - 1].date) || $scope.selected_date.isSame($scope.item_dates[$scope.item_dates.length - 1].date))) {
              $scope.showDay($scope.selected_date);
            } else {
              $scope.showDay($scope.item_dates[0].date);
            }
          }
        }
        return deferred.resolve($scope.item_dates);
      }, function(err) {
        return deferred.reject();
      });
      return deferred.promise;
    };
    $scope.loadEventChainData = function(comp) {
      var deferred, params;
      deferred = $q.defer();
      if ($scope.bb.item_defaults.event_chain) {
        deferred.resolve([]);
      } else {
        $scope.notLoaded($scope);
        comp || (comp = $scope.bb.company);
        params = {
          item: $scope.bb.current_item,
          start_date: $scope.start_date.toISODate(),
          end_date: $scope.end_date.toISODate()
        };
        EventChainService.query(comp, params).then(function(events) {
          $scope.setLoaded($scope);
          return deferred.resolve($scope.items);
        }, function(err) {
          return deferred.reject();
        });
      }
      return deferred.promise;
    };
    $scope.loadEventData = function(comp) {
      var chains, current_event, deferred, params;
      deferred = $q.defer();
      current_event = $scope.current_item.event;
      $scope.notLoaded($scope);
      comp || (comp = $scope.bb.company);
      if ($scope.bb.current_item && ($scope.bb.current_item.event_chain_id || $scope.bb.current_item.event_chain)) {
        delete $scope.bb.current_item.event_chain;
        delete $scope.bb.current_item.event_chain_id;
      }
      params = {
        item: $scope.bb.current_item,
        start_date: $scope.start_date.toISODate(),
        end_date: $scope.end_date.toISODate()
      };
      if ($scope.bb.item_defaults.event_chain) {
        params.event_chain_id = $scope.bb.item_defaults.event_chain;
      }
      chains = $scope.loadEventChainData(comp);
      $scope.events = {};
      EventService.query(comp, params).then(function(events) {
        var key, value;
        events = _.groupBy(events, function(event) {
          return event.date.toISODate();
        });
        for (key in events) {
          value = events[key];
          $scope.events[key] = value;
        }
        $scope.items = _.flatten(_.toArray($scope.events));
        return chains.then(function() {
          var idate, item, item_dates, j, k, len, len1, ref, x, y;
          ref = $scope.items;
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            item.prepEvent();
            if ($scope.mode === 0 && current_event && current_event.self === item.self) {
              item.select();
              $scope.event = item;
            }
          }
          if ($scope.mode === 1) {
            item_dates = {};
            if (items.length > 0) {
              for (k = 0, len1 = items.length; k < len1; k++) {
                item = items[k];
                item.getDuration();
                idate = parseInt(item.date.format("YYYYDDDD"));
                item.idate = idate;
                if (!item_dates[idate]) {
                  item_dates[idate] = {
                    date: item.date,
                    idate: idate,
                    count: 0,
                    spaces: 0
                  };
                }
                item_dates[idate].count += 1;
                item_dates[idate].spaces += item.num_spaces;
              }
              $scope.item_dates = [];
              for (x in item_dates) {
                y = item_dates[x];
                $scope.item_dates.push(y);
              }
              $scope.item_dates = $scope.item_dates.sort(function(a, b) {
                return a.idate - b.idate;
              });
            } else {
              idate = parseInt($scope.start_date.format("YYYYDDDD"));
              $scope.item_dates = [
                {
                  date: $scope.start_date,
                  idate: idate,
                  count: 0,
                  spaces: 0
                }
              ];
            }
          }
          isFullyBooked();
          $scope.filtered_items = $scope.items;
          $scope.filterChanged();
          PaginationService.update($scope.pagination, $scope.filtered_items.length);
          $scope.setLoaded($scope);
          return deferred.resolve($scope.items);
        }, function(err) {
          return deferred.reject();
        });
      }, function(err) {
        return deferred.reject();
      });
      return deferred.promise;
    };
    isFullyBooked = function() {
      var full_events, item, j, len, ref;
      full_events = [];
      ref = $scope.items;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        if (item.num_spaces === item.spaces_booked) {
          full_events.push(item);
        }
      }
      if (full_events.length === $scope.items.length) {
        return $scope.fully_booked = true;
      }
    };
    $scope.showDay = function(day) {
      var date, new_date;
      if (!day || (day && !day.data)) {
        return;
      }
      if ($scope.selected_day) {
        $scope.selected_day.selected = false;
      }
      date = day.date;
      if ($scope.event && !$scope.selected_date.isSame(date, 'day')) {
        delete $scope.event;
      }
      if ($scope.mode === 0) {
        new_date = date;
        $scope.start_date = moment(date);
        $scope.end_date = moment(date);
        $scope.loadEventData();
      } else {
        if (!$scope.selected_date || !date.isSame($scope.selected_date, 'day')) {
          new_date = date;
        }
      }
      if (new_date) {
        $scope.selected_date = new_date;
        $scope.filters.date = new_date.toDate();
        $scope.selected_day = day;
        $scope.selected_day.selected = true;
      } else {
        delete $scope.selected_date;
        delete $scope.filters.date;
      }
      return $scope.filterChanged();
    };
    $scope.$watch('pick.date', (function(_this) {
      return function(new_val, old_val) {
        if (new_val) {
          $scope.start_date = moment(new_val);
          $scope.end_date = moment(new_val);
          return $scope.loadEventData();
        }
      };
    })(this));
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if (!((item.getSpacesLeft() <= 0 && $scope.bb.company.settings.has_waitlists) || item.hasSpace())) {
          return false;
        }
        $scope.notLoaded($scope);
        if ($scope.$parent.$has_page_control) {
          if ($scope.event) {
            $scope.event.unselect();
          }
          $scope.event = item;
          $scope.event.select();
          $scope.setLoaded($scope);
          return false;
        } else {
          $scope.bb.current_item.setEvent(item);
          $scope.bb.current_item.ready = false;
          $q.all($scope.bb.current_item.promises).then(function() {
            return $scope.decideNextPage(route);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
          return true;
        }
      };
    })(this);
    $scope.setReady = function() {
      if (!$scope.event) {
        return false;
      }
      $scope.bb.current_item.setEvent($scope.event);
      return true;
    };
    $scope.filterEvents = function(item) {
      var result;
      result = (item.date.isSame(moment($scope.filters.date), 'day') || ($scope.filters.date == null)) && (($scope.filters.event_group && item.service_id === $scope.filters.event_group.id) || ($scope.filters.event_group == null)) && ((($scope.filters.price != null) && (item.price_range.from <= $scope.filters.price)) || ($scope.filters.price == null)) && (($scope.filters.hide_sold_out_events && item.getSpacesLeft() !== 0) || !$scope.filters.hide_sold_out_events) && filterEventsWithDynamicFilters(item);
      return result;
    };
    filterEventsWithDynamicFilters = function(item) {
      var dynamic_filter, filter, i, j, k, l, len, len1, len2, len3, m, name, ref, ref1, ref2, ref3, result, type;
      if (!$scope.has_company_questions || !$scope.dynamic_filters) {
        return true;
      }
      result = true;
      ref = $scope.dynamic_filters.question_types;
      for (j = 0, len = ref.length; j < len; j++) {
        type = ref[j];
        if (type === 'check') {
          ref1 = $scope.dynamic_filters['check'];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            dynamic_filter = ref1[k];
            name = dynamic_filter.name.parameterise('_');
            filter = false;
            if (item.chain && item.chain.extra[name]) {
              ref2 = item.chain.extra[name];
              for (l = 0, len2 = ref2.length; l < len2; l++) {
                i = ref2[l];
                filter = ($scope.dynamic_filters.values[dynamic_filter.name] && i === $scope.dynamic_filters.values[dynamic_filter.name].name) || ($scope.dynamic_filters.values[dynamic_filter.name] == null);
                if (filter) {
                  break;
                }
              }
            } else if (item.chain.extra[name] === void 0 && (item.chain != null)) {
              filter = true;
            }
            result = result && filter;
          }
        } else {
          ref3 = $scope.dynamic_filters[type];
          for (m = 0, len3 = ref3.length; m < len3; m++) {
            dynamic_filter = ref3[m];
            name = dynamic_filter.name.parameterise('_');
            filter = ($scope.dynamic_filters.values[dynamic_filter.name] && item.chain.extra[name] === $scope.dynamic_filters.values[dynamic_filter.name].name) || ($scope.dynamic_filters.values[dynamic_filter.name] == null);
            result = result && filter;
          }
        }
      }
      return result;
    };
    $scope.filterDateChanged = function() {
      $scope.filterChanged();
      return $scope.showDay(moment($scope.filters.date));
    };
    $scope.resetFilters = function() {
      $scope.filters = {};
      if ($scope.has_company_questions) {
        $scope.dynamic_filters.values = {};
      }
      return $scope.filterChanged();
    };
    buildDynamicFilters = function(questions) {
      $scope.dynamic_filters = _.groupBy(questions, 'question_type');
      $scope.dynamic_filters.question_types = _.uniq(_.pluck(questions, 'question_type'));
      return $scope.dynamic_filters.values = {};
    };
    sort = function() {};
    $scope.filterChanged = function() {
      if ($scope.items) {
        $scope.filtered_items = $filter('filter')($scope.items, $scope.filterEvents);
        $scope.pagination.num_items = $scope.filtered_items.length;
        $scope.filter_active = $scope.filtered_items.length !== $scope.items.length;
        return PaginationService.update($scope.pagination, $scope.filtered_items.length);
      }
    };
    $scope.pageChanged = function() {
      PaginationService.update($scope.pagination, $scope.filtered_items.length);
      return $rootScope.$broadcast("page:changed");
    };
    return $scope.$on('month_picker:month_changed', function(event, month, last_month_shown) {
      var last_event;
      if (!$scope.items || $scope.mode === 0) {
        return;
      }
      last_event = _.last($scope.items).date;
      if (last_month_shown.start_date.isSame(last_event, 'month')) {
        $scope.start_date = last_month_shown.start_date;
        return $scope.loadEventData();
      }
    });
  });

}).call(this);
