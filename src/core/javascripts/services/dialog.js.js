
/***
* @ngdoc service
* @name BB.Services:Dialog
*
* @description
* Factory Dialog
*
* @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs more}
*
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log more}
*
 */

(function() {
  angular.module('BB.Services').factory('Dialog', function($modal, $log) {
    var controller;
    controller = function($scope, $modalInstance, model, title, success, fail, body) {
      $scope.body = body;
      $scope.ok = function() {
        return $modalInstance.close(model);
      };
      $scope.cancel = function() {
        event.preventDefault();
        event.stopPropagation();
        return $modalInstance.dismiss('cancel');
      };
      return $modalInstance.result.then(function() {
        if (success) {
          return success(model);
        }
      }, function() {
        if (fail) {
          return fail();
        }
      });
    };
    return {
      confirm: function(config) {
        var templateUrl;
        if (config.templateUrl) {
          templateUrl = config.templateUrl;
        }
        templateUrl || (templateUrl = 'dialog.html');
        return $modal.open({
          templateUrl: templateUrl,
          controller: controller,
          size: config.size || 'sm',
          resolve: {
            model: function() {
              return config.model;
            },
            title: function() {
              return config.title;
            },
            success: function() {
              return config.success;
            },
            fail: function() {
              return config.fail;
            },
            body: function() {
              return config.body;
            }
          }
        });
      }
    };
  });

}).call(this);
