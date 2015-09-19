
/***
* @ndgoc directive
* @name BB.Directives:bbSurveyQuestions
*
* @restrict AE
* @scope true
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:bbSurveyQuestions
*
* # Has the following set of methods:
*
 */

(function() {
  angular.module('BB.Directives').directive('bbSurveyQuestions', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'SurveyQuestions'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:SurveyQuestions
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller SurveyQuestions
  *
  * # Has the following set of methods:
  *
  * - $scope.init(comp)
  * - $scope.checkIfLoggedIn()
  * - $scope.loadSurvey(purchase)
  * - $scope.submitSurveyLogin(form)
  * - $scope.loadSurveyFromPurchaseID(id)
  * - $scope.loadSurveyFromBookingRef(id)
  * - $scope.submitSurvey(form)
  * - $scope.submitBookingRef(form)
  * - $scope.storeBookingCookie()
  * - showLoginError()
  * - getMember()
  * - setPurchaseCompany(company)
  * - getBookingRef()
  * - getPurchaseID()
  * - getBookingAndSurvey()
  *
  * @requires $scope
  * @requires $rootScope
  * @requires BB.Services:CompanyService
  * @requires BB.Services:PurchaseService
  * @requires BB.Services:ClientService
  * @requires $modal
  * @requires $location
  * @requires $timeout
  * @requires BB.Models:BBWidget
  * @requires BB.Models:BBModel
  * @requires $q
  * @requires BB.Services:QueryStringService
  * @requires BB.Services:SSOService
  * @requires BB.Services:AlertService
  * @requires BB.Services:LoginService
  * @requires $window
  * @requires $upload
  * @requires BB.Services:ServiceService
  * @requires BB.Services:ValidatorService
  * @requires BB.Services:PurchaseBookingService
  * @requires $sessionStorage
  *
   */

  angular.module('BB.Controllers').controller('SurveyQuestions', function($scope, $rootScope, CompanyService, PurchaseService, ClientService, $modal, $location, $timeout, BBWidget, BBModel, $q, QueryStringService, SSOService, AlertService, LoginService, $window, $upload, ServiceService, ValidatorService, PurchaseBookingService, $sessionStorage) {
    var getBookingAndSurvey, getBookingRef, getMember, getPurchaseID, init, setPurchaseCompany, showLoginError;
    $scope.controller = "SurveyQuestions";
    $scope.completed = false;
    $scope.login = {
      email: "",
      password: ""
    };
    $scope.login_error = false;
    $scope.booking_ref = "";
    $scope.notLoaded($scope);
    $rootScope.connection_started.then(function() {
      return init();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    init = (function(_this) {
      return function() {
        if ($scope.company) {
          if ($scope.company.settings.requires_login) {
            $scope.checkIfLoggedIn();
            if ($rootScope.member) {
              return getBookingAndSurvey();
            } else {

            }
          } else {
            return getBookingAndSurvey();
          }
        }
      };
    })(this);
    $scope.checkIfLoggedIn = (function(_this) {
      return function() {
        return LoginService.checkLogin();
      };
    })(this);
    $scope.loadSurvey = (function(_this) {
      return function(purchase) {
        if (!$scope.company) {
          $scope.purchase.$get('company').then(function(company) {
            return setPurchaseCompany(company);
          });
        }
        if ($scope.purchase.$has('client')) {
          $scope.purchase.$get('client').then(function(client) {
            return $scope.setClient(new BBModel.Client(client));
          });
        }
        return $scope.purchase.getBookingsPromise().then(function(bookings) {
          var address, booking, i, len, params, pretty_address, ref, results;
          params = {};
          $scope.bookings = bookings;
          ref = $scope.bookings;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            booking = ref[i];
            if (booking.datetime) {
              booking.pretty_date = moment(booking.datetime).format("dddd, MMMM Do YYYY");
            }
            if (booking.address) {
              address = new BBModel.Address(booking.address);
              pretty_address = address.addressSingleLine();
              booking.pretty_address = pretty_address;
            }
            if ($rootScope.user) {
              params.admin_only = true;
            }
            results.push(booking.$get("survey_questions", params).then(function(details) {
              var item_details;
              item_details = new BBModel.ItemDetails(details);
              booking.survey_questions = item_details.survey_questions;
              return booking.getSurveyAnswersPromise().then(function(answers) {
                var answer, j, k, len1, len2, question, ref1, ref2;
                booking.survey_answers = answers;
                ref1 = booking.survey_questions;
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  question = ref1[j];
                  if (booking.survey_answers) {
                    ref2 = booking.survey_answers;
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                      answer = ref2[k];
                      if (answer.question_text === question.name && answer.value) {
                        question.answer = answer.value;
                      }
                    }
                  }
                }
                return $scope.setLoaded($scope);
              });
            }));
          }
          return results;
        }, function(err) {
          $scope.setLoaded($scope);
          return failMsg();
        });
      };
    })(this);
    $scope.submitSurveyLogin = (function(_this) {
      return function(form) {
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        return LoginService.companyLogin($scope.company, {}, {
          email: $scope.login.email,
          password: $scope.login.password,
          id: $scope.company.id
        }).then(function(member) {
          LoginService.setLogin(member);
          return getBookingAndSurvey();
        }, function(err) {
          showLoginError();
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.loadSurveyFromPurchaseID = (function(_this) {
      return function(id) {
        var auth_token, params;
        params = {
          purchase_id: id,
          url_root: $scope.bb.api_url
        };
        auth_token = $sessionStorage.getItem('auth_token');
        if (auth_token) {
          params.auth_token = auth_token;
        }
        return PurchaseService.query(params).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.total = $scope.purchase;
          return $scope.loadSurvey($scope.purchase);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.loadSurveyFromBookingRef = (function(_this) {
      return function(id) {
        var auth_token, params;
        params = {
          booking_ref: id,
          url_root: $scope.bb.api_url,
          raw: true
        };
        auth_token = $sessionStorage.getItem('auth_token');
        if (auth_token) {
          params.auth_token = auth_token;
        }
        return PurchaseService.bookingRefQuery(params).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.total = $scope.purchase;
          return $scope.loadSurvey($scope.purchase);
        }, function(err) {
          showLoginError();
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.submitSurvey = (function(_this) {
      return function(form) {
        var booking, i, len, params, ref, results;
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        ref = $scope.bookings;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          booking = ref[i];
          booking.checkReady();
          if (booking.ready) {
            $scope.notLoaded($scope);
            booking.client_id = $scope.client.id;
            params = booking;
            results.push(PurchaseBookingService.addSurveyAnswersToBooking(params).then(function(booking) {
              $scope.setLoaded($scope);
              return $scope.completed = true;
            }, function(err) {
              return $scope.setLoaded($scope);
            }));
          } else {
            results.push($scope.decideNextPage(route));
          }
        }
        return results;
      };
    })(this);
    $scope.submitBookingRef = (function(_this) {
      return function(form) {
        var auth_token, params;
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        $scope.notLoaded($scope);
        params = {
          booking_ref: $scope.booking_ref,
          url_root: $scope.bb.api_url,
          raw: true
        };
        auth_token = $sessionStorage.getItem('auth_token');
        if (auth_token) {
          params.auth_token = auth_token;
        }
        return PurchaseService.bookingRefQuery(params).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.total = $scope.purchase;
          return $scope.loadSurvey($scope.purchase);
        }, function(err) {
          showLoginError();
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.storeBookingCookie = function() {
      return document.cookie = "bookingrefsc=" + $scope.booking_ref;
    };
    showLoginError = (function(_this) {
      return function() {
        return $scope.login_error = true;
      };
    })(this);
    getMember = (function(_this) {
      return function() {
        var params;
        params = {
          member_id: $scope.member_id,
          company_id: $scope.company_id
        };
        return LoginService.memberQuery(params).then(function(member) {
          return $scope.member = member;
        });
      };
    })(this);
    setPurchaseCompany = function(company) {
      $scope.bb.company_id = company.id;
      $scope.bb.company = new BBModel.Company(company);
      $scope.company = $scope.bb.company;
      $scope.bb.item_defaults.company = $scope.bb.company;
      if (company.settings) {
        if (company.settings.merge_resources) {
          $scope.bb.item_defaults.merge_resources = true;
        }
        if (company.settings.merge_people) {
          return $scope.bb.item_defaults.merge_people = true;
        }
      }
    };
    getBookingRef = function() {
      var booking_ref, matches;
      matches = /^.*(?:\?|&)booking_ref=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        booking_ref = matches[1];
      }
      return booking_ref;
    };
    getPurchaseID = function() {
      var matches, purchase_id;
      matches = /^.*(?:\?|&)id=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        purchase_id = matches[1];
      }
      return purchase_id;
    };
    return getBookingAndSurvey = function() {
      var id;
      id = getBookingRef();
      if (id) {
        return $scope.loadSurveyFromBookingRef(id);
      } else {
        id = getPurchaseID();
        if (id) {
          return $scope.loadSurveyFromPurchaseID(id);
        } else {
          if ($scope.bb.total) {
            return $scope.loadSurveyFromPurchaseID($scope.bb.total.long_id);
          } else {

          }
        }
      }
    };
  });

}).call(this);
