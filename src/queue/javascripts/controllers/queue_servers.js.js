
/***
* @ngdoc controller
* @name BBQueue.Controllers:bbQueueServers
*
* @description
*{@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbQueueServers
*
* # Has the following set of methods:
*
* - $scope.getServers()
* - $scope.setAttendance(person, status)
* - $scope.updateQueuers()
* - $scope.startServingQueuer(person, queuer)
* - $scope.finishServingQueuer(person)
* - $scope.dropCallback(event, ui, queuer, $index)
* - $scope.dragStart(event, ui, queuer)
* - $scope.dragStop(event, ui)
*
* @requires $scope
* @requires $log
* @requires BBQueue.Services:AdminQueueService
* @requires BB.Services:ModalForm
* @requires BBAdmin.Services:AdminPersonService
*
 */

(function() {
  angular.module('BBQueue').controller('bbQueueServers', function($scope, $log, AdminQueueService, ModalForm, AdminPersonService) {
    $scope.loading = true;

    /***
    * @ngdoc method
    * @name $scope.getServers
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.getServers = function() {
      return AdminPersonService.query({
        company: $scope.company
      }).then(function(people) {
        var i, len, person, ref;
        $scope.all_people = people;
        $scope.servers = [];
        ref = $scope.all_people;
        for (i = 0, len = ref.length; i < len; i++) {
          person = ref[i];
          if (!person.queuing_disabled) {
            $scope.servers.push(person);
          }
        }
        $scope.loading = false;
        return $scope.updateQueuers();
      }, function(err) {
        $log.error(err.data);
        return $scope.loading = false;
      });
    };

    /***
    * @ngdoc method
    * @name $scope.setAttendance
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.setAttendance = function(person, status) {
      $scope.loading = true;
      return person.setAttendance(status).then(function(person) {
        return $scope.loading = false;
      }, function(err) {
        $log.error(err.data);
        return $scope.loading = false;
      });
    };
    $scope.$watch('queuers', (function(_this) {
      return function(newValue, oldValue) {
        return $scope.updateQueuers();
      };
    })(this));

    /***
    * @ngdoc method
    * @name $scope.updateQueuers
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.updateQueuers = function() {
      var i, j, len, len1, queuer, ref, ref1, results, server, shash;
      if ($scope.queuers && $scope.servers) {
        shash = {};
        ref = $scope.servers;
        for (i = 0, len = ref.length; i < len; i++) {
          server = ref[i];
          server.serving = null;
          shash[server.self] = server;
        }
        ref1 = $scope.queuers;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          queuer = ref1[j];
          if (queuer.$href('person') && shash[queuer.$href('person')] && queuer.position === 0) {
            results.push(shash[queuer.$href('person')].serving = queuer);
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    /***
    * @ngdoc method
    * @name $scope.startServingQueuer
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.startServingQueuer = function(person, queuer) {
      return queuer.startServing(person).then(function() {
        return $scope.getQueuers();
      });
    };

    /***
    * @ngdoc method
    * @name $scope.finishServingQueuer
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.finishServingQueuer = function(person) {
      person.finishServing();
      return $scope.getQueuers();
    };

    /***
    * @ngdoc method
    * @name $scope.dropCallback
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.dropCallback = function(event, ui, queuer, $index) {
      console.log("dropcall");
      $scope.$apply(function() {
        return $scope.selectQueuer(null);
      });
      return false;
    };

    /***
    * @ngdoc method
    * @name $scope.dragStart
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    $scope.dragStart = function(event, ui, queuer) {
      $scope.$apply(function() {
        $scope.selectDragQueuer(queuer);
        return $scope.selectQueuer(queuer);
      });
      console.log("start", queuer);
      return false;
    };

    /***
    * @ngdoc method
    * @name $scope.dragStop
    * @methodOf BBQueue.Controllers:bbQueueServers
    * @description
    *
     */
    return $scope.dragStop = function(event, ui) {
      console.log("stop", event, ui);
      $scope.$apply(function() {
        return $scope.selectQueuer(null);
      });
      return false;
    };
  });

}).call(this);
