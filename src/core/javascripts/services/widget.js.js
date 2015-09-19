(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:BBWidget
  *
  * @description
  * Factory BBWidget
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} BasketService Info
  * <br>
  * {@link BB.Services:BasketService more}
  *
  * @param {service} BreadcrumbService Info
  * <br>
  * {@link BB.Services:BreadcrumbService more}
  *
  * @param {service} Factory for UrlMatcher instances. The factory is also available to providers under the name $urlMatcherFactoryProvider.
  * <br>
  * {@link http://angular-ui.github.io/ui-router/site/#/api/ui.router.util.$urlMatcherFactory more}
  *
  @returns {object} Newly created BBWidget object with the following set of methods:
  
  * - constructor()
  * - pageURL(route)
  * - updateRoute(page)
  * - setRouteFormat(route)
  * - matchURLToStep()
  * - convertToDashSnakeCase(str)
  * - recordCurrentPage()
  * - recordStep(step, title)
  * - calculatePercentageComplete(step_number)
  * - setRoute(rdata)
  * - setBasicRoute(routes)
  * - waitForRoutes()
  * - stackItem(item)
  * - setStackedItems(items)
  * - sortStackedItems()
  * - deleteStackedItem(item)
  * - removeItemFromStack(item)
  * - deleteStackedItemByService(item)
  * - emptyStackedItems()
  * - pushStackToBasket()
  * - totalStackedItemsDuration()
  * - clearStackedItemsDateTime()
  * - clearAddress()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('BB.Models').factory("BBWidget", function($q, BBModel, BasketService, $urlMatcherFactory, $location, BreadcrumbService, $window, $rootScope) {
    var Widget;
    return Widget = (function() {
      function Widget() {
        this.clearAddress = bind(this.clearAddress, this);
        this.emptyStackedItems = bind(this.emptyStackedItems, this);
        this.deleteStackedItemByService = bind(this.deleteStackedItemByService, this);
        this.removeItemFromStack = bind(this.removeItemFromStack, this);
        this.deleteStackedItem = bind(this.deleteStackedItem, this);
        this.sortStackedItems = bind(this.sortStackedItems, this);
        this.setStackedItems = bind(this.setStackedItems, this);
        this.stackItem = bind(this.stackItem, this);
        this.waitForRoutes = bind(this.waitForRoutes, this);
        this.setBasicRoute = bind(this.setBasicRoute, this);
        this.setRoute = bind(this.setRoute, this);
        this.calculatePercentageComplete = bind(this.calculatePercentageComplete, this);
        this.recordStep = bind(this.recordStep, this);
        this.recordCurrentPage = bind(this.recordCurrentPage, this);
        this.uid = _.uniqueId('bbwidget_');
        this.page_suffix = "";
        this.steps = [];
        this.allSteps = [];
        this.item_defaults = {};
        this.usingBasket = false;
        this.confirmCheckout = false;
        this.isAdmin = false;
        this.payment_status = null;
      }

      Widget.prototype.pageURL = function(route) {
        return route + '.html';
      };

      Widget.prototype.updateRoute = function(page) {
        var company, date, event_group, pattern, prms, service_name, time, url;
        if (!this.routeFormat) {
          return;
        }
        page || (page = this.current_page);
        pattern = $urlMatcherFactory.compile(this.routeFormat);
        service_name = "-";
        event_group = "-";
        if (this.current_item) {
          if (this.current_item.service) {
            service_name = this.convertToDashSnakeCase(this.current_item.service.name);
          }
          if (this.current_item.event_group) {
            event_group = this.convertToDashSnakeCase(this.current_item.event_group.name);
          }
          if (this.current_item.date) {
            date = this.current_item.date.date.toISODate();
          }
          if (this.current_item.time) {
            time = this.current_item.time.time;
          }
          if (this.current_item.company) {
            company = this.convertToDashSnakeCase(this.current_item.company.name);
          }
        }
        if (this.route_values) {
          prms = angular.copy(this.route_values);
        }
        prms || (prms = {});
        angular.extend(prms, {
          page: page,
          company: company,
          service: service_name,
          event_group: event_group,
          date: date,
          time: time
        });
        url = pattern.format(prms);
        url = url.replace(/\/+$/, "");
        $location.path(url);
        this.routing = true;
        return url;
      };

      Widget.prototype.setRouteFormat = function(route) {
        var match, match_test, parts, path, pattern;
        this.routeFormat = route;
        if (!this.routeFormat) {
          return;
        }
        this.routing = true;
        path = $location.path();
        if (path) {
          parts = this.routeFormat.split("/");
          while (parts.length > 0 && !match) {
            match_test = parts.join("/");
            pattern = $urlMatcherFactory.compile(match_test);
            match = pattern.exec(path);
            parts.pop();
          }
          if (match) {
            if (match.company) {
              this.item_defaults.company = decodeURIComponent(match.company);
            }
            if (match.service && match.service !== "-") {
              this.item_defaults.service = decodeURIComponent(match.service);
            }
            if (match.event_group && match.event_group !== "-") {
              this.item_defaults.event_group = match.event_group;
            }
            if (match.person) {
              this.item_defaults.person = decodeURIComponent(match.person);
            }
            if (match.resource) {
              this.item_defaults.resource = decodeURIComponent(match.resource);
            }
            if (match.date) {
              this.item_defaults.date = match.date;
            }
            if (match.time) {
              this.item_defaults.time = match.time;
            }
            return this.route_matches = match;
          }
        }
      };

      Widget.prototype.matchURLToStep = function() {
        var _i, j, len, path, ref, step;
        if (!this.routeFormat) {
          return null;
        }
        path = $location.path();
        ref = this.steps;
        for (_i = j = 0, len = ref.length; j < len; _i = ++j) {
          step = ref[_i];
          if (step.url && step.url === path) {
            return step.number;
          }
        }
        return null;
      };

      Widget.prototype.convertToDashSnakeCase = function(str) {
        str = str.toLowerCase();
        str = $.trim(str);
        str = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '');
        str = str.replace(/\s{2,}/g, ' ');
        str = str.replace(/\s/g, '-');
        return str;
      };

      Widget.prototype.recordCurrentPage = function() {
        var j, k, l, len, len1, len2, match, ref, ref1, ref2, step, title;
        if (!this.current_step) {
          this.current_step = 0;
        }
        match = false;
        if (this.allSteps) {
          ref = this.allSteps;
          for (j = 0, len = ref.length; j < len; j++) {
            step = ref[j];
            if (step.page === this.current_page) {
              this.current_step = step.number;
              match = true;
            }
          }
        }
        if (!match) {
          ref1 = this.steps;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            step = ref1[k];
            if (step && step.page === this.current_page) {
              this.current_step = step.number;
              match = true;
            }
          }
        }
        if (!match) {
          this.current_step += 1;
        }
        title = "";
        if (this.allSteps) {
          ref2 = this.allSteps;
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            step = ref2[l];
            step.active = false;
            step.passed = step.number < this.current_step;
          }
          if (this.allSteps[this.current_step - 1]) {
            this.allSteps[this.current_step - 1].active = true;
            title = this.allSteps[this.current_step - 1].title;
          }
        }
        return this.recordStep(this.current_step, title);
      };

      Widget.prototype.recordStep = function(step, title) {
        var j, len, ref;
        this.steps[step - 1] = {
          url: this.updateRoute(this.current_page),
          current_item: this.current_item.getStep(),
          page: this.current_page,
          number: step,
          title: title,
          stacked_length: this.stacked_items.length
        };
        BreadcrumbService.setCurrentStep(step);
        ref = this.steps;
        for (j = 0, len = ref.length; j < len; j++) {
          step = ref[j];
          if (step) {
            step.passed = step.number < this.current_step;
            step.active = step.number === this.current_step;
          }
        }
        this.calculatePercentageComplete(step.number);
        if ((this.allSteps && this.allSteps.length === step) || this.current_page === 'checkout') {
          return this.last_step_reached = true;
        } else {
          return this.last_step_reached = false;
        }
      };

      Widget.prototype.calculatePercentageComplete = function(step_number) {
        return this.percentage_complete = step_number && this.allSteps ? step_number / this.allSteps.length * 100 : 0;
      };

      Widget.prototype.setRoute = function(rdata) {
        var i, j, k, len, len1, ref, route, step;
        this.allSteps.length = 0;
        this.nextSteps = {};
        if (!(rdata === void 0 || rdata === null || rdata[0] === void 0)) {
          this.firstStep = rdata[0].page;
        }
        for (i = j = 0, len = rdata.length; j < len; i = ++j) {
          step = rdata[i];
          if (step.disable_breadcrumbs) {
            this.disableGoingBackAtStep = i + 1;
          }
          if (rdata[i + 1]) {
            this.nextSteps[step.page] = rdata[i + 1].page;
          }
          this.allSteps.push({
            number: i + 1,
            title: step.title,
            page: step.page
          });
          if (step.when) {
            this.routeSteps || (this.routeSteps = {});
            ref = step.when;
            for (k = 0, len1 = ref.length; k < len1; k++) {
              route = ref[k];
              this.routeSteps[route] = step.page;
            }
          }
        }
        if (this.$wait_for_routing) {
          return this.$wait_for_routing.resolve();
        }
      };

      Widget.prototype.setBasicRoute = function(routes) {
        var i, j, len, step;
        this.nextSteps = {};
        this.firstStep = routes[0];
        for (i = j = 0, len = routes.length; j < len; i = ++j) {
          step = routes[i];
          this.nextSteps[step] = routes[i + 1];
        }
        if (this.$wait_for_routing) {
          return this.$wait_for_routing.resolve();
        }
      };

      Widget.prototype.waitForRoutes = function() {
        if (!this.$wait_for_routing) {
          return this.$wait_for_routing = $q.defer();
        }
      };

      Widget.prototype.stackItem = function(item) {
        this.stacked_items.push(item);
        return this.sortStackedItems();
      };

      Widget.prototype.setStackedItems = function(items) {
        this.stacked_items = items;
        return this.sortStackedItems();
      };

      Widget.prototype.sortStackedItems = function() {
        var arr, item, j, len, ref;
        arr = [];
        ref = this.stacked_items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          arr = arr.concat(item.promises);
        }
        return $q.all(arr)['finally']((function(_this) {
          return function() {
            return _this.stacked_items = _this.stacked_items.sort(function(a, b) {
              var ref1, ref2;
              if (a.time && b.time) {
                return (ref1 = a.time.time > b.time.time) != null ? ref1 : {
                  1: -1
                };
              } else if (a.service.category && !b.service.category) {
                return 1;
              } else if (b.service.category && !a.service.category) {
                return -1;
              } else if (!b.service.category && !a.service.category) {
                return 1;
              } else {
                return (ref2 = a.service.category.order > b.service.category.order) != null ? ref2 : {
                  1: -1
                };
              }
            });
          };
        })(this));
      };

      Widget.prototype.deleteStackedItem = function(item) {
        if (item && item.id) {
          BasketService.deleteItem(item, this.company, {
            bb: this
          });
        }
        return this.stacked_items = this.stacked_items.filter(function(i) {
          return i !== item;
        });
      };

      Widget.prototype.removeItemFromStack = function(item) {
        return this.stacked_items = this.stacked_items.filter(function(i) {
          return i !== item;
        });
      };

      Widget.prototype.deleteStackedItemByService = function(item) {
        var i, j, len, ref;
        ref = this.stacked_items;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (i && i.service && i.service.self === item.self && i.id) {
            BasketService.deleteItem(i, this.company, {
              bb: this
            });
          }
        }
        return this.stacked_items = this.stacked_items.filter(function(i) {
          return i && i.service && i.service.self !== item.self;
        });
      };

      Widget.prototype.emptyStackedItems = function() {
        return this.stacked_items = [];
      };

      Widget.prototype.pushStackToBasket = function() {
        var i, j, len, ref;
        this.basket || (this.basket = new new BBModel.Basket(null, this));
        ref = this.stacked_items;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          this.basket.addItem(i);
        }
        return this.emptyStackedItems();
      };

      Widget.prototype.totalStackedItemsDuration = function() {
        var duration, item, j, len, ref;
        duration = 0;
        ref = this.stacked_items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.service && item.service.listed_duration) {
            duration += item.service.listed_duration;
          }
        }
        return duration;
      };

      Widget.prototype.clearStackedItemsDateTime = function() {
        var item, j, len, ref, results;
        ref = this.stacked_items;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          results.push(item.clearDateTime());
        }
        return results;
      };

      Widget.prototype.clearAddress = function() {
        delete this.address1;
        delete this.address2;
        delete this.address3;
        delete this.address4;
        return delete this.address5;
      };

      return Widget;

    })();
  });

}).call(this);
