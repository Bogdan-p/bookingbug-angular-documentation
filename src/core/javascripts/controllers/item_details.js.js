(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbItemDetails
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbItemDetails
  *
  * See Controller {@link BB.Controllers:ItemDetails ItemDetails}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'ItemDetails'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbItemDetails', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ItemDetails',
      link: function(scope, element, attrs) {
        var item;
        if (attrs.bbItemDetails) {
          item = scope.$eval(attrs.bbItemDetails);
          scope.loadItem(item);
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:ItemDetails
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller ItemDetails
  *
  * # Has the following set of methods:
  *
  * - $scope.loadItem(item)
  * - setItemDetails(details)
  * - $scope.recalc_price
  * - $scope.confirm(form, route)
  * - $scope.setReady()
  * - $scope.confirm_move(route)
  * - $scope.openTermsAndConditions()
  * - $scope.getQuestion(id)
  * - $scope.updateItem()
  * - $scope.editItem()
  * - $scope.onFileSelect(item, $file, existing)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} ItemDetailsService Info
  * <br>
  * {@link BB.Services:ItemDetailsService more}
  *
  * @param {service} PurchaseBookingService Info
  * <br>
  * {@link BB.Services:PurchaseBookingService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
  * @param {service} QuestionService Info
  * <br>
  * {@link BB.Services:QuestionService more}
  *
  * @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
  * <br>
  * {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} $atuploadtrs Info
  *
   */

  angular.module('BB.Controllers').controller('ItemDetails', function($scope, $attrs, $rootScope, ItemDetailsService, PurchaseBookingService, AlertService, BBModel, FormDataStoreService, ValidatorService, QuestionService, $modal, $location, $upload) {
    var confirming, setItemDetails;
    $scope.controller = "public.controllers.ItemDetails";
    $scope.suppress_basket_update = $attrs.bbSuppressBasketUpdate != null;
    $scope.item_details_id = $scope.$eval($attrs.bbSuppressBasketUpdate);
    if ($scope.suppress_basket_update) {
      FormDataStoreService.init('ItemDetails' + $scope.item_details_id, $scope, ['item_details']);
    } else {
      FormDataStoreService.init('ItemDetails', $scope, ['item_details']);
    }
    QuestionService.addAnswersByName($scope.client, ['first_name', 'last_name', 'email', 'mobile']);
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    confirming = false;
    $rootScope.connection_started.then(function() {
      $scope.product = $scope.bb.current_item.product;
      if (!confirming) {
        return $scope.loadItem($scope.bb.current_item);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.loadItem = function(item) {
      var params;
      confirming = true;
      $scope.item = item;
      if ($scope.bb.private_note) {
        $scope.item.private_note = $scope.bb.private_note;
      }
      if ($scope.item.item_details) {
        setItemDetails($scope.item.item_details);
        QuestionService.addDynamicAnswersByName($scope.item_details.questions);
        if ($scope.bb.item_defaults.answers) {
          QuestionService.addAnswersFromDefaults($scope.item_details.questions, $scope.bb.item_defaults.answers);
        }
        $scope.recalc_price();
        return $scope.setLoaded($scope);
      } else {
        params = {
          company: $scope.bb.company,
          cItem: $scope.item
        };
        return ItemDetailsService.query(params).then(function(details) {
          setItemDetails(details);
          $scope.item.item_details = $scope.item_details;
          QuestionService.addDynamicAnswersByName($scope.item_details.questions);
          if ($scope.bb.item_defaults.answers) {
            QuestionService.addAnswersFromDefaults($scope.item_details.questions, $scope.bb.item_defaults.answers);
          }
          $scope.recalc_price();
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    setItemDetails = function(details) {
      var oldQuestions;
      if ($scope.item && $scope.item.defaults) {
        _.each(details.questions, function(item) {
          var n;
          n = "q_" + item.name;
          if ($scope.item.defaults[n]) {
            return item.answer = $scope.item.defaults[n];
          }
        });
      }
      if ($scope.hasOwnProperty('item_details')) {
        oldQuestions = $scope.item_details.questions;
        _.each(details.questions, function(item) {
          var search;
          search = _.findWhere(oldQuestions, {
            name: item.name
          });
          if (search) {
            return item.answer = search.answer;
          }
        });
      }
      return $scope.item_details = details;
    };
    $scope.recalc_price = function() {
      var bprice, qprice;
      qprice = $scope.item_details.questionPrice($scope.item.getQty());
      bprice = $scope.item.base_price;
      return $scope.item.setPrice(qprice + bprice);
    };
    $scope.confirm = function(form, route) {
      if (!ValidatorService.validateForm(form)) {
        return;
      }
      if ($scope.bb.moving_booking) {
        return $scope.confirm_move(form, route);
      }
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return $scope.addItemToBasket().then(function() {
          $scope.setLoaded($scope);
          return $scope.decideNextPage(route);
        }, function(err) {
          return $scope.setLoaded($scope);
        });
      } else {
        return $scope.decideNextPage(route);
      }
    };
    $scope.setReady = (function(_this) {
      return function() {
        $scope.item.setAskedQuestions();
        if ($scope.item.ready && !$scope.suppress_basket_update) {
          return $scope.addItemToBasket();
        } else {
          return true;
        }
      };
    })(this);
    $scope.confirm_move = function(route) {
      confirming = true;
      $scope.item || ($scope.item = $scope.bb.current_item);
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return PurchaseBookingService.update($scope.item).then(function(booking) {
          var _i, b, i, len, oldb, ref;
          b = new BBModel.Purchase.Booking(booking);
          if ($scope.bb.purchase) {
            ref = $scope.bb.purchase.bookings;
            for (_i = i = 0, len = ref.length; i < len; _i = ++i) {
              oldb = ref[_i];
              if (oldb.id === b.id) {
                $scope.bb.purchase.bookings[_i] = b;
              }
            }
          }
          $scope.setLoaded($scope);
          $scope.item.move_done = true;
          $rootScope.$broadcast("booking:moved");
          $scope.decideNextPage(route);
          return AlertService.add("info", {
            msg: "Your booking has been moved to " + (b.datetime.format('dddd Do MMMM [at] h.mma'))
          });
        }, (function(_this) {
          return function(err) {
            $scope.setLoaded($scope);
            return AlertService.add("danger", {
              msg: "Failed to move booking. Please try again."
            });
          };
        })(this));
      } else {
        return $scope.decideNextPage(route);
      }
    };
    $scope.openTermsAndConditions = function() {
      var modalInstance;
      return modalInstance = $modal.open({
        templateUrl: $scope.getPartial("terms_and_conditions"),
        scope: $scope
      });
    };
    $scope.getQuestion = function(id) {
      var i, len, question, ref;
      ref = $scope.item_details.questions;
      for (i = 0, len = ref.length; i < len; i++) {
        question = ref[i];
        if (question.id === id) {
          return question;
        }
      }
      return null;
    };
    $scope.updateItem = function() {
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return PurchaseBookingService.update($scope.item).then(function(booking) {
          var _i, b, i, len, oldb, ref;
          b = new BBModel.Purchase.Booking(booking);
          if ($scope.bookings) {
            ref = $scope.bookings;
            for (_i = i = 0, len = ref.length; i < len; _i = ++i) {
              oldb = ref[_i];
              if (oldb.id === b.id) {
                $scope.bookings[_i] = b;
              }
            }
          }
          $scope.purchase.bookings = $scope.bookings;
          $scope.item_details_updated = true;
          return $scope.setLoaded($scope);
        }, (function(_this) {
          return function(err) {
            return $scope.setLoaded($scope);
          };
        })(this));
      }
    };
    $scope.editItem = function() {
      return $scope.item_details_updated = false;
    };
    return $scope.onFileSelect = function(item, $file, existing) {
      var att_id, file, method, url;
      $scope.upload_progress = 0;
      file = $file;
      att_id = null;
      if (existing) {
        att_id = existing;
      }
      method = "POST";
      if (att_id) {
        method = "PUT";
      }
      url = item.$href('add_attachment');
      return $scope.upload = $upload.upload({
        url: url,
        method: method,
        data: {
          attachment_id: att_id
        },
        file: file
      }).progress(function(evt) {
        if ($scope.upload_progress < 100) {
          return $scope.upload_progress = parseInt(99.0 * evt.loaded / evt.total);
        }
      }).success(function(data, status, headers, config) {
        $scope.upload_progress = 100;
        if (data && item) {
          item.attachment = data;
          return item.attachment_id = data.id;
        }
      });
    };
  });

}).call(this);
