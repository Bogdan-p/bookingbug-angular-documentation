
/***
* @ngdoc controller
* @name BBQueue.Controllers:bbQueuers
*
* @description
*{@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbQueuers
*
* # Has the following set of methods:
*
* - $scope.getQueuers()
* - $scope.newQueuerModal()
*
* @requires $scope
* @requires $log
* @requires BBQueue.Services:AdminQueuerService
* @requires BB.Services:ModalForm
* @requires $interval
*
 */

(function() {
  angular.module('BBQueue').controller('bbQueuers', function($scope, $log, AdminQueuerService, ModalForm, $interval) {
    $scope.loading = true;

    /***
    * @ngdoc method
    * @name $scope.getQueuers
    * @methodOf BBQueue.Controllers:bbQueuers
    * @description
    *
     */
    $scope.getQueuers = function() {
      var params;
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
        return $scope.loading = false;
      }, function(err) {
        $log.error(err.data);
        return $scope.loading = false;
      });
    };

    /***
    * @ngdoc method
    * @name $scope.newQueuerModal
    * @methodOf BBQueue.Controllers:bbQueuers
    * @description
    *
     */
    $scope.newQueuerModal = function() {
      return ModalForm["new"]({
        company: $scope.company,
        title: 'New Queuer',
        new_rel: 'new_queuer',
        post_rel: 'queuers',
        success: function(queuer) {
          return $scope.queuers.push(queuer);
        }
      });
    };
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
