
/***
* @ngdoc controller
* @name BBQueue.Controllers:bbQueueDashboardController
*
* @description
* {@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbQueueDashboardController
*
* # Has the following set of methods:
*
* - $scope.getSetup()
* - $scope.getQueuers()
* - $scope.overTrash(event, ui, set)
*   - $scope.hoverOver(event, ui, obj, set)
* - $scope.dropQueuer(event, ui, server, trash)
* - $scope.selectQueuer(queuer)
* - $scope.selectDragQueuer(queuer)
* - $scope.addQueuer(service)
* - $scope.pusherSubscribe()
*   - pusherEvent(res)
*
* @requires $scope
* @requires $log
* @requires BBAdmin.Services:AdminServiceService
* @requires BBQueue.Services:AdminQueuerService
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
* @requires $interval
* @requires $sessionStorage
*
 */

(function() {
  angular.module('BBQueue').controller('bbQueueDashboardController', function($scope, $log, AdminServiceService, AdminQueuerService, ModalForm, BBModel, $interval, $sessionStorage) {
    $scope.loading = true;
    $scope.waiting_for_queuers = false;
    $scope.queuers = [];
    $scope.new_queuer = {};

    /***
    * @ngdoc method
    * @name $scope.getSetup
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    * params =
    *   company: $scope.company
    * AdminServiceService.query(params).then (services) ->
    *   ...
    * </pre>
    *
     */
    $scope.getSetup = function() {
      var params;
      params = {
        company: $scope.company
      };
      AdminServiceService.query(params).then(function(services) {
        var i, len, service;
        $scope.services = [];
        for (i = 0, len = services.length; i < len; i++) {
          service = services[i];
          if (!service.queuing_disabled) {
            $scope.services.push(service);
          }
        }
        return $scope.loading = false;
      }, function(err) {
        $log.error(err.data);
        return $scope.loading = false;
      });
      $scope.pusherSubscribe();
      return $scope.getQueuers();
    };

    /***
    * @ngdoc method
    * @name $scope.getQueuers
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  return if $scope.waiting_for_queuers
    * $scope.waiting_for_queuers = true
    * params =
    *   ...
    * </pre>
    *
     */
    $scope.getQueuers = function() {
      var params;
      if ($scope.waiting_for_queuers) {
        return;
      }
      $scope.waiting_for_queuers = true;
      params = {
        company: $scope.company
      };
      return AdminQueuerService.query(params).then(function(queuers) {
        var i, len, queuer;
        $scope.queuers = queuers;
        $scope.waiting_queuers = [];
        for (i = 0, len = queuers.length; i < len; i++) {
          queuer = queuers[i];
          queuer.remaining();
          if (queuer.position > 0) {
            $scope.waiting_queuers.push(queuer);
          }
        }
        $scope.loading = false;
        return $scope.waiting_for_queuers = false;
      }, function(err) {
        $log.error(err.data);
        $scope.loading = false;
        return $scope.waiting_for_queuers = false;
      });
    };

    /***
    * @ngdoc method
    * @name $scope.overTrash
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *   $scope.$apply () ->
    *   $scope.trash_hover = set
    * </pre>
    *
     */
    $scope.overTrash = function(event, ui, set) {
      return $scope.$apply(function() {
        return $scope.trash_hover = set;
      });
    };

    /***
    * @ngdoc method
    * @name $scope.hoverOver
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  console.log event, ui, obj, set
    *  $scope.$apply () ->
    *   obj.hover = set     
    * </pre>
    *
     */
    $scope.hoverOver = function(event, ui, obj, set) {
      console.log(event, ui, obj, set);
      return $scope.$apply(function() {
        return obj.hover = set;
      });
    };

    /***
    * @ngdoc method
    * @name $scope.dropQueuer
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  if $scope.drag_queuer
    *   if trash
    *     $scope.trash_hover = false
    *     ...
    * </pre>
    *
     */
    $scope.dropQueuer = function(event, ui, server, trash) {
      if ($scope.drag_queuer) {
        if (trash) {
          $scope.trash_hover = false;
          $scope.drag_queuer.$del('self').then(function(queuer) {});
        }
        if (server) {
          return $scope.drag_queuer.startServing(server).then(function() {});
        }
      }
    };

    /***
    * @ngdoc method
    * @name $scope.selectQueuer
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  if $scope.selected_queuer && $scope.selected_queuer == queuer
    *    $scope.selected_queuer = null
    *  else
    *  ...
    * </pre>
    *
     */
    $scope.selectQueuer = function(queuer) {
      if ($scope.selected_queuer && $scope.selected_queuer === queuer) {
        return $scope.selected_queuer = null;
      } else {
        return $scope.selected_queuer = queuer;
      }
    };

    /***
    * @ngdoc method
    * @name $scope.selectDragQueuer
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  $scope.drag_queuer = queuer 
    * </pre>
    *
     */
    $scope.selectDragQueuer = function(queuer) {
      return $scope.drag_queuer = queuer;
    };

    /***
    * @ngdoc method
    * @name $scope.addQueuer
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  $scope.new_queuer.service_id = service.id
    *  service.$post('queuers', {}, $scope.new_queuer).then (queuer) -> 
    * </pre>
    *
     */
    $scope.addQueuer = function(service) {
      $scope.new_queuer.service_id = service.id;
      return service.$post('queuers', {}, $scope.new_queuer).then(function(queuer) {});
    };

    /***
    * @ngdoc method
    * @name $scope.pusherSubscribe
    * @methodOf BBQueue.Controllers:bbQueueDashboardController
    * @description
    * <pre>
    *  if $scope.company? && Pusher?
    *   if !$scope.pusher?
    *     $scope.pusher = new Pusher 'c8d8cea659cc46060608',
    *       ...
    * </pre>
    *
     */
    $scope.pusherSubscribe = (function(_this) {
      return function() {
        var channelName, pusherEvent;
        if (($scope.company != null) && (typeof Pusher !== "undefined" && Pusher !== null)) {
          if ($scope.pusher == null) {
            $scope.pusher = new Pusher('c8d8cea659cc46060608', {
              authEndpoint: "/api/v1/push/" + $scope.company.id + "/pusher.json",
              auth: {
                headers: {
                  'App-Id': 'f6b16c23',
                  'App-Key': 'f0bc4f65f4fbfe7b4b3b7264b655f5eb',
                  'Auth-Token': $sessionStorage.getItem('auth_token')
                }
              }
            });
          }
          channelName = "mobile-queue-" + $scope.company.id;
          if ($scope.pusher.channel(channelName) == null) {
            $scope.pusher_channel = $scope.pusher.subscribe(channelName);
            pusherEvent = function(res) {
              return $scope.getQueuers();
            };
            return $scope.pusher_channel.bind('notification', pusherEvent);
          }
        }
      };
    })(this);
    return $interval(function() {
      var i, len, queuer, ref, results;
      if ($scope.queuers) {
        ref = $scope.queuers;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          queuer = ref[i];
          results.push(queuer.remaining());
        }
        return results;
      }
    }, 5000);
  });

}).call(this);
