(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbWidget
  *
  * @restrict A
  * @scope
  *   <pre>
  *   scope:
  *   client: '=?'
  *   apiUrl: '@?'
  *   useParent:'='
  *   transclude: true
  *   controller: 'BBCtrl'
  * </pre>
  *
  * @description
  *{@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbWidget
  *
  * # Has the following set of methods:
  *
  * - getTemplate(template)
  * - updatePartials (scope, element, prms)
  * - setupPusher(scope, element, prms)
  * - appendCustomPartials(scope, element, prms)
  * - renderTemplate(scope, element, design_mode, template)
  * - link(scope, element, attrs)
  *
  * @requires BB.Services:PathSvc
  * @requires $http
  * @requires $log
  * @requires $templateCache
  * @requires $compile
  * @requires $q
  * @requires AppConfig
  * @requires $timeout
  * @requires $bbug
  *
   */
  angular.module('BB.Directives').directive('bbWidget', function(PathSvc, $http, $log, $templateCache, $compile, $q, AppConfig, $timeout, $bbug) {
    var appendCustomPartials, getTemplate, renderTemplate, setupPusher, updatePartials;
    getTemplate = function(template) {
      var fromTemplateCache, partial, src;
      partial = template ? template : 'main';
      fromTemplateCache = $templateCache.get(partial);
      if (fromTemplateCache) {
        return fromTemplateCache;
      } else {
        src = PathSvc.directivePartial(partial).$$unwrapTrustedValue();
        return $http.get(src, {
          cache: $templateCache
        }).then(function(response) {
          return response.data;
        });
      }
    };
    updatePartials = function(scope, element, prms) {
      var i, j, len, ref;
      ref = element.children();
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        if ($bbug(i).hasClass('custom_partial')) {
          $bbug(i).remove();
        }
      }
      return appendCustomPartials(scope, element, prms).then(function() {
        return scope.$broadcast('refreshPage');
      });
    };
    setupPusher = function(scope, element, prms) {
      return $timeout(function() {
        scope.pusher = new Pusher('c8d8cea659cc46060608');
        scope.pusher_channel = scope.pusher.subscribe("widget_" + prms.design_id);
        return scope.pusher_channel.bind('update', function(data) {
          return updatePartials(scope, element, prms);
        });
      });
    };
    appendCustomPartials = function(scope, element, prms) {
      var defer;
      defer = $q.defer();
      $http.get(prms.custom_partial_url).then(function(custom_templates) {
        return $compile(custom_templates.data)(scope, function(custom, scope) {
          var non_style, style, tag;
          custom.addClass('custom_partial');
          style = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = custom.length; j < len; j++) {
              tag = custom[j];
              if (tag.tagName === "STYLE") {
                results.push(tag);
              }
            }
            return results;
          })();
          non_style = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = custom.length; j < len; j++) {
              tag = custom[j];
              if (tag.tagName !== "STYLE") {
                results.push(tag);
              }
            }
            return results;
          })();
          $bbug("#widget_" + prms.design_id).html(non_style);
          element.append(style);
          scope.bb.path_setup = true;
          return defer.resolve(style);
        });
      });
      return defer.promise;
    };
    renderTemplate = function(scope, element, design_mode, template) {
      return $q.when(getTemplate(template)).then(function(template) {
        element.html(template).show();
        if (design_mode) {
          element.append('<style widget_css scoped></style>');
        }
        return $compile(element.contents())(scope);
      });
    };
    return {
      restrict: 'A',
      scope: {
        client: '=?',
        apiUrl: '@?',
        useParent: '='
      },
      transclude: true,
      controller: 'BBCtrl',
      link: function(scope, element, attrs) {
        var evaluator, init_params, prms;
        if (attrs.member != null) {
          scope.client = attrs.member;
        }
        evaluator = scope;
        if (scope.useParent && (scope.$parent != null)) {
          evaluator = scope.$parent;
        }
        init_params = evaluator.$eval(attrs.bbWidget);
        scope.initWidget(init_params);
        prms = scope.bb;
        if (prms.custom_partial_url) {
          prms.design_id = prms.custom_partial_url.match(/^.*\/(.*?)$/)[1];
          $bbug("[ng-app='BB']").append("<div id='widget_" + prms.design_id + "'></div>");
        }
        if (scope.bb.partial_url) {
          if (init_params.partial_url) {
            AppConfig['partial_url'] = init_params.partial_url;
          } else {
            AppConfig['partial_url'] = scope.bb.partial_url;
          }
        }
        if (!scope.has_content) {
          if (prms.custom_partial_url) {
            appendCustomPartials(scope, element, prms).then(function(style) {
              return $q.when(getTemplate()).then(function(template) {
                element.html(template).show();
                $compile(element.contents())(scope);
                element.append(style);
                if (prms.update_design) {
                  return setupPusher(scope, element, prms);
                }
              });
            });
          } else if (prms.template) {
            renderTemplate(scope, element, prms.design_mode, prms.template);
          } else {
            renderTemplate(scope, element, prms.design_mode);
          }
          return scope.$on('refreshPage', function() {
            return renderTemplate(scope, element, prms.design_mode);
          });
        } else if (prms.custom_partial_url) {
          appendCustomPartials(scope, element, prms);
          if (prms.update_design) {
            setupPusher(scope, element, prms);
          }
          return scope.$on('refreshPage', function() {
            return scope.showPage(scope.bb.current_page);
          });
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:bbContentController
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller bbContentController
  *
  * # Has the following set of methods:
  *
  * - $scope.initPage()
  *
  * @requires $scope
  *
   */

  angular.module('BB.Controllers').controller('bbContentController', function($scope) {
    $scope.controller = "public.controllers.bbContentController";
    return $scope.initPage = (function(_this) {
      return function() {
        $scope.setPageLoaded();
        return $scope.setLoadingPage(false);
      };
    })(this);
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:BBCtrl
  *
  * @description
  *{@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller BBCtrl
  *
  * # Has the following set of methods:
  * - $compile("<span bb-display-mode></span>") $scope, (cloned, scope)
  * - $scope.set_company(prms)
  * - $scope.initWidget(prms = {})
  * - $scope.initWidget2()
  * - setupDefaults(company_id)
  * - $scope.setLoadingPage(val)
  * - $scope.isLoadingPage()
  * - $scope.$on '$locationChangeStart', (event)
  * - $scope.showPage(route, dont_record_page)
  * - $scope.jumpToPage(route)
  * - $scope.clearPage()
  * - $scope.getPartial(file)
  * - $scope.setPageLoaded()
  * - $scope.setPageRoute(route)
  * - $scope.decideNextPage(route)
  * - $scope.showCheckout()
  * - $scope.addItemToBasket()
  * - $scope.updateBasket()
  * - $scope.emptyBasket()
  * - $scope.deleteBasketItem(item)
  * - $scope.deleteBasketItems(items)
  * - $scope.clearBasketItem()
  * - $scope.setBasketItem(item)
  * - $scope.setReadyToCheckout(ready)
  * - $scope.moveToBasket()
  * - $scope.quickEmptybasket(options)
  * - $scope.setBasket(basket)
  * - $scope.logout(route)
  * - $scope.setAffiliate(affiliate)
  * - restoreBasket()
  * - $scope.setCompany(company, keep_basket)
  * - $scope.recordStep(step, title)
  * - $scope.setStepTitle(title)
  * - $scope.getCurrentStepTitle)
  * - $scope.checkStepTitle(title)
  * - $scope.loadStep(step)
  * - $scope.loadPreviousStep()
  * - $scope.loadStepByPageName(page_name)
  * - $scope.restart()
  * - $scope.setRoute(rdata)
  * - $scope.setBasicRoute(routes)
  * - $scope.skipThisStep()
  * - $scope.setUsingBasket(usingBasket)
  * - $scope.setClient(client)
  * - $scope.clearClient()
  * - $scope.parseDate(d)
  * - $scope.getUrlParam(param)
  * - $scope.base64encode(param)
  * - $scope.setLastSelectedDate(date)
  * - $scope.setLoaded(cscope)
  * - $scope.setLoadedAndShowError(scope, err, error_string)
  * - $scope.areScopesLoaded(cscope)
  * - $scope.notLoaded(cscope)
  * - $scope.broadcastItemUpdate()
  * - $scope.hidePage()
  * - $scope.bb.company_set()
  * - $scope.isAdmin()
  * - $scope.isAdminIFrame()
  * - $scope.reloadDashboard
  * - $scope.$debounce(tim)
  * - $scope.supportsTouch()
  * - $rootScope.$on 'show:loader', ()
  * - $rootScope.$on 'hide:loader', ()
  *
  * <pre>
  * //Dont change the cid as we use it in the app to identify this as the widget
  * $scope.cid = "BBCtrl"
  * </pre>
  *
  * @requires $scope
  * @requires $location
  * @requires $rootScope
  * @requires $sessionStorage
  * @requires $window
  * @requires $http
  * @requires $localCache
  * @requires $q
  * @requires $timeout
  * @requires $sce
  * @requires $compile
  * @requires $sniffer
  * @requires $modal
  * @requires $log
  * @requires $bbug
  * @requires angular-hal:halClient
  * @requires BB.Services:BasketService
  * @requires BB.Services:LoginService
  * @requires BB.Services:AlertService
  * @requires BB.Models:BBModel
  * @requires BB.Services:BBWidget
  * @requires BB.Services:SSOService
  * @requires BB.Services:ErrorService
  * @requires AppConfig
  * @requires BB.Services:QueryStringService
  * @requires BB.Services:QuestionServic
  * @requires BB.Services:LocaleService
  * @requires BB.Services:PurchaseService
  * @requires BB.Services:SettingsService
  * @requires UriTemplate
   */

  angular.module('BB.Controllers').controller('BBCtrl', function($scope, $location, $rootScope, halClient, $window, $http, $localCache, $q, $timeout, BasketService, LoginService, AlertService, $sce, $element, $compile, $sniffer, $modal, $log, BBModel, BBWidget, SSOService, ErrorService, AppConfig, QueryStringService, QuestionService, LocaleService, PurchaseService, $sessionStorage, $bbug, SettingsService, UriTemplate) {
    var base, base1, con_started, first_call, restoreBasket, setupDefaults, widget_started;
    $scope.cid = "BBCtrl";
    $scope.controller = "public.controllers.BBCtrl";
    $scope.bb = new BBWidget();
    AppConfig.uid = $scope.bb.uid;
    $scope.qs = QueryStringService;
    $scope.has_content = $element[0].children.length !== 0;
    if ($scope.apiUrl) {
      $scope.bb || ($scope.bb = {});
      $scope.bb.api_url = $scope.apiUrl;
    }
    if ($rootScope.bb && $rootScope.bb.api_url) {
      $scope.bb.api_url = $rootScope.bb.api_url;
      if (!$rootScope.bb.partial_url) {
        $scope.bb.partial_url = "";
      } else {
        $scope.bb.partial_url = $rootScope.bb.partial_url;
      }
    }
    if ($location.port() !== 80 && $location.port() !== 443) {
      (base = $scope.bb).api_url || (base.api_url = $location.protocol() + "://" + $location.host() + ":" + $location.port());
    } else {
      (base1 = $scope.bb).api_url || (base1.api_url = $location.protocol() + "://" + $location.host());
    }
    $scope.bb.stacked_items = [];
    first_call = true;
    con_started = $q.defer();
    $rootScope.connection_started = con_started.promise;
    widget_started = $q.defer();
    $rootScope.widget_started = widget_started.promise;
    moment.locale([LocaleService, "en"]);
    $rootScope.Route = {
      Company: 0,
      Category: 1,
      Service: 2,
      Person: 3,
      Resource: 4,
      Duration: 5,
      Date: 6,
      Time: 7,
      Client: 8,
      Summary: 9,
      Basket: 10,
      Checkout: 11,
      Slot: 12,
      Event: 13
    };
    $scope.Route = $rootScope.Route;
    $compile("<span bb-display-mode></span>")($scope, (function(_this) {
      return function(cloned, scope) {
        return $bbug($element).append(cloned);
      };
    })(this));

    /***
    * @ngdoc method
    * @name $scope.set_company
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * Legacy (already!) delete by Feb 2014!
    *
     */
    $scope.set_company = (function(_this) {
      return function(prms) {
        return $scope.initWidget(prms);
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.initWidget
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * $scope.initWidget
    *
    * @param {object} prms prms = {}
     */
    $scope.initWidget = (function(_this) {
      return function(prms) {
        var url;
        if (prms == null) {
          prms = {};
        }
        _this.$init_prms = prms;
        con_started = $q.defer();
        $rootScope.connection_started = con_started.promise;
        if ((!$sniffer.msie || $sniffer.msie > 9) || !first_call) {
          $scope.initWidget2();
        } else {
          if ($scope.bb.api_url) {
            url = document.createElement('a');
            url.href = $scope.bb.api_url;
            if (url.host === $location.host() || url.host === (($location.host()) + ":" + ($location.port()))) {
              $scope.initWidget2();
              return;
            }
          }
          if ($rootScope.iframe_proxy_ready) {
            $scope.initWidget2();
          } else {
            $scope.$on('iframe_proxy_ready', function(event, args) {
              if (args.iframe_proxy_ready) {
                return $scope.initWidget2();
              }
            });
          }
        }
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.initWidget2
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * $scope.initWidget2
    *
    * We're going to load a bunch of default stuff which we will vary by the widget
    * there can be two promise stages - a first pass - then a second set or promises which might be created as a results of the first lot being laoded
    * i.e. the active of reolving one promise, may need a second to be reoslved before the widget is created
    * <pre>
    * setup_promises2 = []
    * setup_promises= []
    *</pre>
     */
    $scope.initWidget2 = (function(_this) {
      return function() {
        var aff_promise, comp_category_id, comp_promise, comp_url, company_id, embed_params, get_total, k, params, prms, ref, result, setup_promises, setup_promises2, sso_admin_login, sso_member_login, total_id, v;
        $scope.init_widget_started = true;
        prms = _this.$init_prms;
        if (prms.query) {
          ref = prms.query;
          for (k in ref) {
            v = ref[k];
            prms[k] = QueryStringService(v);
          }
        }
        if (prms.custom_partial_url) {
          $scope.bb.custom_partial_url = prms.custom_partial_url;
          $scope.bb.partial_id = prms.custom_partial_url.substring(prms.custom_partial_url.lastIndexOf("/") + 1);
          if (prms.update_design) {
            $scope.bb.update_design = prms.update_design;
          }
        } else if (prms.design_mode) {
          $scope.bb.design_mode = prms.design_mode;
        }
        company_id = $scope.bb.company_id;
        if (prms.company_id) {
          company_id = prms.company_id;
        }
        if (prms.affiliate_id) {
          $scope.bb.affiliate_id = prms.affiliate_id;
          $rootScope.affiliate_id = prms.affiliate_id;
        }
        if (prms.api_url) {
          $scope.bb.api_url = prms.api_url;
        }
        if (prms.partial_url) {
          $scope.bb.partial_url = prms.partial_url;
        }
        if (prms.page_suffix) {
          $scope.bb.page_suffix = prms.page_suffix;
        }
        if (prms.admin) {
          $scope.bb.isAdmin = prms.admin;
        }
        if (prms.auth_token) {
          $sessionStorage.setItem("auth_token", prms.auth_token);
        }
        $scope.bb.app_id = 1;
        $scope.bb.app_key = 1;
        $scope.bb.clear_basket = true;
        if (prms.basket) {
          $scope.bb.clear_basket = false;
        }
        if (prms.clear_basket === false) {
          $scope.bb.clear_basket = false;
        }
        if ($window.bb_setup || prms.client) {
          prms.clear_member || (prms.clear_member = true);
        }
        if (prms.client) {
          $scope.bb.client_defaults = prms.client;
        }
        if ($scope.bb.client_defaults && $scope.bb.client_defaults.name) {
          result = $scope.bb.client_defaults.name.match(/^(\S+)\s(.*)/).slice(1);
          $scope.bb.client_defaults.first_name = result[0];
          $scope.bb.client_defaults.last_name = result[1];
        }
        if (prms.clear_member) {
          $scope.bb.clear_member = prms.clear_member;
          $sessionStorage.removeItem("login");
        }
        if (prms.app_id) {
          $scope.bb.app_id = prms.app_id;
        }
        if (prms.app_key) {
          $scope.bb.app_key = prms.app_key;
        }
        if (prms.item_defaults) {
          $scope.bb.original_item_defaults = prms.item_defaults;
          $scope.bb.item_defaults = angular.copy($scope.bb.original_item_defaults);
        } else if ($scope.bb.original_item_defaults) {
          $scope.bb.item_defaults = angular.copy($scope.bb.original_item_defaults);
        }
        if (prms.route_format) {
          $scope.bb.setRouteFormat(prms.route_format);
          if ($scope.bb_route_init) {
            $scope.bb_route_init();
          }
        }
        if (prms.locale) {
          moment.locale(prms.locale);
        }
        if (prms.hide === true) {
          $scope.hide_page = true;
        } else {
          $scope.hide_page = false;
        }
        if (!prms.custom_partial_url) {
          $scope.bb.path_setup = true;
        }
        if (prms.reserve_without_questions) {
          $scope.bb.reserve_without_questions = prms.reserve_without_questions;
        }
        if (prms.extra_setup) {
          $scope.bb.extra_setup = prms.extra_setup;
          if (prms.extra_setup.step) {
            $scope.bb.starting_step_number = parseInt(prms.extra_setup.step);
          }
          if (prms.extra_setup.return_url) {
            $scope.bb.return_url = prms.extra_setup.return_url;
          }
        }
        if (prms.template) {
          $scope.bb.template = prms.template;
        }
        if (prms.i18n) {
          SettingsService.enableInternationalizaton();
        }
        if (prms.private_note) {
          $scope.bb.private_note = prms.private_note;
        }
        if (prms.qudini_booking_id) {
          $scope.bb.qudini_booking_id = prms.qudini_booking_id;
        }
        if (prms.scroll_offset) {
          SettingsService.setScrollOffset(prms.scroll_offset);
        }
        _this.waiting_for_conn_started_def = $q.defer();
        $scope.waiting_for_conn_started = _this.waiting_for_conn_started_def.promise;
        if (company_id || $scope.bb.affiliate_id) {
          $scope.waiting_for_conn_started = $rootScope.connection_started;
        } else {
          _this.waiting_for_conn_started_def.resolve();
        }
        widget_started.resolve();
        setup_promises2 = [];
        setup_promises = [];
        if ($scope.bb.affiliate_id) {
          aff_promise = halClient.$get($scope.bb.api_url + '/api/v1/affiliates/' + $scope.bb.affiliate_id);
          setup_promises.push(aff_promise);
          aff_promise.then(function(affiliate) {
            var comp_p, comp_promise;
            if ($scope.bb.$wait_for_routing) {
              setup_promises2.push($scope.bb.$wait_for_routing.promise);
            }
            $scope.setAffiliate(new BBModel.Affiliate(affiliate));
            $scope.bb.item_defaults.affiliate = $scope.affiliate;
            if (prms.company_ref) {
              comp_p = $q.defer();
              comp_promise = $scope.affiliate.getCompanyByRef(prms.company_ref);
              setup_promises2.push(comp_p.promise);
              return comp_promise.then(function(company) {
                return $scope.setCompany(company, prms.keep_basket).then(function(val) {
                  return comp_p.resolve(val);
                }, function(err) {
                  return comp_p.reject(err);
                });
              }, function(err) {
                return comp_p.reject(err);
              });
            }
          });
        }
        if (company_id) {
          if (prms.embed) {
            embed_params = prms.embed;
          }
          embed_params || (embed_params = null);
          comp_category_id = null;
          if ($scope.bb.item_defaults.category != null) {
            if ($scope.bb.item_defaults.category.id != null) {
              comp_category_id = $scope.bb.item_defaults.category.id;
            } else {
              comp_category_id = $scope.bb.item_defaults.category;
            }
          }
          comp_url = new UriTemplate($scope.bb.api_url + '/api/v1/company/{company_id}{?embed,category_id}').fillFromObject({
            company_id: company_id,
            category_id: comp_category_id,
            embed: embed_params
          });
          comp_promise = halClient.$get(comp_url);
          setup_promises.push(comp_promise);
          comp_promise.then(function(company) {
            var child, comp, cprom, parent_company;
            if ($scope.bb.$wait_for_routing) {
              setup_promises2.push($scope.bb.$wait_for_routing.promise);
            }
            comp = new BBModel.Company(company);
            cprom = $q.defer();
            setup_promises2.push(cprom.promise);
            child = null;
            if (comp.companies && $scope.bb.item_defaults.company) {
              child = comp.findChildCompany($scope.bb.item_defaults.company);
            }
            if (child) {
              parent_company = comp;
              return halClient.$get($scope.bb.api_url + '/api/v1/company/' + child.id).then(function(company) {
                comp = new BBModel.Company(company);
                setupDefaults(comp.id);
                $scope.bb.parent_company = parent_company;
                return $scope.setCompany(comp, prms.keep_basket).then(function() {
                  return cprom.resolve();
                }, function(err) {
                  return cprom.reject();
                });
              }, function(err) {
                return cprom.reject();
              });
            } else {
              setupDefaults(comp.id);
              return $scope.setCompany(comp, prms.keep_basket).then(function() {
                return cprom.resolve();
              }, function(err) {
                return cprom.reject();
              });
            }
          });
          if (prms.member_sso) {
            params = {
              company_id: company_id,
              root: $scope.bb.api_url,
              member_sso: prms.member_sso
            };
            sso_member_login = SSOService.memberLogin(params).then(function(client) {
              return $scope.setClient(client);
            });
            setup_promises.push(sso_member_login);
          }
          if (prms.admin_sso) {
            params = {
              company_id: prms.parent_company_id ? prms.parent_company_id : company_id,
              root: $scope.bb.api_url,
              admin_sso: prms.admin_sso
            };
            sso_admin_login = SSOService.adminLogin(params).then(function(admin) {
              return $scope.bb.admin = admin;
            });
            setup_promises.push(sso_admin_login);
          }
          total_id = QueryStringService('total_id');
          if (total_id) {
            params = {
              purchase_id: total_id,
              url_root: $scope.bb.api_url
            };
            get_total = PurchaseService.query(params).then(function(total) {
              $scope.bb.total = total;
              if (total.paid > 0) {
                return $scope.bb.payment_status = 'complete';
              }
            });
            setup_promises.push(get_total);
          }
        }
        $scope.isLoaded = false;
        return $q.all(setup_promises).then(function() {
          return $q.all(setup_promises2).then(function() {
            var base2, clear_prom, def_clear;
            if (!$scope.bb.basket) {
              (base2 = $scope.bb).basket || (base2.basket = new BBModel.Basket(null, $scope.bb));
            }
            if (!$scope.client) {
              $scope.clearClient();
            }
            def_clear = $q.defer();
            clear_prom = def_clear.promise;
            if (!$scope.bb.current_item) {
              clear_prom = $scope.clearBasketItem();
            } else {
              def_clear.resolve();
            }
            return clear_prom.then(function() {
              var page;
              if (!$scope.client_details) {
                $scope.client_details = new BBModel.ClientDetails();
              }
              if (!$scope.bb.stacked_items) {
                $scope.bb.stacked_items = [];
              }
              if ($scope.bb.company || $scope.bb.affiliate) {
                con_started.resolve();
                $scope.done_starting = true;
                if (!prms.no_route) {
                  page = null;
                  if (first_call && $bbug.isEmptyObject($scope.bb.routeSteps)) {
                    page = $scope.bb.firstStep;
                  }
                  if (prms.first_page) {
                    page = prms.first_page;
                  }
                  first_call = false;
                  return $scope.decideNextPage(page);
                }
              }
            });
          }, function(err) {
            con_started.reject("Failed to start widget");
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          con_started.reject("Failed to start widget");
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);

    /***
    * @ngdoc method
    * @name setupDefaults
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * setupDefaults
    *
    * @param {object} company_id Info
     */
    setupDefaults = (function(_this) {
      return function(company_id) {
        var category, def, event, event_group, k, person, ref, resource, service, v;
        def = $q.defer();
        if (first_call || ($scope.bb.orginal_company_id && $scope.bb.orginal_company_id !== company_id)) {
          $scope.bb.orginal_company_id = company_id;
          $scope.bb.default_setup_promises = [];
          if ($scope.bb.item_defaults.query) {
            ref = $scope.bb.item_defaults.query;
            for (k in ref) {
              v = ref[k];
              $scope.bb.item_defaults[k] = QueryStringService(v);
            }
          }
          if ($scope.bb.item_defaults.resource) {
            resource = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/resources/' + $scope.bb.item_defaults.resource);
            $scope.bb.default_setup_promises.push(resource);
            resource.then(function(res) {
              return $scope.bb.item_defaults.resource = new BBModel.Resource(res);
            });
          }
          if ($scope.bb.item_defaults.person) {
            person = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/people/' + $scope.bb.item_defaults.person);
            $scope.bb.default_setup_promises.push(person);
            person.then(function(res) {
              return $scope.bb.item_defaults.person = new BBModel.Person(res);
            });
          }
          if ($scope.bb.item_defaults.person_ref) {
            person = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/people/find_by_ref/' + $scope.bb.item_defaults.person_ref);
            $scope.bb.default_setup_promises.push(person);
            person.then(function(res) {
              return $scope.bb.item_defaults.person = new BBModel.Person(res);
            });
          }
          if ($scope.bb.item_defaults.service) {
            service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services/' + $scope.bb.item_defaults.service);
            $scope.bb.default_setup_promises.push(service);
            service.then(function(res) {
              return $scope.bb.item_defaults.service = new BBModel.Service(res);
            });
          }
          if ($scope.bb.item_defaults.service_ref) {
            service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services?api_ref=' + $scope.bb.item_defaults.service_ref);
            $scope.bb.default_setup_promises.push(service);
            service.then(function(res) {
              return $scope.bb.item_defaults.service = new BBModel.Service(res);
            });
          }
          if ($scope.bb.item_defaults.event_group) {
            event_group = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/event_groups/' + $scope.bb.item_defaults.event_group);
            $scope.bb.default_setup_promises.push(event_group);
            event_group.then(function(res) {
              return $scope.bb.item_defaults.event_group = new BBModel.EventGroup(res);
            });
          }
          if ($scope.bb.item_defaults.event) {
            event = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/events/' + $scope.bb.item_defaults.event);
            $scope.bb.default_setup_promises.push(event);
            event.then(function(res) {
              return $scope.bb.item_defaults.event = new BBModel.Event(res);
            });
          }
          if ($scope.bb.item_defaults.category) {
            category = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/categories/' + $scope.bb.item_defaults.category);
            $scope.bb.default_setup_promises.push(category);
            category.then(function(res) {
              return $scope.bb.item_defaults.category = new BBModel.Category(res);
            });
          }
          if ($scope.bb.item_defaults.duration) {
            $scope.bb.item_defaults.duration = parseInt($scope.bb.item_defaults.duration);
          }
          $q.all($scope.bb.default_setup_promises)['finally'](function() {
            return def.resolve();
          });
        } else {
          def.resolve();
        }
        return def.promise;
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.setLoadingPage
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * $scope.setLoadingPage
    *
    * Set if a page is loaded yet or now helps prevent double loading.
    *
    * @param {object} val Info
     */
    $scope.setLoadingPage = (function(_this) {
      return function(val) {
        return $scope.loading_page = val;
      };
    })(this);

    /***
    * @ngdoc method
    * @name $scope.isLoadingPage
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * $scope.isLoadingPage
    *
     */
    $scope.isLoadingPage = (function(_this) {
      return function() {
        return $scope.loading_page;
      };
    })(this);
    $scope.$on('$locationChangeStart', (function(_this) {
      return function(event) {
        var step;
        if (!$scope.bb.routeFormat) {
          return;
        }
        if (!$scope.bb.routing) {
          step = $scope.bb.matchURLToStep();
          if (step) {
            $scope.loadStep(step);
          }
        }
        return $scope.bb.routing = false;
      };
    })(this));

    /***
    * @ngdoc method
    * @name $scope.showPage
    * @methodOf BB.Controllers:BBCtrl
    *
    * @description
    * $scope.showPage
    *
    * @param {object} route Info
    * @param {object} dont_record_page Info
    *
     */
    $scope.showPage = (function(_this) {
      return function(route, dont_record_page) {
        $scope.bb.updateRoute(route);
        $scope.jumped = false;
        if ($scope.isLoadingPage()) {
          return;
        }
        if ($window._gaq) {
          $window._gaq.push(['_trackPageview', route]);
        }
        $scope.setLoadingPage(true);
        if ($scope.bb.current_page === route) {
          $scope.bb_main = "";
          setTimeout(function() {
            $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route));
            return $scope.$apply();
          }, 0);
        } else {
          AlertService.clear();
          $scope.bb.current_page = route;
          if (!dont_record_page) {
            $scope.bb.recordCurrentPage();
          }
          $scope.notLoaded($scope);
          $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route));
        }
        return $rootScope.$broadcast("page:loaded");
      };
    })(this);
    $scope.jumpToPage = (function(_this) {
      return function(route) {
        $scope.current_page = route;
        $scope.jumped = true;
        return $scope.bb_main = $sce.trustAsResourceUrl($scope.partial_url + route + $scope.page_suffix);
      };
    })(this);
    $scope.clearPage = function() {
      return $scope.bb_main = "";
    };
    $scope.getPartial = function(file) {
      return $scope.bb.pageURL(file);
    };
    $scope.setPageLoaded = function() {
      return $scope.setLoaded($scope);
    };
    $scope.setPageRoute = (function(_this) {
      return function(route) {
        $scope.bb.current_page_route = route;
        if ($scope.bb.routeSteps && $scope.bb.routeSteps[route]) {
          $scope.showPage($scope.bb.routeSteps[route]);
          return true;
        }
        return false;
      };
    })(this);
    $scope.decideNextPage = function(route) {
      if (route) {
        if (route === 'none') {
          return;
        } else {
          if ($scope.bb.total && $scope.bb.payment_status === 'complete') {
            $scope.showPage('payment_complete');
          } else {
            return $scope.showPage(route);
          }
        }
      }
      if ($scope.bb.nextSteps && $scope.bb.current_page && $scope.bb.nextSteps[$scope.bb.current_page] && !$scope.bb.routeSteps) {
        return $scope.showPage($scope.bb.nextSteps[$scope.bb.current_page]);
      }
      if (!$scope.client.valid() && LoginService.isLoggedIn()) {
        $scope.client = new BBModel.Client(LoginService.member()._data);
      }
      if (($scope.bb.company && $scope.bb.company.companies) || (!$scope.bb.company && $scope.affiliate)) {
        if ($scope.setPageRoute($rootScope.Route.Company)) {
          return;
        }
        return $scope.showPage('company_list');
      } else if ($scope.bb.total && $scope.bb.payment_status === "complete") {
        return $scope.showPage('payment_complete');
      } else if ($scope.bb.total && $scope.bb.payment_status === "pending") {
        return $scope.showPage('payment');
      } else if (($scope.bb.company.$has('event_groups') && !$scope.bb.current_item.event_group && !$scope.bb.current_item.service && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) || ($scope.bb.company.$has('events') && $scope.bb.current_item.event_group && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal)) {
        if ($scope.setPageRoute($rootScope.Route.Event)) {
          return;
        }
        return $scope.showPage('event_list');
      } else if ($scope.bb.company.$has('events') && $scope.bb.current_item.event && !$scope.bb.current_item.num_book && (!$scope.bb.current_item.tickets || !$scope.bb.current_item.tickets.qty) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) {
        return $scope.showPage('event');
      } else if ($scope.bb.company.$has('services') && !$scope.bb.current_item.service && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) {
        if ($scope.setPageRoute($rootScope.Route.Service)) {
          return;
        }
        return $scope.showPage('service_list');
      } else if ($scope.bb.company.$has('resources') && !$scope.bb.current_item.resource && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) {
        if ($scope.setPageRoute($rootScope.Route.Resource)) {
          return;
        }
        return $scope.showPage('resource_list');
      } else if ($scope.bb.company.$has('people') && !$scope.bb.current_item.person && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) {
        if ($scope.setPageRoute($rootScope.Route.Person)) {
          return;
        }
        return $scope.showPage('person_list');
      } else if (!$scope.bb.current_item.duration && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product && !$scope.bb.current_item.deal) {
        if ($scope.setPageRoute($rootScope.Route.Duration)) {
          return;
        }
        return $scope.showPage('duration_list');
      } else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.date && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.deal) {
        if ($scope.bb.company.$has('slots')) {
          if ($scope.setPageRoute($rootScope.Route.Slot)) {
            return;
          }
          return $scope.showPage('slot_list');
        } else {
          if ($scope.setPageRoute($rootScope.Route.Date)) {
            return;
          }
          return $scope.showPage('day');
        }
      } else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.time && ($scope.bb.current_item.event == null) && (!$scope.bb.current_item.service || $scope.bb.current_item.service.duration_unit !== 'day') && !$scope.bb.current_item.deal) {
        if ($scope.setPageRoute($rootScope.Route.Time)) {
          return;
        }
        return $scope.showPage('time');
      } else if ($scope.bb.moving_booking && (!$scope.bb.current_item.ready || !$scope.bb.current_item.move_done)) {
        return $scope.showPage('check_move');
      } else if (!$scope.client.valid()) {
        if ($scope.setPageRoute($rootScope.Route.Client)) {
          return;
        }
        if ($scope.bb.isAdmin) {
          return $scope.showPage('client_admin');
        } else {
          return $scope.showPage('client');
        }
      } else if ((!$scope.bb.basket.readyToCheckout() || !$scope.bb.current_item.ready) && ($scope.bb.current_item.item_details && $scope.bb.current_item.item_details.hasQuestions)) {
        if ($scope.setPageRoute($rootScope.Route.Summary)) {
          return;
        }
        if ($scope.bb.isAdmin) {
          return $scope.showPage('check_items_admin');
        } else {
          return $scope.showPage('check_items');
        }
      } else if ($scope.bb.usingBasket && (!$scope.bb.confirmCheckout || $scope.bb.company_settings.has_vouchers || $scope.bb.company.$has('coupon'))) {
        if ($scope.setPageRoute($rootScope.Route.Basket)) {
          return;
        }
        return $scope.showPage('basket');
      } else if ($scope.bb.moving_booking && $scope.bb.basket.readyToCheckout()) {
        return $scope.showPage('purchase');
      } else if ($scope.bb.basket.readyToCheckout() && $scope.bb.payment_status === null) {
        if ($scope.setPageRoute($rootScope.Route.Checkout)) {
          return;
        }
        return $scope.showPage('checkout');
      } else if ($scope.bb.payment_status === "complete") {
        return $scope.showPage('payment_complete');
      }
    };
    $scope.showCheckout = function() {
      return $scope.bb.current_item.ready;
    };
    $scope.addItemToBasket = function() {
      var add_defer;
      add_defer = $q.defer();
      if (!$scope.bb.current_item.submitted && !$scope.bb.moving_booking) {
        $scope.moveToBasket();
        $scope.bb.current_item.submitted = $scope.updateBasket();
        $scope.bb.current_item.submitted.then(function(basket) {
          return add_defer.resolve(basket);
        }, function(err) {
          if (err.status === 409) {
            $scope.bb.current_item.person = null;
            $scope.bb.current_item.resource = null;
            $scope.bb.current_item.setTime(null);
            if ($scope.bb.current_item.service) {
              $scope.bb.current_item.setService($scope.bb.current_item.service);
            }
          }
          $scope.bb.current_item.submitted = null;
          return add_defer.reject(err);
        });
      } else if ($scope.bb.current_item.submitted) {
        return $scope.bb.current_item.submitted;
      } else {
        add_defer.resolve();
      }
      return add_defer.promise;
    };
    $scope.updateBasket = function() {
      var add_defer, params;
      add_defer = $q.defer();
      params = {
        member_id: $scope.client.id,
        member: $scope.client,
        items: $scope.bb.basket.items,
        bb: $scope.bb
      };
      BasketService.updateBasket($scope.bb.company, params).then(function(basket) {
        var item, j, len, ref;
        ref = basket.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          item.storeDefaults($scope.bb.item_defaults);
          item.reserve_without_questions = $scope.bb.reserve_without_questions;
        }
        halClient.clearCache("time_data");
        halClient.clearCache("events");
        basket.setSettings($scope.bb.basket.settings);
        $scope.setBasket(basket);
        $scope.setBasketItem(basket.items[0]);
        if (!$scope.bb.current_item) {
          return $scope.clearBasketItem().then(function() {
            return add_defer.resolve(basket);
          });
        } else {
          return add_defer.resolve(basket);
        }
      }, function(err) {
        var error_modal;
        add_defer.reject(err);
        if (err.status === 409) {
          halClient.clearCache("time_data");
          halClient.clearCache("events");
          $scope.bb.current_item.person = null;
          $scope.bb.current_item.selected_person = null;
          error_modal = $modal.open({
            templateUrl: $scope.getPartial('_error_modal'),
            controller: function($scope, $modalInstance) {
              $scope.message = ErrorService.getError('ITEM_NO_LONGER_AVAILABLE').msg;
              return $scope.ok = function() {
                return $modalInstance.close();
              };
            }
          });
          return error_modal.result["finally"](function() {
            if ($scope.bb.nextSteps) {
              if ($scope.setPageRoute($rootScope.Route.Date)) {

              } else if ($scope.setPageRoute($rootScope.Route.Event)) {

              } else {
                return $scope.loadPreviousStep();
              }
            } else {
              return $scope.decideNextPage();
            }
          });
        }
      });
      return add_defer.promise;
    };
    $scope.emptyBasket = function() {
      if (!$scope.bb.basket.items || ($scope.bb.basket.items && $scope.bb.basket.items.length === 0)) {
        return;
      }
      return BasketService.empty($scope.bb).then(function(basket) {
        if ($scope.bb.current_item.id) {
          delete $scope.bb.current_item.id;
        }
        return $scope.setBasket(basket);
      });
    };
    $scope.deleteBasketItem = function(item) {
      return BasketService.deleteItem(item, $scope.bb.company, {
        bb: $scope.bb
      }).then(function(basket) {
        return $scope.setBasket(basket);
      });
    };
    $scope.deleteBasketItems = function(items) {
      var item, j, len, results;
      results = [];
      for (j = 0, len = items.length; j < len; j++) {
        item = items[j];
        results.push(BasketService.deleteItem(item, $scope.bb.company, {
          bb: $scope.bb
        }).then(function(basket) {
          return $scope.setBasket(basket);
        }));
      }
      return results;
    };
    $scope.clearBasketItem = function() {
      var def;
      def = $q.defer();
      $scope.setBasketItem(new BBModel.BasketItem(null, $scope.bb));
      $scope.bb.current_item.reserve_without_questions = $scope.bb.reserve_without_questions;
      if ($scope.bb.default_setup_promises) {
        $q.all($scope.bb.default_setup_promises)['finally'](function() {
          $scope.bb.current_item.setDefaults($scope.bb.item_defaults);
          return $q.all($scope.bb.current_item.promises)['finally'](function() {
            return def.resolve();
          });
        });
      } else {
        def.resolve();
      }
      return def.promise;
    };
    $scope.setBasketItem = function(item) {
      $scope.bb.current_item = item;
      return $scope.current_item = $scope.bb.current_item;
    };
    $scope.setReadyToCheckout = function(ready) {
      return $scope.bb.confirmCheckout = ready;
    };
    $scope.moveToBasket = function() {
      return $scope.bb.basket.addItem($scope.bb.current_item);
    };
    $scope.quickEmptybasket = function(options) {
      var def, preserve_stacked_items;
      preserve_stacked_items = options && options.preserve_stacked_items ? true : false;
      if (!preserve_stacked_items) {
        $scope.bb.stacked_items = [];
        $scope.setBasket(new BBModel.Basket(null, $scope.bb));
        return $scope.clearBasketItem();
      } else {
        $scope.bb.basket = new BBModel.Basket(null, $scope.bb);
        $scope.basket = $scope.bb.basket;
        $scope.bb.basket.company_id = $scope.bb.company_id;
        def = $q.defer();
        def.resolve();
        return def.promise;
      }
    };
    $scope.setBasket = function(basket) {
      $scope.bb.basket = basket;
      $scope.basket = basket;
      $scope.bb.basket.company_id = $scope.bb.company_id;
      if ($scope.bb.stacked_items) {
        return $scope.bb.setStackedItems(basket.items);
      }
    };
    $scope.logout = function(route) {
      if ($scope.client && $scope.client.valid()) {
        return LoginService.logout({
          root: $scope.bb.api_url
        }).then(function() {
          $scope.client = new BBModel.Client();
          return $scope.decideNextPage(route);
        });
      } else if ($scope.member) {
        return LoginService.logout({
          root: $scope.bb.api_url
        }).then(function() {
          $scope.member = new BBModel.Member.Member();
          return $scope.decideNextPage(route);
        });
      }
    };
    $scope.setAffiliate = function(affiliate) {
      $scope.bb.affiliate_id = affiliate.id;
      $scope.bb.affiliate = affiliate;
      $scope.affiliate = affiliate;
      return $scope.affiliate_id = affiliate.id;
    };
    restoreBasket = function() {
      var restore_basket_defer;
      restore_basket_defer = $q.defer();
      $scope.quickEmptybasket().then(function() {
        var auth_token, href, params, status, uri;
        auth_token = $sessionStorage.getItem('auth_token');
        href = $scope.bb.api_url + '/api/v1/status{?company_id,affiliate_id,clear_baskets,clear_member}';
        params = {
          company_id: $scope.bb.company_id,
          affiliate_id: $scope.bb.affiliate_id,
          clear_baskets: $scope.bb.clear_basket ? '1' : null,
          clear_member: $scope.bb.clear_member ? '1' : null
        };
        uri = new UriTemplate(href).fillFromObject(params);
        status = halClient.$get(uri, {
          "auth_token": auth_token,
          "no_cache": true
        });
        return status.then((function(_this) {
          return function(res) {
            if (res.$has('client')) {
              res.$get('client').then(function(client) {
                return $scope.client = new BBModel.Client(client);
              });
            }
            if (res.$has('member')) {
              res.$get('member').then(function(member) {
                return LoginService.setLogin(member);
              });
            }
            if ($scope.bb.clear_basket) {
              return restore_basket_defer.resolve();
            } else {
              if (res.$has('baskets')) {
                return res.$get('baskets').then(function(baskets) {
                  var basket;
                  basket = _.find(baskets, function(b) {
                    return b.company_id === $scope.bb.company_id;
                  });
                  if (basket) {
                    basket = new BBModel.Basket(basket, $scope.bb);
                    return basket.$get('items').then(function(items) {
                      var i, j, len, promises;
                      items = (function() {
                        var j, len, results;
                        results = [];
                        for (j = 0, len = items.length; j < len; j++) {
                          i = items[j];
                          results.push(new BBModel.BasketItem(i));
                        }
                        return results;
                      })();
                      for (j = 0, len = items.length; j < len; j++) {
                        i = items[j];
                        basket.addItem(i);
                      }
                      $scope.setBasket(basket);
                      promises = [].concat.apply([], (function() {
                        var l, len1, results;
                        results = [];
                        for (l = 0, len1 = items.length; l < len1; l++) {
                          i = items[l];
                          results.push(i.promises);
                        }
                        return results;
                      })());
                      return $q.all(promises).then(function() {
                        if (basket.items.length > 0) {
                          $scope.setBasketItem(basket.items[0]);
                        }
                        return restore_basket_defer.resolve();
                      });
                    });
                  } else {
                    return restore_basket_defer.resolve();
                  }
                });
              } else {
                return restore_basket_defer.resolve();
              }
            }
          };
        })(this), function(err) {
          return restore_basket_defer.resolve();
        });
      });
      return restore_basket_defer.promise;
    };
    $scope.setCompany = function(company, keep_basket) {
      var defer;
      defer = $q.defer();
      $scope.bb.company_id = company.id;
      $scope.bb.company = company;
      $scope.company = company;
      $scope.bb.item_defaults.company = $scope.bb.company;
      if (company.$has('settings')) {
        company.getSettings().then((function(_this) {
          return function(settings) {
            $scope.bb.company_settings = settings;
            if ($scope.bb.company_settings.merge_resources) {
              $scope.bb.item_defaults.merge_resources = true;
            }
            if ($scope.bb.company_settings.merge_people) {
              $scope.bb.item_defaults.merge_people = true;
            }
            $rootScope.bb_currency = $scope.bb.company_settings.currency;
            $scope.bb.currency = $scope.bb.company_settings.currency;
            $scope.bb.has_prices = $scope.bb.company_settings.has_prices;
            if (!$scope.bb.basket || ($scope.bb.basket.company_id !== $scope.bb.company_id && !keep_basket)) {
              return restoreBasket().then(function() {
                defer.resolve();
                return $scope.$emit('company:setup');
              });
            } else {
              defer.resolve();
              return $scope.$emit('company:setup');
            }
          };
        })(this));
      } else {
        if (!$scope.bb.basket || ($scope.bb.basket.company_id !== $scope.bb.company_id && !keep_basket)) {
          restoreBasket().then(function() {
            defer.resolve();
            return $scope.$emit('company:setup');
          });
        } else {
          defer.resolve();
          $scope.$emit('company:setup');
        }
      }
      return defer.promise;
    };
    $scope.recordStep = function(step, title) {
      return $scope.bb.recordStep(step, title);
    };
    $scope.setStepTitle = function(title) {
      return $scope.bb.steps[$scope.bb.current_step - 1].title = title;
    };
    $scope.getCurrentStepTitle = function() {
      var steps;
      steps = $scope.bb.steps;
      if (!_.compact(steps).length) {
        steps = $scope.bb.allSteps;
      }
      if ($scope.bb.current_step) {
        return steps[$scope.bb.current_step - 1].title;
      }
    };
    $scope.checkStepTitle = function(title) {
      if (!$scope.bb.steps[$scope.bb.current_step - 1].title) {
        return $scope.setStepTitle(title);
      }
    };
    $scope.loadStep = function(step) {
      var j, len, prev_step, ref, st;
      if (step === $scope.bb.current_step) {
        return;
      }
      $scope.bb.calculatePercentageComplete(step);
      st = $scope.bb.steps[step];
      prev_step = $scope.bb.steps[step - 1];
      if (st && !prev_step) {
        prev_step = st;
      }
      if (!st) {
        st = prev_step;
      }
      if (st && !$scope.bb.last_step_reached) {
        if (!st.stacked_length || st.stacked_length === 0) {
          $scope.bb.stacked_items = [];
        }
        $scope.bb.current_item.loadStep(st.current_item);
        $scope.bb.steps.splice(step, $scope.bb.steps.length - step);
        $scope.bb.current_step = step;
        $scope.showPage(prev_step.page, true);
      }
      if ($scope.bb.allSteps) {
        ref = $scope.bb.allSteps;
        for (j = 0, len = ref.length; j < len; j++) {
          step = ref[j];
          step.active = false;
          step.passed = step.number < $scope.bb.current_step;
        }
        if ($scope.bb.allSteps[$scope.bb.current_step - 1]) {
          return $scope.bb.allSteps[$scope.bb.current_step - 1].active = true;
        }
      }
    };
    $scope.loadPreviousStep = function() {
      var previousStep;
      previousStep = $scope.bb.current_step - 1;
      return $scope.loadStep(previousStep);
    };
    $scope.loadStepByPageName = function(page_name) {
      var j, len, ref, step;
      ref = $scope.bb.allSteps;
      for (j = 0, len = ref.length; j < len; j++) {
        step = ref[j];
        if (step.page === page_name) {
          return $scope.loadStep(step.number);
        }
      }
      return $scope.loadStep(1);
    };
    $scope.restart = function() {
      $rootScope.$broadcast('clear:formData');
      $rootScope.$broadcast('widget:restart');
      $scope.setLastSelectedDate(null);
      $scope.bb.last_step_reached = false;
      return $scope.loadStep(1);
    };
    $scope.setRoute = function(rdata) {
      return $scope.bb.setRoute(rdata);
    };
    $scope.setBasicRoute = function(routes) {
      return $scope.bb.setBasicRoute(routes);
    };
    $scope.skipThisStep = function() {
      return $scope.bb.current_step -= 1;
    };
    $scope.setUsingBasket = (function(_this) {
      return function(usingBasket) {
        return $scope.bb.usingBasket = usingBasket;
      };
    })(this);
    $scope.setClient = (function(_this) {
      return function(client) {
        $scope.client = client;
        if (client.postcode && !$scope.bb.postcode) {
          return $scope.bb.postcode = client.postcode;
        }
      };
    })(this);
    $scope.clearClient = (function(_this) {
      return function() {
        $scope.client = new BBModel.Client();
        if ($window.bb_setup) {
          $scope.client.setDefaults($window.bb_setup);
        }
        if ($scope.bb.client_defaults) {
          return $scope.client.setDefaults($scope.bb.client_defaults);
        }
      };
    })(this);
    $scope.today = moment().toDate();
    $scope.tomorrow = moment().add(1, 'days').toDate();
    $scope.parseDate = (function(_this) {
      return function(d) {
        return moment(d);
      };
    })(this);
    $scope.getUrlParam = (function(_this) {
      return function(param) {
        return $window.getURIparam(param);
      };
    })(this);
    $scope.base64encode = (function(_this) {
      return function(param) {
        return $window.btoa(param);
      };
    })(this);
    $scope.setLastSelectedDate = (function(_this) {
      return function(date) {
        return $scope.last_selected_date = date;
      };
    })(this);
    $scope.setLoaded = function(cscope) {
      var loadingFinished;
      cscope.$emit('hide:loader', cscope);
      cscope.isLoaded = true;
      loadingFinished = true;
      while (cscope) {
        if (cscope.hasOwnProperty('scopeLoaded')) {
          if ($scope.areScopesLoaded(cscope)) {
            cscope.scopeLoaded = true;
          } else {
            loadingFinished = false;
          }
        }
        cscope = cscope.$parent;
      }
      if (loadingFinished) {
        $rootScope.$broadcast('loading:finished');
      }
    };
    $scope.setLoadedAndShowError = function(scope, err, error_string) {
      $log.warn(err, error_string);
      scope.setLoaded(scope);
      if (err.status === 409) {
        return AlertService.danger(ErrorService.getError('ITEM_NO_LONGER_AVAILABLE'));
      } else if (err.data && err.data.error === "Number of Bookings exceeds the maximum") {
        return AlertService.danger(ErrorService.getError('MAXIMUM_TICKETS'));
      } else {
        return AlertService.danger(ErrorService.getError('GENERIC'));
      }
    };
    $scope.areScopesLoaded = function(cscope) {
      var child;
      if (cscope.hasOwnProperty('isLoaded') && !cscope.isLoaded) {
        return false;
      } else {
        child = cscope.$$childHead;
        while (child) {
          if (!$scope.areScopesLoaded(child)) {
            return false;
          }
          child = child.$$nextSibling;
        }
        return true;
      }
    };
    $scope.notLoaded = function(cscope) {
      $scope.$emit('show:loader', $scope);
      cscope.isLoaded = false;
      while (cscope) {
        if (cscope.hasOwnProperty('scopeLoaded')) {
          cscope.scopeLoaded = false;
        }
        cscope = cscope.$parent;
      }
    };
    $scope.broadcastItemUpdate = (function(_this) {
      return function() {
        return $scope.$broadcast("currentItemUpdate", $scope.bb.current_item);
      };
    })(this);
    $scope.hidePage = function() {
      return $scope.hide_page = true;
    };
    $scope.bb.company_set = function() {
      return $scope.bb.company_id != null;
    };
    $scope.isAdmin = function() {
      return $scope.bb.isAdmin;
    };
    $scope.isAdminIFrame = function() {
      var err, error, location;
      if (!$scope.bb.isAdmin) {
        return false;
      }
      try {
        location = $window.parent.location.href;
        if (location && $window.parent.reload_dashboard) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        err = error;
        return false;
      }
    };
    $scope.reloadDashboard = function() {
      return $window.parent.reload_dashboard();
    };
    $scope.$debounce = function(tim) {
      if ($scope._debouncing) {
        return false;
      }
      tim || (tim = 100);
      $scope._debouncing = true;
      return $timeout(function() {
        return $scope._debouncing = false;
      }, tim);
    };
    $scope.supportsTouch = function() {
      return Modernizr.touch;
    };
    $rootScope.$on('show:loader', function() {
      return $scope.loading = true;
    });
    $rootScope.$on('hide:loader', function() {
      return $scope.loading = false;
    });
    return String.prototype.parameterise = function(seperator) {
      if (seperator == null) {
        seperator = '-';
      }
      return this.trim().replace(/\s/g, seperator).toLowerCase();
    };
  });

}).call(this);
