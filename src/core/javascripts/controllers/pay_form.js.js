(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbPayForm
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbPayForm
  *
  * See Controller {@link BB.Controllers:PayForm PayForm}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'PayForm'
  * link: linker
  * </pre>
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
  * @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$sce more}
  *
  * ===== $http =====
  * @param {service}  $http The $http service is a core Angular service that facilitates communication with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$http more}
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $document A jQuery or jqLite wrapper for the browser's window.document object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$document more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  * @param {service} SettingsService Info
  * <br>
  * {@link BB.Services:SettingsService more}
  *
   */
  angular.module('BB.Directives').directive('bbPayForm', function($window, $timeout, $sce, $http, $compile, $document, $location, SettingsService) {
    var applyCustomPartials, applyCustomStylesheet, linker;
    applyCustomPartials = function(custom_partial_url, scope, element) {
      if (custom_partial_url != null) {
        $document.domain = "bookingbug.com";
        return $http.get(custom_partial_url).then(function(custom_templates) {
          return $compile(custom_templates.data)(scope, function(custom, scope) {
            var custom_form, e, i, len;
            for (i = 0, len = custom.length; i < len; i++) {
              e = custom[i];
              if (e.tagName === "STYLE") {
                element.after(e.outerHTML);
              }
            }
            custom_form = (function() {
              var j, len1, results;
              results = [];
              for (j = 0, len1 = custom.length; j < len1; j++) {
                e = custom[j];
                if (e.id === 'payment_form') {
                  results.push(e);
                }
              }
              return results;
            })();
            if (custom_form && custom_form[0]) {
              return $compile(custom_form[0].innerHTML)(scope, function(compiled_form, scope) {
                var action, form;
                form = element.find('form')[0];
                action = form.action;
                compiled_form.attr('action', action);
                return $(form).replaceWith(compiled_form);
              });
            }
          });
        });
      }
    };
    applyCustomStylesheet = function(href) {
      var css_id, head, link;
      css_id = 'custom_css';
      if (!document.getElementById(css_id)) {
        head = document.getElementsByTagName('head')[0];
        link = document.createElement('link');
        link.id = css_id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.media = 'all';
        head.appendChild(link);
        return link.onload = function() {
          if ('parentIFrame' in $window) {
            return parentIFrame.size();
          }
        };
      }
    };
    linker = function(scope, element, attributes) {
      return $window.addEventListener('message', (function(_this) {
        return function(event) {
          var data;
          if (angular.isObject(event.data)) {
            data = event.data;
          } else if (angular.isString(event.data) && !event.data.match(/iFrameSizer/)) {
            data = JSON.parse(event.data);
          }
          if (data) {
            switch (data.type) {
              case "load":
                return scope.$apply(function() {
                  scope.referrer = data.message;
                  if (data.custom_partial_url) {
                    applyCustomPartials(event.data.custom_partial_url, scope, element);
                  }
                  if (data.custom_stylesheet) {
                    applyCustomStylesheet(data.custom_stylesheet);
                  }
                  if (data.scroll_offset) {
                    return SettingsService.setScrollOffset(data.scroll_offset);
                  }
                });
            }
          }
        };
      })(this), false);
    };
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PayForm',
      link: linker
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:PayForm
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PayForm
  *
  * # Has the following set of methods:
  *
  * - $scope.setTotal(total)
  * - $scope.setCard(card)
  * - sendSubmittingEvent()
  * - submitPaymentForm()
  * - $scope.submitAndSendMessage(event)
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
  *
   */

  angular.module('BB.Controllers').controller('PayForm', function($scope, $location) {
    var sendSubmittingEvent, submitPaymentForm;
    $scope.controller = "public.controllers.PayForm";
    $scope.setTotal = function(total) {
      return $scope.total = total;
    };
    $scope.setCard = function(card) {
      return $scope.card = card;
    };
    sendSubmittingEvent = (function(_this) {
      return function() {
        var payload, referrer, target_origin;
        referrer = $location.protocol() + "://" + $location.host();
        if ($location.port()) {
          referrer += ":" + $location.port();
        }
        target_origin = $scope.referrer;
        payload = JSON.stringify({
          'type': 'submitting',
          'message': referrer
        });
        return parent.postMessage(payload, target_origin);
      };
    })(this);
    submitPaymentForm = (function(_this) {
      return function() {
        var payment_form;
        payment_form = angular.element.find('form');
        return payment_form[0].submit();
      };
    })(this);
    return $scope.submitAndSendMessage = (function(_this) {
      return function(event) {
        var payment_form;
        event.preventDefault();
        event.stopPropagation();
        payment_form = $scope.$eval('payment_form');
        if (payment_form.$invalid) {
          payment_form.submitted = true;
          return false;
        } else {
          sendSubmittingEvent();
          return submitPaymentForm();
        }
      };
    })(this);
  });

}).call(this);
