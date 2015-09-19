
/***
* @ngdoc directive
* @name BB.Directives:bbPaymentButton
* @restrict EA
* @replace true
* @scope true
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:bbPaymentButton
*
* Has the following set of methods:
*
* - getTemplate(type, scope)
* - getButtonFormTemplate(scope)
* - setClassAndValue(scope, element, attributes)
* - linker(scope, element, attributes)
*
* <pre>
* restrict: 'EA'
* replace: true
* scope: {
*   total: '='
*   bb: '='
*   decideNextPage: '='
* }
* link: linker
* </pre>
*
* @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$compile more}
*
* @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$sce more}
*
* @param {service}  $http The $http service is a core Angular service that facilitates communication with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$http more}
*
* @param {service} $templateCache $templateCache
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$templateCachee more}
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log more}
*
 */

(function() {
  angular.module('BB.Directives').directive('bbPaymentButton', function($compile, $sce, $http, $templateCache, $q, $log) {
    var getButtonFormTemplate, getTemplate, linker, setClassAndValue;
    getTemplate = function(type, scope) {
      switch (type) {
        case 'button_form':
          return getButtonFormTemplate(scope);
        case 'page':
          return "<a ng-click=\"decideNextPage()\">{{label}}</a>";
        case 'location':
          return "<a href='{{payment_link}}'>{{label}}</a>";
        default:
          return "";
      }
    };
    getButtonFormTemplate = function(scope) {
      var src;
      src = $sce.parseAsResourceUrl("'" + scope.payment_link + "'")();
      return $http.get(src, {}).then(function(response) {
        return response.data;
      });
    };
    setClassAndValue = function(scope, element, attributes) {
      var c, i, inputs, j, len, main_tag, ref, results;
      switch (scope.link_type) {
        case 'button_form':
          inputs = element.find("input");
          main_tag = ((function() {
            var j, len, results;
            results = [];
            for (j = 0, len = inputs.length; j < len; j++) {
              i = inputs[j];
              if ($(i).attr('type') === 'submit') {
                results.push(i);
              }
            }
            return results;
          })())[0];
          if (attributes.value) {
            $(main_tag).attr('value', attributes.value);
          }
          break;
        case 'page':
        case 'location':
          main_tag = element.find("a")[0];
      }
      if (attributes["class"]) {
        ref = attributes["class"].split(" ");
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          $(main_tag).addClass(c);
          results.push($(element).removeClass(c));
        }
        return results;
      }
    };
    linker = function(scope, element, attributes) {
      return scope.$watch('total', function() {
        var url;
        scope.bb.payment_status = "pending";
        scope.bb.total = scope.total;
        scope.link_type = scope.total.$link('new_payment').type;
        scope.label = attributes.value || "Make Payment";
        scope.payment_link = scope.total.$href('new_payment');
        url = scope.total.$href('new_payment');
        return $q.when(getTemplate(scope.link_type, scope)).then(function(template) {
          element.html(template).show();
          $compile(element.contents())(scope);
          return setClassAndValue(scope, element, attributes);
        }, function(err) {
          $log.warn(err.data);
          return element.remove();
        });
      });
    };
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        total: '=',
        bb: '=',
        decideNextPage: '='
      },
      link: linker
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPaypalExpressButton
  * @restrict A
  * @replace true
  * @scope true
  *
  * @description
  * BB.Directives:bbPaypalExpressButton
  *
  * <pre>
  * restrict: 'EA'
  * replace: true
  * template: """
  *   <a ng-href="{{href}}" ng-click="showLoader()">Pay</a>
  * """
  * scope: {
  *   total: '='
  *   bb: '='
  *   decideNextPage: '='
  *   paypalOptions: '=bbPaypalExpressButton'
  *   notLoaded: '='
  * }
  * link: linker
  * </pre>
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$sce more}
  *
  * @param {service}  $http The $http service is a core Angular service that facilitates communication with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$http more}
  *
  * @param {service} $templateCache $templateCache
  * <br>
  * {@link https://docs.angularjFs.org/api/ng/service/$templateCachee more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} $log Simple service for logging.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$log more}
  *
  * ===== $window =====
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} UriTemplate Info
  * <br>
  * {@link UriTemplate more}
  *
   */

  angular.module('BB.Directives').directive('bbPaypalExpressButton', function($compile, $sce, $http, $templateCache, $q, $log, $window, UriTemplate) {
    var linker;
    linker = function(scope, element, attributes) {
      var paypalOptions, total;
      total = scope.total;
      paypalOptions = scope.paypalOptions;
      scope.href = new UriTemplate(total.$link('paypal_express').href).fillFromObject(paypalOptions);
      return scope.showLoader = function() {
        if (scope.notLoaded) {
          return scope.notLoaded(scope);
        }
      };
    };
    return {
      restrict: 'EA',
      replace: true,
      template: "<a ng-href=\"{{href}}\" ng-click=\"showLoader()\">Pay</a>",
      scope: {
        total: '=',
        bb: '=',
        decideNextPage: '=',
        paypalOptions: '=bbPaypalExpressButton',
        notLoaded: '='
      },
      link: linker
    };
  });

}).call(this);
