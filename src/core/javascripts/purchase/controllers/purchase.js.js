
/***
* @ndgoc directive
* @name BB.Directives:bbPurchase
*
* @restrict AE
* @scope true
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:bbPurchase
*
* # Has the following set of methods:
*
* - link (scope, element, attrs)
*
 */

(function() {
  var ModalDelete, ModalDeleteAll;

  angular.module('BB.Directives').directive('bbPurchase', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Purchase',
      link: function(scope, element, attrs) {
        scope.init(scope.$eval(attrs.bbPurchase));
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:Purchase
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller Purchase
  *
  * # Has the following set of methods:
  *
  * - setPurchaseCompany(company)
  * - failMsg()
  * - $scope.init(options)
  * - $scope.load(id)
  * - checkIfMoveBooking(bookings)
  * - checkIfWaitlistBookings(bookings)
  * - $scope.requireLogin(action)
  * - loginRequired()
  * - getCompanyID()
  * - getPurchaseID()
  * - $scope.move(booking, route, options = {})
  * - $scope.moveAll( route, options = {})
  * - $scope.bookWaitlistItem(booking)
  * - $scope.delete(booking)
  * - $scope.delete_all()
  * - $scope.isMovable(booking)
  * - $scope.onFileSelect(booking, $file, existing)
  * - $scope.createBasketItem(booking)
  * - $scope.checkAnswer(answer)
  * - ModalDelete($scope,  $rootScope, $modalInstance, booking)
  * - $scope.confirm_delete()
  * - $scope.cancel()
  * - ModalDeleteAll($scope,  $rootScope, $modalInstance, purchase)
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
  * @requires $sessionStorage
  *
   */

  angular.module('BB.Controllers').controller('Purchase', function($scope, $rootScope, CompanyService, PurchaseService, ClientService, $modal, $location, $timeout, BBWidget, BBModel, $q, QueryStringService, SSOService, AlertService, LoginService, $window, $upload, ServiceService, $sessionStorage) {
    var checkIfMoveBooking, checkIfWaitlistBookings, failMsg, getCompanyID, getPurchaseID, loginRequired, setPurchaseCompany;
    $scope.controller = "Purchase";
    $scope.is_waitlist = false;
    $scope.make_payment = false;
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
    failMsg = function() {
      if ($scope.fail_msg) {
        return AlertService.danger({
          msg: $scope.fail_msg
        });
      } else {
        return AlertService.danger({
          msg: "Sorry, something went wrong"
        });
      }
    };
    $scope.init = function(options) {
      if (!options) {
        options = {};
      }
      $scope.notLoaded($scope);
      if (options.move_route) {
        $scope.move_route = options.move_route;
      }
      if (options.move_all) {
        $scope.move_all = options.move_all;
      }
      if (options.login_redirect) {
        $scope.requireLogin({
          redirect: options.login_redirect
        });
      }
      if (options.fail_msg) {
        $scope.fail_msg = options.fail_msg;
      }
      if ($scope.bb.total) {
        return $scope.load($scope.bb.total.long_id);
      } else if ($scope.bb.purchase) {
        $scope.purchase = $scope.bb.purchase;
        $scope.bookings = $scope.bb.purchase.bookings;
        if ($scope.purchase.confirm_messages) {
          $scope.messages = $scope.purchase.confirm_messages;
        }
        return $scope.setLoaded($scope);
      } else {
        if (options.member_sso) {
          return SSOService.memberLogin(options).then(function(login) {
            return $scope.load();
          }, function(err) {
            $scope.setLoaded($scope);
            return failMsg();
          });
        } else {
          return $scope.load();
        }
      }
    };
    $scope.load = function(id) {
      $scope.notLoaded($scope);
      id = getPurchaseID();
      if (!($scope.loaded || !id)) {
        $rootScope.widget_started.then((function(_this) {
          return function() {
            return $scope.waiting_for_conn_started.then(function() {
              var auth_token, company_id, params;
              company_id = getCompanyID();
              if (company_id) {
                CompanyService.query(company_id, {}).then(function(company) {
                  return setPurchaseCompany(company);
                });
              }
              params = {
                purchase_id: id,
                url_root: $scope.bb.api_url
              };
              auth_token = $sessionStorage.getItem('auth_token');
              if (auth_token) {
                params.auth_token = auth_token;
              }
              return PurchaseService.query(params).then(function(purchase) {
                if ($scope.bb.company == null) {
                  purchase.$get('company').then((function(_this) {
                    return function(company) {
                      return setPurchaseCompany(company);
                    };
                  })(this));
                }
                $scope.purchase = purchase;
                $scope.bb.purchase = purchase;
                $scope.price = !($scope.purchase.price === 0);
                $scope.purchase.getBookingsPromise().then(function(bookings) {
                  var booking, i, len, ref, results;
                  $scope.bookings = bookings;
                  $scope.setLoaded($scope);
                  checkIfMoveBooking(bookings);
                  checkIfWaitlistBookings(bookings);
                  ref = $scope.bookings;
                  results = [];
                  for (i = 0, len = ref.length; i < len; i++) {
                    booking = ref[i];
                    results.push(booking.getAnswersPromise().then(function(answers) {
                      return booking.answers = answers;
                    }));
                  }
                  return results;
                }, function(err) {
                  $scope.setLoaded($scope);
                  return failMsg();
                });
                if (purchase.$has('client')) {
                  purchase.$get('client').then((function(_this) {
                    return function(client) {
                      return $scope.setClient(new BBModel.Client(client));
                    };
                  })(this));
                }
                return $scope.purchase.getConfirmMessages().then(function(messages) {
                  $scope.purchase.confirm_messages = messages;
                  return $scope.messages = messages;
                });
              }, function(err) {
                $scope.setLoaded($scope);
                if (err && err.status === 401 && $scope.login_action) {
                  if (LoginService.isLoggedIn()) {
                    return failMsg();
                  } else {
                    return loginRequired();
                  }
                } else {
                  return failMsg();
                }
              });
            }, function(err) {
              return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
            });
          };
        })(this), function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
      return $scope.loaded = true;
    };
    checkIfMoveBooking = function(bookings) {
      var b, id, matches, move_booking;
      matches = /^.*(?:\?|&)move_booking=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        id = parseInt(matches[1]);
      }
      if (id) {
        move_booking = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = bookings.length; i < len; i++) {
            b = bookings[i];
            if (b.id === id) {
              results.push(b);
            }
          }
          return results;
        })();
        if (move_booking.length > 0 && $scope.isMovable(bookings[0])) {
          return $scope.move(move_booking[0]);
        }
      }
    };
    checkIfWaitlistBookings = function(bookings) {
      var booking;
      return $scope.waitlist_bookings = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = bookings.length; i < len; i++) {
          booking = bookings[i];
          if (booking.on_waitlist && booking.settings.sent_waitlist === 1) {
            results.push(booking);
          }
        }
        return results;
      })();
    };
    $scope.requireLogin = (function(_this) {
      return function(action) {
        var div;
        if (_.isString(action.redirect)) {
          if (action.redirect.indexOf('?') === -1) {
            div = '?';
          } else {
            div = '&';
          }
          action.redirect += div + 'ref=' + encodeURIComponent(QueryStringService('ref'));
        }
        return $scope.login_action = action;
      };
    })(this);
    loginRequired = (function(_this) {
      return function() {
        if ($scope.login_action.redirect) {
          return window.location = $scope.login_action.redirect;
        }
      };
    })(this);
    getCompanyID = function() {
      var company_id, matches;
      matches = /^.*(?:\?|&)company_id=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        company_id = matches[1];
      }
      return company_id;
    };
    getPurchaseID = function() {
      var id, matches;
      matches = /^.*(?:\?|&)id=(.*?)(?:&|$)/.exec($location.absUrl());
      if (!matches) {
        matches = /^.*print_purchase\/(.*?)(?:\?|$)/.exec($location.absUrl());
      }
      if (!matches) {
        matches = /^.*print_purchase_jl\/(.*?)(?:\?|$)/.exec($location.absUrl());
      }
      if (matches) {
        id = matches[1];
      } else {
        if (QueryStringService('ref')) {
          id = QueryStringService('ref');
        }
      }
      if (QueryStringService('booking_id')) {
        id = QueryStringService('booking_id');
      }
      return id;
    };
    $scope.move = function(booking, route, options) {
      if (options == null) {
        options = {};
      }
      route || (route = $scope.move_route);
      if ($scope.move_all) {
        return $scope.moveAll(route, options);
      }
      $scope.notLoaded($scope);
      $scope.initWidget({
        company_id: booking.company_id,
        no_route: true
      });
      return $timeout((function(_this) {
        return function() {
          return $rootScope.connection_started.then(function() {
            var new_item, proms;
            proms = [];
            $scope.bb.moving_booking = booking;
            $scope.quickEmptybasket();
            new_item = new BBModel.BasketItem(booking, $scope.bb);
            new_item.setSrcBooking(booking, $scope.bb);
            new_item.ready = false;
            Array.prototype.push.apply(proms, new_item.promises);
            $scope.bb.basket.addItem(new_item);
            $scope.setBasketItem(new_item);
            return $q.all(proms).then(function() {
              $scope.setLoaded($scope);
              $rootScope.$broadcast("booking:move");
              return $scope.decideNextPage(route);
            }, function(err) {
              $scope.setLoaded($scope);
              return failMsg();
            });
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        };
      })(this));
    };
    $scope.moveAll = function(route, options) {
      if (options == null) {
        options = {};
      }
      route || (route = $scope.move_route);
      $scope.notLoaded($scope);
      $scope.initWidget({
        company_id: $scope.bookings[0].company_id,
        no_route: true
      });
      return $timeout((function(_this) {
        return function() {
          return $rootScope.connection_started.then(function() {
            var booking, i, len, new_item, proms, ref;
            proms = [];
            if ($scope.bookings.length === 1) {
              $scope.bb.moving_booking = $scope.bookings[0];
            } else {
              $scope.bb.moving_booking = $scope.purchase;
            }
            $scope.quickEmptybasket();
            ref = $scope.bookings;
            for (i = 0, len = ref.length; i < len; i++) {
              booking = ref[i];
              new_item = new BBModel.BasketItem(booking, $scope.bb);
              new_item.setSrcBooking(booking);
              new_item.ready = false;
              new_item.move_done = false;
              Array.prototype.push.apply(proms, new_item.promises);
              $scope.bb.basket.addItem(new_item);
            }
            $scope.bb.sortStackedItems();
            $scope.setBasketItem($scope.bb.basket.items[0]);
            return $q.all(proms).then(function() {
              $scope.setLoaded($scope);
              return $scope.decideNextPage(route);
            }, function(err) {
              $scope.setLoaded($scope);
              return failMsg();
            });
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        };
      })(this));
    };
    $scope.bookWaitlistItem = function(booking) {
      var params;
      $scope.notLoaded($scope);
      params = {
        purchase: $scope.purchase,
        booking: booking
      };
      return PurchaseService.bookWaitlistItem(params).then(function(purchase) {
        $scope.purchase = purchase;
        $scope.total = $scope.purchase;
        $scope.bb.purchase = purchase;
        return $scope.purchase.getBookingsPromise().then(function(bookings) {
          $scope.bookings = bookings;
          $scope.waitlist_bookings = (function() {
            var i, len, ref, results;
            ref = $scope.bookings;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              booking = ref[i];
              if (booking.on_waitlist && booking.settings.sent_waitlist === 1) {
                results.push(booking);
              }
            }
            return results;
          })();
          if ($scope.purchase.$has('new_payment') && $scope.purchase.due_now > 0) {
            $scope.make_payment = true;
          }
          return $scope.setLoaded($scope);
        }, function(err) {
          $scope.setLoaded($scope);
          return failMsg();
        });
      }, (function(_this) {
        return function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        };
      })(this));
    };
    $scope["delete"] = function(booking) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: $scope.getPartial("_cancel_modal"),
        controller: ModalDelete,
        resolve: {
          booking: function() {
            return booking;
          }
        }
      });
      return modalInstance.result.then(function(booking) {
        return booking.$del('self').then((function(_this) {
          return function(service) {
            $scope.bookings = _.without($scope.bookings, booking);
            return $rootScope.$broadcast("booking:cancelled");
          };
        })(this));
      });
    };
    $scope.delete_all = function() {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: $scope.getPartial("_cancel_modal"),
        controller: ModalDeleteAll,
        resolve: {
          purchase: function() {
            return $scope.purchase;
          }
        }
      });
      return modalInstance.result.then(function(purchase) {
        return PurchaseService.delete_all(purchase).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.bookings = [];
          return $rootScope.$broadcast("booking:cancelled");
        });
      });
    };
    $scope.isMovable = function(booking) {
      if (booking.min_cancellation_time) {
        return moment().isBefore(booking.min_cancellation_time);
      }
      return booking.datetime.isAfter(moment());
    };
    $scope.onFileSelect = function(booking, $file, existing) {
      var att_id, file, method;
      $scope.upload_progress = 0;
      file = $file;
      att_id = null;
      if (existing) {
        att_id = existing.id;
      }
      method = "POST";
      if (att_id) {
        method = "PUT";
      }
      return $scope.upload = $upload.upload({
        url: booking.$href('attachments'),
        method: method,
        data: {
          att_id: att_id
        },
        file: file
      }).progress(function(evt) {
        if ($scope.upload_progress < 100) {
          return $scope.upload_progress = parseInt(99.0 * evt.loaded / evt.total);
        }
      }).success(function(data, status, headers, config) {
        $scope.upload_progress = 100;
        if (data && data.attachments && booking) {
          return booking.attachments = data.attachments;
        }
      });
    };
    $scope.createBasketItem = function(booking) {
      var item;
      item = new BBModel.BasketItem(booking, $scope.bb);
      item.setSrcBooking(booking);
      return item;
    };
    return $scope.checkAnswer = function(answer) {
      return typeof answer.value === 'boolean' || typeof answer.value === 'string' || typeof answer.value === "number";
    };
  });

  ModalDelete = function($scope, $rootScope, $modalInstance, booking) {
    $scope.controller = "ModalDelete";
    $scope.booking = booking;
    $scope.confirm_delete = function() {
      return $modalInstance.close(booking);
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
  };

  ModalDeleteAll = function($scope, $rootScope, $modalInstance, purchase) {
    $scope.controller = "ModalDeleteAll";
    $scope.purchase = purchase;
    $scope.confirm_delete = function() {
      return $modalInstance.close(purchase);
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
  };

}).call(this);
