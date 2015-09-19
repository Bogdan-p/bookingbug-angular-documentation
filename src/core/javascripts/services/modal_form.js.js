
/***
* @ngdoc service
* @name BB.Services:ModalForm
*
* @description
* Factory ModalForm
*
* @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs more}
*
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log more}
*
* @param {model} Dialog Info
* <br>
* {@link BB.Services:Dialog more}
*
* @returns {Promise} This service has the following set of methods:
*
* - $scope.submit(form)
* - $scope.cancel
* - editForm($scope, $modalInstance, model, title, success, fail)
* - $scope.submit(form)
* - $scope.cancel(event)
* - $scope.cancelBooking(event)
* - new(config)
* - edit(config)
*
 */

(function() {
  angular.module('BB.Services').factory('ModalForm', function($modal, $log, Dialog) {
    var editForm, newForm;
    newForm = function($scope, $modalInstance, company, title, new_rel, post_rel, success, fail) {
      $scope.loading = true;
      $scope.title = title;
      $scope.company = company;
      if ($scope.company.$has(new_rel)) {
        $scope.company.$get(new_rel).then(function(schema) {
          $scope.form = _.reject(schema.form, function(x) {
            return x.type === 'submit';
          });
          $scope.schema = schema.schema;
          $scope.form_model = {};
          return $scope.loading = false;
        });
      } else {
        $log.warn("company does not have '" + new_rel + "' rel");
      }
      $scope.submit = function(form) {
        $scope.$broadcast('schemaFormValidate');
        $scope.loading = true;
        return $scope.company.$post(post_rel, {}, $scope.form_model).then(function(model) {
          $scope.loading = false;
          $modalInstance.close(model);
          if (success) {
            return success(model);
          }
        }, function(err) {
          $scope.loading = false;
          $modalInstance.close(err);
          $log.error('Failed to create');
          if (fail) {
            return fail(err);
          }
        });
      };
      return $scope.cancel = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $modalInstance.dismiss('cancel');
      };
    };
    editForm = function($scope, $modalInstance, model, title, success, fail) {
      $scope.loading = true;
      $scope.title = title;
      $scope.model = model;
      if ($scope.model.$has('edit')) {
        $scope.model.$get('edit').then(function(schema) {
          $scope.form = _.reject(schema.form, function(x) {
            return x.type === 'submit';
          });
          $scope.schema = schema.schema;
          $scope.form_model = $scope.model;
          return $scope.loading = false;
        });
      } else {
        $log.warn("model does not have 'edit' rel");
      }
      $scope.submit = function(form) {
        $scope.$broadcast('schemaFormValidate');
        $scope.loading = true;
        if ($scope.model.$update) {
          return $scope.model.$update($scope.form_model).then(function() {
            $scope.loading = false;
            $modalInstance.close($scope.model);
            if (success) {
              return success($scope.model);
            }
          }, function(err) {
            $scope.loading = false;
            $modalInstance.close(err);
            $log.error('Failed to create');
            if (fail) {
              return fail();
            }
          });
        } else {
          return $scope.model.$put('self', {}, $scope.form_model).then(function(model) {
            $scope.loading = false;
            $modalInstance.close(model);
            if (success) {
              return success(model);
            }
          }, function(err) {
            $scope.loading = false;
            $modalInstance.close(err);
            $log.error('Failed to create');
            if (fail) {
              return fail();
            }
          });
        }
      };
      $scope.cancel = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $modalInstance.dismiss('cancel');
      };
      return $scope.cancelBooking = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $modalInstance.close();
        return Dialog.confirm({
          model: model,
          body: "Are you sure you want to cancel this booking?",
          success: function(model) {
            return model.$del('self').then(function(response) {
              if (success) {
                return success(response);
              }
            });
          }
        });
      };
    };
    return {
      "new": function(config) {
        var templateUrl;
        if (config.templateUrl) {
          templateUrl = config.templateUrl;
        }
        templateUrl || (templateUrl = 'modal_form.html');
        return $modal.open({
          templateUrl: templateUrl,
          controller: newForm,
          size: config.size,
          resolve: {
            company: function() {
              return config.company;
            },
            title: function() {
              return config.title;
            },
            new_rel: function() {
              return config.new_rel;
            },
            post_rel: function() {
              return config.post_rel;
            },
            success: function() {
              return config.success;
            },
            fail: function() {
              return config.fail;
            }
          }
        });
      },
      edit: function(config) {
        var templateUrl;
        if (config.templateUrl) {
          templateUrl = config.templateUrl;
        }
        templateUrl || (templateUrl = 'modal_form.html');
        return $modal.open({
          templateUrl: templateUrl,
          controller: editForm,
          size: config.size,
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
            }
          }
        });
      }
    };
  });

}).call(this);
