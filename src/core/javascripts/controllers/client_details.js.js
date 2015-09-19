(function() {
  angular.module('BB.Directives').directive('bbClientDetails', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ClientDetails'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:ClientDetails
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller ClientDetails
  *
  * # Has the following set of methods:
  *
  * - $scope.validateClient(client_form, route)
  * - $scope.clientLogin()
  * - $scope.setReady()
  * - $scope.clientSearch()
  * - $scope.switchNumber(to)
  * - $scope.getQuestion(id)
  * - $scope.useClient(client)
  * - $scope.recalc_question()
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} ClientDetailsService Info
  * <br>
  * {@link BB.Services:ClientDetailsService more}
  *
  * @param {service} ClientService Info
  * <br>
  * {@link BB.Services:ClientService more}
  *
  * @param {service} LoginService Info
  * <br>
  * {@link BB.Services:LoginService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
  * @param {service} QuestionService Info
  * <br>
  * {@link BB.Services:QuestionService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
   */

  angular.module('BB.Controllers').controller('ClientDetails', function($scope, $rootScope, ClientDetailsService, ClientService, LoginService, BBModel, ValidatorService, QuestionService, AlertService) {
    $scope.controller = "public.controllers.ClientDetails";
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    $scope.existing_member = false;
    $scope.login_error = false;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if (!$scope.client.valid() && LoginService.isLoggedIn()) {
          $scope.setClient(new BBModel.Client(LoginService.member()._data));
        }
        if (LoginService.isLoggedIn() && LoginService.member().$has("child_clients") && LoginService.member()) {
          LoginService.member().getChildClientsPromise().then(function(children) {
            $scope.bb.parent_client = new BBModel.Client(LoginService.member()._data);
            $scope.bb.child_clients = children;
            return $scope.bb.basket.parent_client_id = $scope.bb.parent_client.id;
          });
        }
        if ($scope.client.client_details) {
          $scope.client_details = $scope.client.client_details;
          if ($scope.client_details.questions) {
            QuestionService.checkConditionalQuestions($scope.client_details.questions);
          }
          return $scope.setLoaded($scope);
        } else {
          return ClientDetailsService.query($scope.bb.company).then(function(details) {
            $scope.client_details = details;
            if ($scope.client) {
              $scope.client.pre_fill_answers($scope.client_details);
            }
            if ($scope.client_details.questions) {
              QuestionService.checkConditionalQuestions($scope.client_details.questions);
            }
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $rootScope.$watch('member', (function(_this) {
      return function(oldmem, newmem) {
        if (!$scope.client.valid() && LoginService.isLoggedIn()) {
          return $scope.setClient(new BBModel.Client(LoginService.member()._data));
        }
      };
    })(this));
    $scope.validateClient = (function(_this) {
      return function(client_form, route) {
        $scope.notLoaded($scope);
        $scope.existing_member = false;
        if ($scope.bb && $scope.bb.parent_client) {
          $scope.client.parent_client_id = $scope.bb.parent_client.id;
        }
        $scope.client.setClientDetails($scope.client_details);
        return ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          $scope.setClient(client);
          if ($scope.bb.isAdmin) {
            $scope.client.setValid(true);
          }
          $scope.existing_member = false;
          return $scope.decideNextPage(route);
        }, function(err) {
          if (err.data.error === "Please login") {
            $scope.existing_member = true;
            AlertService.danger({
              msg: "You have already registered with this email address. Please login or reset your password using the Forgot Password link below."
            });
          }
          return $scope.setLoaded($scope);
        });
      };
    })(this);
    $scope.clientLogin = (function(_this) {
      return function() {
        $scope.login_error = false;
        if ($scope.login) {
          return LoginService.companyLogin($scope.bb.company, {}, {
            email: $scope.login.email,
            password: $scope.login.password
          }).then(function(client) {
            $scope.setClient(new BBModel.Client(client));
            $scope.login_error = false;
            return $scope.decideNextPage();
          }, function(err) {
            $scope.login_error = true;
            $scope.setLoaded($scope);
            return AlertService.danger({
              msg: "Sorry, your email or password was not recognised. Please try again."
            });
          });
        }
      };
    })(this);
    $scope.setReady = (function(_this) {
      return function() {
        $scope.client.setClientDetails($scope.client_details);
        ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          $scope.setClient(client);
          if (client.waitingQuestions) {
            return client.gotQuestions.then(function() {
              return $scope.client_details = client.client_details;
            });
          }
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
        return true;
      };
    })(this);
    $scope.clientSearch = function() {
      if (($scope.client != null) && ($scope.client.email != null) && $scope.client.email !== "") {
        $scope.notLoaded($scope);
        return ClientService.query_by_email($scope.bb.company, $scope.client.email).then(function(client) {
          if (client != null) {
            $scope.setClient(client);
            $scope.client = client;
          }
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoaded($scope);
        });
      } else {
        $scope.setClient({});
        return $scope.client = {};
      }
    };
    $scope.switchNumber = function(to) {
      $scope.no_mobile = !$scope.no_mobile;
      if (to === 'mobile') {
        $scope.bb.basket.setSettings({
          send_sms_reminder: true
        });
        return $scope.client.phone = null;
      } else {
        $scope.bb.basket.setSettings({
          send_sms_reminder: false
        });
        return $scope.client.mobile = null;
      }
    };
    $scope.getQuestion = function(id) {
      var i, len, question, ref;
      ref = $scope.client_details.questions;
      for (i = 0, len = ref.length; i < len; i++) {
        question = ref[i];
        if (question.id === id) {
          return question;
        }
      }
      return null;
    };
    $scope.useClient = function(client) {
      return $scope.setClient(client);
    };
    return $scope.recalc_question = function() {
      if ($scope.client_details.questions) {
        return QuestionService.checkConditionalQuestions($scope.client_details.questions);
      }
    };
  });

}).call(this);
