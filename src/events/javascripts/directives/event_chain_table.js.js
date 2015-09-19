
/***
* @ngdoc directive
* @name BBAdminEvents.Directives:eventChainTable
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directives BBAdminEvents.Directives:eventChainTable
*
* # Has the following set of methods:
*
* - controller($scope)
* - $scope.getEventChains()
* - $scope.newEventChain()
* - $scope.delete(id)
* - editSuccess(updated)
* - $scope.edit(id)
* - link(scope, element, attrs)
* 
* @requires BBAdmin.Services:AdminCompanyService
* @requires BBAdminEvents.Services:AdminEventChainService
* @requires $modal
* @requires $log
* @requires BB.Services:ModalForm
* @requires $timeout
*
 */

(function() {
  angular.module('BBAdminEvents').directive('eventChainTable', function(AdminCompanyService, AdminEventChainService, $modal, $log, ModalForm, $timeout) {
    var controller, link;
    controller = function($scope) {
      var editSuccess;
      $scope.fields = ['id', 'name', 'description'];
      $scope.getEventChains = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminEventChainService.query(params).then(function(event_chains) {
          return $scope.event_chains = event_chains;
        });
      };
      $scope.newEventChain = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Event Chain',
          new_rel: 'new_event_chain',
          post_rel: 'event_chains',
          success: function(event_chain) {
            return $scope.event_chains.push(event_chain);
          }
        });
      };
      $scope["delete"] = function(id) {
        var event_chain;
        event_chain = _.find($scope.event_chains, function(x) {
          return x.id === id;
        });
        return event_chain.$del('self').then(function() {
          return $scope.event_chains = _.reject($scope.event_chains, function(x) {
            return x.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete event_chain");
        });
      };
      editSuccess = function(updated) {
        updated.$flush('events');
        return $scope.event_chains = _.map($scope.event_chains, function(event_chain) {
          if (event_chain.id === updated.id) {
            return updated;
          } else {
            return event_chain;
          }
        });
      };
      return $scope.edit = function(id) {
        var event_chain;
        event_chain = _.find($scope.event_chains, function(x) {
          return x.id === id;
        });
        return event_chain.$get('events').then(function(collection) {
          return collection.$get('events').then(function(events) {
            event_chain.events = events;
            return ModalForm.edit({
              model: event_chain,
              title: 'Edit Event Chain',
              success: editSuccess
            });
          });
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getEventChains();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getEventChains();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'event_chain_table_main.html'
    };
  });

}).call(this);
