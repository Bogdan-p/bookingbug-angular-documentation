(function() {
  'use strict';

  /***
  * @ngdoc controller
  * @name BBQueue.Controllers:QueuerPosition
  *
  * @description
  *{@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller QueuerPosition
  *
  * # Has the following set of methods:
  *
  * @requires BBQueue.Services:QueuerService
  * @requires $scope
  * @requires $pusher
  * @requires BB.Services:QueryStringService
  *
   */
  angular.module('BBQueue.Controllers').controller('QueuerPosition', [
    "QueuerService", "$scope", "$pusher", "QueryStringService", function(QueuerService, $scope, $pusher, QueryStringService) {
      var params;
      params = {
        id: QueryStringService('id'),
        url: $scope.apiUrl
      };
      console.log("Params: ", params);
      return QueuerService.query(params).then(function(queuer) {
        var channel, client, pusher;
        console.log("Queuer: ", queuer);
        $scope.queuer = {
          name: queuer.first_name,
          position: queuer.position,
          dueTime: queuer.due.valueOf(),
          serviceName: queuer.service.name,
          spaceId: queuer.space_id,
          ticketNumber: queuer.ticket_number
        };
        client = new Pusher("c8d8cea659cc46060608");
        console.log("Client: ", client);
        pusher = $pusher(client);
        console.log("Pusher: ", pusher);
        channel = pusher.subscribe("mobile-queue-" + $scope.queuer.spaceId);
        console.log("Channel: ", channel);
        return channel.bind('notification', function(data) {
          $scope.queuer.dueTime = data.due.valueOf();
          $scope.queuer.ticketNumber = data.ticket_number;
          return $scope.queuer.position = data.position;
        });
      });
    }
  ]);

}).call(this);
