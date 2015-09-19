(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbEvent
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbEvent
  *
  * See Controller {@link BB.Controllers:Event Event}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'Event'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbEvent', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Event'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Event
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Event
  *
  * # Has the following set of methods:
  *
  * - $scope.init(comp)
  * - $scope.selectTickets()
  * - $scope.selectItem(item, route)
  * - $scope.setReady()
  * - $scope.getPrePaidsForEvent(client, event)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} PageControllerService Info
  * <br>
  * {@link BB.Services:PageControllerService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} EventService Info
  * <br>
  * {@link BB.Services:EventService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
   */

  angular.module('BB.Controllers').controller('Event', function($scope, $attrs, $rootScope, EventService, $q, PageControllerService, BBModel, ValidatorService) {
    $scope.controller = "public.controllers.Event";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.validator = ValidatorService;
    $scope.event_options = $scope.$eval($attrs.bbEvent) || {};
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(comp) {
      var promises;
      $scope.event = $scope.bb.current_item.event;
      promises = [$scope.current_item.event_group.getImagesPromise(), $scope.event.prepEvent()];
      if ($scope.client) {
        promises.push($scope.getPrePaidsForEvent($scope.client, $scope.event));
      }
      return $q.all(promises).then(function(result) {
        var i, image, len, ref, ticket;
        if (result[0] && result[0].length > 0) {
          image = result[0][0];
          image.background_css = {
            'background-image': 'url(' + image.url + ')'
          };
          $scope.event.image = image;
        }
        ref = $scope.event.tickets;
        for (i = 0, len = ref.length; i < len; i++) {
          ticket = ref[i];
          ticket.qty = $scope.event_options.default_num_tickets ? $scope.event_options.default_num_tickets : 0;
        }
        if ($scope.event_options.default_num_tickets && $scope.event_options.auto_select_tickets && $scope.event.tickets.length === 1) {
          $scope.selectTickets();
        }
        $scope.tickets = $scope.event.tickets;
        $scope.bb.basket.total_price = $scope.bb.basket.totalPrice();
        $scope.stopTicketWatch = $scope.$watch('tickets', function(tickets, oldtickets) {
          $scope.bb.basket.total_price = $scope.bb.basket.totalPrice();
          return $scope.event.updatePrice();
        }, true);
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    $scope.selectTickets = function() {
      var base_item, c, i, item, j, len, ref, ref1, ticket;
      $scope.notLoaded($scope);
      $scope.bb.emptyStackedItems();
      base_item = $scope.current_item;
      ref = $scope.event.tickets;
      for (i = 0, len = ref.length; i < len; i++) {
        ticket = ref[i];
        if (ticket.qty) {
          switch ($scope.event.chain.ticket_type) {
            case "single_space":
              for (c = j = 1, ref1 = ticket.qty; 1 <= ref1 ? j <= ref1 : j >= ref1; c = 1 <= ref1 ? ++j : --j) {
                item = new BBModel.BasketItem();
                angular.extend(item, base_item);
                item.tickets = angular.copy(ticket);
                item.tickets.qty = 1;
                $scope.bb.stackItem(item);
              }
              break;
            case "multi_space":
              item = new BBModel.BasketItem();
              angular.extend(item, base_item);
              item.tickets = angular.copy(ticket);
              item.tickets.qty = ticket.qty;
              $scope.bb.stackItem(item);
          }
        }
      }
      if ($scope.bb.stacked_items.length === 0) {
        $scope.setLoaded($scope);
        return;
      }
      $scope.bb.pushStackToBasket();
      return $scope.updateBasket().then((function(_this) {
        return function() {
          $scope.setLoaded($scope);
          $scope.selected_tickets = true;
          $scope.stopTicketWatch();
          $scope.tickets = (function() {
            var k, len1, ref2, results;
            ref2 = $scope.bb.basket.items;
            results = [];
            for (k = 0, len1 = ref2.length; k < len1; k++) {
              item = ref2[k];
              results.push(item.tickets);
            }
            return results;
          })();
          return $scope.$watch('bb.basket.items', function(items, olditems) {
            $scope.bb.basket.total_price = $scope.bb.basket.totalPrice();
            return item.tickets.price = item.totalPrice();
          }, true);
        };
      })(this), function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.event = item;
          return false;
        } else {
          $scope.bb.current_item.setEvent(item);
          $scope.bb.current_item.ready = false;
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.setReady = (function(_this) {
      return function() {
        $scope.bb.event_details = {
          name: $scope.event.chain.name,
          image: $scope.event.image,
          address: $scope.event.chain.address,
          datetime: $scope.event.date,
          end_datetime: $scope.event.end_datetime,
          duration: $scope.event.duration,
          tickets: $scope.event.tickets
        };
        return $scope.updateBasket();
      };
    })(this);
    return $scope.getPrePaidsForEvent = function(client, event) {
      var defer, params;
      defer = $q.defer();
      params = {
        event_id: event.id
      };
      client.getPrePaidBookingsPromise(params).then(function(prepaids) {
        $scope.pre_paid_bookings = prepaids;
        return defer.resolve(prepaids);
      }, function(err) {
        return defer.reject(err);
      });
      return defer.promise;
    };
  });

}).call(this);
