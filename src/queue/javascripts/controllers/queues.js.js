
/***
* @ngdoc controller
* @name BBQueue.Controllers:bbQueues
*
* @description
*{@link https://docs.angularjs.org/guide/controller more about Controllers}
*
* Controller bbQueues
*
* # Has the following set of methods:
*
* - $scope.getQueues()
*
* @requires $scope
* @requires $log
* @requires BBQueue.Services:AdminQueuerService
* @requires BB.Services:ModalForm
*
 */

(function() {
  angular.module('BBQueue').controller('bbQueues', function($scope, $log, AdminQueueService, ModalForm) {
    $scope.loading = true;

    /***
    * @ngdoc method
    * @name $scope.getQueues
    * @methodOf BBQueue.Controllers:bbQueues
    * @description
    *
     */
    return $scope.getQueues = function() {
      var params;
      params = {
        company: $scope.company
      };
      return AdminQueueService.query(params).then(function(queues) {
        $scope.queues = queues;
        return $scope.loading = false;
      }, function(err) {
        $log.error(err.data);
        return $scope.loading = false;
      });
    };
  });

}).call(this);
