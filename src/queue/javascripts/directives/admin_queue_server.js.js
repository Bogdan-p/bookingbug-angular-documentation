
/***
* @ndgoc directive
* @name BBQueue.Directives:bbQueueServer
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBQueue.Directives:bbQueueServer
*
* # Has the following set of methods:
*
* - pusherListen(scope)
* - controller($scope)
* - link(scope, element, attrs)
*
* @requires BBQueue.Services:PusherQueue
* @requires BBAdmin.Services:AdminCompanyService
* @requires BB.Services:ModalForm
* @requires BB.Models:BBModel
*
 */

(function() {
  angular.module('BBQueue').directive('bbQueueServer', function(BBModel, AdminCompanyService, PusherQueue, ModalForm) {
    var controller, link, pusherListen;
    pusherListen = function(scope) {
      PusherQueue.subscribe(scope.company);
      return PusherQueue.channel.bind('notification', (function(_this) {
        return function(data) {
          return scope.getQueuers(scope.server);
        };
      })(this));
    };
    controller = function($scope) {
      $scope.getQueuers = function() {
        return $scope.server.getQueuers();
      };
      $scope.getQueuers = _.throttle($scope.getQueuers, 10000);
      return $scope.newQueuerModal = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Queuer',
          new_rel: 'new_queuer',
          post_rel: 'queuers',
          success: function(queuer) {
            return $scope.server.queuers.push(queuer);
          }
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        pusherListen(scope);
        return scope.server.getQueuers();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          if (scope.user.$has('person')) {
            return scope.user.$get('person').then(function(person) {
              scope.server = new BBModel.Admin.Person(person);
              scope.server.getQueuers();
              return pusherListen(scope);
            });
          }
        });
      }
    };
    return {
      link: link,
      controller: controller
    };
  });


  /***
  * @ndgoc directive
  * @name BBQueue.Directives:bbQueueServerCustomer
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BBQueue.Directives:bbQueueServerCustomer
  *
  * # Has the following set of methods:
  *
  * - controller($scope)
  * - $scope.serveCustomer()
  * - $scope.serveNext()
  * - $scope.extendAppointment(mins)
  * - $scope.finishServing()
  *
   */

  angular.module('BBQueue').directive('bbQueueServerCustomer', function() {
    var controller;
    controller = function($scope) {
      $scope.selected_queuers = [];
      $scope.serveCustomer = function() {
        if ($scope.selected_queuers.length > 0) {
          $scope.loading = true;
          return $scope.server.startServing($scope.selected_queuers).then(function() {
            $scope.loading = false;
            return $scope.getQueuers();
          });
        }
      };
      $scope.serveNext = function() {
        $scope.loading = true;
        return $scope.server.startServing().then(function() {
          $scope.loading = false;
          return $scope.getQueuers();
        });
      };
      $scope.extendAppointment = function(mins) {
        $scope.loading = true;
        return $scope.server.serving.extendAppointment(mins).then(function() {
          $scope.loading = false;
          return $scope.getQueuers();
        });
      };
      $scope.finishServing = function() {
        $scope.loading = true;
        return $scope.server.finishServing().then(function() {
          $scope.loading = false;
          return $scope.getQueuers();
        });
      };
      $scope.loading = true;
      if ($scope.server) {
        return $scope.server.setCurrentCustomer().then(function() {
          return $scope.loading = false;
        });
      }
    };
    return {
      controller: controller,
      templateUrl: 'queue_server_customer.html'
    };
  });

}).call(this);
