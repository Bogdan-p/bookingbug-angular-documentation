(function() {
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:ngConfirmClick
  *
  * # Has the following set of methods:
  *
  * - link: (scope, element, attr)
  *
  * @description
  * Directive BB.Directives:ngConfirmClick
  *
   */

  app.directive('ngConfirmClick', function() {
    return {
      link: function(scope, element, attr) {
        var clickAction, msg;
        msg = attr.ngConfirmClick || "Are you sure?";
        clickAction = attr.ngConfirmedClick;
        return element.bind('click', (function(_this) {
          return function(event) {
            if (window.confirm(msg)) {
              return scope.$eval(clickAction);
            }
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:ngValidInclude
  *
  * @description
  * Directive BB.Directives:ngValidInclude
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('ngValidInclude', function($compile) {
    return {
      link: function(scope, element, attr) {
        return scope[attr.watchValue].then((function(_this) {
          return function(logged) {
            element.attr('ng-include', attr.ngValidInclude);
            element.attr('ng-valid-include', null);
            return $compile(element)(scope);
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:ngDelayed
  *
  * @description
  * Directive BB.Directives:ngDelayed
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('ngDelayed', function($compile) {
    return {
      link: function(scope, element, attr) {
        return scope[attr.ngDelayedWatch].then((function(_this) {
          return function(logged) {
            element.attr(attr.ngDelayed, attr.ngDelayedValue);
            element.attr('ng-delayed-value', null);
            element.attr('ng-delayed-watch', null);
            element.attr('ng-delayed', null);
            $compile(element)(scope);
            if (attr.ngDelayedReady) {
              return scope[attr.ngDelayedReady].resolve(true);
            }
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:ngInitial
  * @restrict A
  *
  * @description
  * Directive BB.Directives:ngInitial
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('ngInitial', function() {
    return {
      restrict: 'A',
      controller: [
        '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
          var getter, setter, val;
          val = $attrs.ngInitial || $attrs.value;
          getter = $parse($attrs.ngModel);
          setter = getter.assign;
          if (val === "true") {
            val = true;
          } else if (val === "false") {
            val = false;
          }
          return setter($scope, val);
        }
      ]
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPrintPage
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbPrintPage
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
   */

  app.directive('bbPrintPage', function($window, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (attr.bbPrintPage) {
          return scope.$watch(attr.bbPrintPage, (function(_this) {
            return function(newVal, oldVal) {
              return $timeout(function() {
                return $window.print();
              }, 3000);
            };
          })(this));
        }
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbInclude
  *
  * @description
  * Directive BB.Directives:bbInclude
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
   */

  app.directive('bbInclude', function($compile, $rootScope) {
    return {
      link: function(scope, element, attr) {
        var track_page;
        track_page = attr.bbTrackPage != null ? true : false;
        return scope.$watch('bb.path_setup', (function(_this) {
          return function(newval, oldval) {
            if (newval) {
              element.attr('ng-include', "'" + scope.getPartial(attr.bbInclude) + "'");
              element.attr('bb-include', null);
              $compile(element)(scope);
              if (track_page) {
                return $rootScope.$broadcast("page:loaded", attr.bbInclude);
              }
            }
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbRaiseAlertWhenInvalid
  *
  * @description
  * Directive BB.Directives:bbRaiseAlertWhenInvalid
  * Form directive to allow users to specify if they want the form to raise alerts when
  * there is invalid input.
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr, ctrl)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbRaiseAlertWhenInvalid', function($compile) {
    return {
      require: '^form',
      link: function(scope, element, attr, ctrl) {
        var options;
        ctrl.raise_alerts = true;
        options = scope.$eval(attr.bbRaiseAlertWhenInvalid);
        if (options && options.alert) {
          return ctrl.alert = options.alert;
        }
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbHeader
  *
  * @description
  * Directive BB.Directives:bbHeader
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbHeader', function($compile) {
    return {
      link: function(scope, element, attr) {
        scope.bb.waitForRoutes();
        return scope.$watch('bb.path_setup', (function(_this) {
          return function(newval, oldval) {
            if (newval) {
              element.attr('ng-include', "'" + scope.getPartial(attr.bbHeader) + "'");
              element.attr('bb-header', null);
              return $compile(element)(scope);
            }
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbDate
  *
  * @description
  * Directive BB.Directives:bbDate
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
   */

  app.directive('bbDate', function() {
    return {
      restrict: 'AE',
      scope: true,
      link: function(scope, element, attrs) {
        var date, track_service;
        track_service = attrs.bbTrackService != null;
        if (attrs.bbDate) {
          date = moment(scope.$eval(attrs.bbDate));
        } else if (scope.bb && scope.bb.current_item && scope.bb.current_item.date) {
          date = scope.bb.current_item.date.date;
        } else {
          date = moment();
        }
        if (track_service && scope.bb.current_item && scope.bb.current_item.service) {
          scope.min_date = scope.bb.current_item.service.min_advance_datetime;
          scope.max_date = scope.bb.current_item.service.max_advance_datetime;
        }
        scope.$broadcast('dateChanged', moment(date));
        scope.bb_date = {
          date: date,
          js_date: date.toDate(),
          addDays: function(type, amount) {
            this.date = moment(this.date).add(amount, type);
            this.js_date = this.date.toDate();
            return scope.$broadcast('dateChanged', moment(this.date));
          },
          subtractDays: function(type, amount) {
            return this.addDays(type, -amount);
          },
          setDate: function(date) {
            this.date = date;
            this.js_date = date.toDate();
            return scope.$broadcast('dateChanged', moment(this.date));
          }
        };
        scope.$on("currentItemUpdate", function(event) {
          if (scope.bb.current_item.service && track_service) {
            scope.min_date = scope.bb.current_item.service.min_advance_datetime;
            scope.max_date = scope.bb.current_item.service.max_advance_datetime;
            if (scope.bb_date.date.isBefore(scope.min_date, 'day')) {
              scope.bb_date.setDate(scope.min_date.clone());
            }
            if (scope.bb_date.date.isAfter(scope.max_date, 'day')) {
              return scope.bb_date.setDate(scope.max_date.clone());
            }
          }
        });
        return scope.$watch('bb_date.js_date', function(newval, oldval) {
          var ndate;
          ndate = moment(newval);
          if (!scope.bb_date.date.isSame(ndate)) {
            scope.bb_date.date = ndate;
            if (moment(ndate).isValid()) {
              return scope.$broadcast('dateChanged', moment(ndate));
            }
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbDebounce
  *
  * @description
  * Directive BB.Directives:bbDebounce
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr)
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
   */

  app.directive('bbDebounce', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var delay;
        delay = 400;
        if (attrs.bbDebounce) {
          delay = attrs.bbDebounce;
        }
        return element.bind('click', (function(_this) {
          return function() {
            $timeout(function() {
              return element.attr('disabled', true);
            }, 0);
            return $timeout(function() {
              return element.attr('disabled', false);
            }, delay);
          };
        })(this));
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbLocalNumber
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbLocalNumber
  * <br>
  * Adds a formatter that prepends the model value with zero. This is useful for
  * nicely formatting numbers where the prefix has been stripped, i.e. '7875123456'
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr, ctrl)
  *
   */

  app.directive('bbLocalNumber', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var prettyifyNumber;
        prettyifyNumber = function(value) {
          if (value && value[0] !== "0") {
            value = "0" + value;
          } else {
            value;
          }
          return value;
        };
        return ctrl.$formatters.push(prettyifyNumber);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPadWithZeros
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbPadWithZeros
  * <br>
  * Adds a formatter that prepends the model value with the specified number of zeros.
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attr, ctrl)
  *
   */

  app.directive('bbPadWithZeros', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var how_many, options, padNumber;
        options = scope.$eval(attrs.bbPadWithZeros) || {};
        how_many = options.how_many || 2;
        padNumber = function(value) {
          var i, index, padding, ref;
          value = String(value);
          if (value && value.length < how_many) {
            padding = "";
            for (index = i = 1, ref = how_many - value.length; 1 <= ref ? i <= ref : i >= ref; index = 1 <= ref ? ++i : --i) {
              padding += "0";
            }
            value = padding.concat(value);
          }
          return value;
        };
        return ctrl.$formatters.push(padNumber);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbFormResettable
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbFormResettable
  * <br>
  * Adds field clearing behaviour to forms.
  *
  * # Has the following set of methods:
  *
  * - controller($scope, $element, $attrs)
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
   */

  app.directive('bbFormResettable', function($parse) {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs) {
        $scope.inputs = [];
        $scope.resetForm = function(options) {
          var i, input, len, ref, results;
          if (options && options.clear_submitted) {
            $scope[$attrs.name].submitted = false;
          }
          ref = $scope.inputs;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            input = ref[i];
            input.getter.assign($scope, null);
            results.push(input.controller.$setPristine());
          }
          return results;
        };
        return {
          registerInput: function(input, ctrl) {
            var getter;
            getter = $parse(input);
            return $scope.inputs.push({
              getter: getter,
              controller: ctrl
            });
          }
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbResettable
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbResettable
  * <br>
  * Registers inputs with the bbFormResettable controller allowing them to be cleared.
  *
  * # Has the following set of methods:
  *
  * - controller(scope, element, attrs, ctrls)
  *
   */

  app.directive('bbResettable', function() {
    return {
      restrict: 'A',
      require: ['ngModel', '^bbFormResettable'],
      link: function(scope, element, attrs, ctrls) {
        var formResettableCtrl, ngModelCtrl;
        ngModelCtrl = ctrls[0];
        formResettableCtrl = ctrls[1];
        return formResettableCtrl.registerInput(attrs.ngModel, ngModelCtrl);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbDateSplit
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbDateSplit
  *
  * # Has the following set of methods:
  *
  * - controller($scope, $element, $attrs)
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
   */

  app.directive('bbDateSplit', function($parse) {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var ngModel, question;
        ngModel = ctrls[0];
        question = scope.$eval(attrs.bbDateSplit);
        question.date = {
          day: null,
          month: null,
          year: null,
          date: null,
          joinDate: function() {
            var date_string;
            if (this.day && this.month && this.year) {
              date_string = this.day + '/' + this.month + '/' + this.year;
              this.date = moment(date_string, "DD/MM/YYYY");
              date_string = this.date.toISODate();
              ngModel.$setViewValue(date_string);
              return ngModel.$render();
            }
          },
          splitDate: function(date) {
            if (date && date.isValid()) {
              this.day = date.date();
              this.month = date.month() + 1;
              this.year = date.year();
              return this.date = date;
            }
          }
        };
        if (question.answer) {
          question.date.splitDate(moment(question.answer));
        }
        if (ngModel.$viewValue) {
          return question.date.splitDate(moment(ngModel.$viewValue));
        }
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbCommPref
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbCommPref
  *
  * # Has the following set of methods:
  *
  * - controller($scope, $element, $attrs)
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
   */

  app.directive('bbCommPref', function($parse) {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var comm_pref_default, ngModelCtrl;
        ngModelCtrl = ctrls[0];
        comm_pref_default = scope.$eval(attrs.bbCommPref || false);
        ngModelCtrl.$setViewValue(comm_pref_default);
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          if (newval !== oldval) {
            scope.bb.current_item.settings.send_email_followup = newval;
            return scope.bb.current_item.settings.send_sms_followup = newval;
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbCountTicketTypes
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbCountTicketTypes
  * <br>
  * Returns the number of tickets purchased grouped by name.
  *
  * # Has the following set of methods:
  *
  * - controller(scope, element, attrs)
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
   */

  app.directive('bbCountTicketTypes', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var counts, i, item, items, len, results;
        items = scope.$eval(attrs.bbCountTicketTypes);
        counts = [];
        results = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          if (item.tickets) {
            if (counts[item.tickets.name]) {
              counts[item.tickets.name] += 1;
            } else {
              counts[item.tickets.name] = 1;
            }
            results.push(item.number = counts[item.tickets.name]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbCapitaliseFirstLetter
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbCapitaliseFirstLetter
  *
  * # Has the following set of methods:
  *
  * - controller$scope, element, attrs, ctrls)
  *
  * @param {service} $parse Converts Angular expression into a function.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$parse more}
  *
   */

  app.directive('bbCapitaliseFirstLetter', function() {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var ngModel;
        ngModel = ctrls[0];
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          var string;
          if (newval) {
            string = scope.$eval(attrs.ngModel);
            string = string.charAt(0).toUpperCase() + string.slice(1);
            ngModel.$setViewValue(string);
            ngModel.$render();
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:apiUrl
  * @restrict A
  * @deprecated
  *
  * @description
  * Directive BB.Directives:apiUrl
  * <br>
  * Please see {@link BB.Directives:bbApiUrl bbApiUrl}
  *
  * # Has the following set of methods:
  *
  * - compile(tElem, tAttrs)
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $sniffer AThis is very simple implementation of testing browser's features.
  * <br>
  * {@link https://github.com/angular/angular.js/blob/master/src/ng/sniffer.js more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
   */

  app.directive('apiUrl', function($rootScope, $compile, $sniffer, $timeout, $window) {
    return {
      restrict: 'A',
      replace: true,
      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, element, attrs) {
            var src, url;
            $rootScope.bb || ($rootScope.bb = {});
            $rootScope.bb.api_url = attrs.apiUrl;
            url = document.createElement('a');
            url.href = attrs.apiUrl;
            if (($sniffer.msie && $sniffer.msie < 10) && url.host !== $window.location.host) {
              if (url.protocol[url.protocol.length - 1] === ':') {
                src = url.protocol + "//" + url.host + "/ClientProxy.html";
              } else {
                src = url.protocol + "://" + url.host + "/ClientProxy.html";
              }
              $rootScope.iframe_proxy_ready = false;
              $window.iframeLoaded = function() {
                $rootScope.iframe_proxy_ready = true;
                return $rootScope.$broadcast('iframe_proxy_ready', {
                  iframe_proxy_ready: true
                });
              };
              return $compile("<iframe id='ieapiframefix' name='" + url.hostname + ("' src='" + src + "' style='visibility:false;display:none;' onload='iframeLoaded()'></iframe>"))(scope, (function(_this) {
                return function(cloned, scope) {
                  return element.append(cloned);
                };
              })(this));
            }
          }
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbApiUrl
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbApiUrl
  *
  * # Has the following set of methods:
  *
  * - compile(tElem, tAttrs)
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $sniffer AThis is very simple implementation of testing browser's features.
  * <br>
  * {@link https://github.com/angular/angular.js/blob/master/src/ng/sniffer.js more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location more}
  *
   */

  app.directive('bbApiUrl', function($rootScope, $compile, $sniffer, $timeout, $window, $location) {
    return {
      restrict: 'A',
      scope: {
        'apiUrl': '@bbApiUrl'
      },
      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, element, attrs) {
            var src, url;
            $rootScope.bb || ($rootScope.bb = {});
            $rootScope.bb.api_url = scope.apiUrl;
            url = document.createElement('a');
            url.href = scope.apiUrl;
            if ($sniffer.msie && $sniffer.msie < 10) {
              if (!(url.host === $location.host() || url.host === (($location.host()) + ":" + ($location.port())))) {
                if (url.protocol[url.protocol.length - 1] === ':') {
                  src = url.protocol + "//" + url.host + "/ClientProxy.html";
                } else {
                  src = url.protocol + "://" + url.host + "/ClientProxy.html";
                }
                $rootScope.iframe_proxy_ready = false;
                $window.iframeLoaded = function() {
                  $rootScope.iframe_proxy_ready = true;
                  return $rootScope.$broadcast('iframe_proxy_ready', {
                    iframe_proxy_ready: true
                  });
                };
                return $compile("<iframe id='ieapiframefix' name='" + url.hostname + ("' src='" + src + "' style='visibility:false;display:none;' onload='iframeLoaded()'></iframe>"))(scope, (function(_this) {
                  return function(cloned, scope) {
                    return element.append(cloned);
                  };
                })(this));
              }
            }
          }
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPriceFilter
  * @restrict AE
  * @require: ^?bbServices
  *
  * @description
  * Directive BB.Directives:bbPriceFilter
  *
  * # Has the following set of methods:
  *
  * - templateUrl(element, attrs)
  * - controller($scope, $attrs)
  *
  * @param {service} PathSvc Info
  * <br>
  * {@link BB.Services:PathSvc more}
  *
   */

  app.directive('bbPriceFilter', function(PathSvc) {
    return {
      restrict: 'AE',
      replace: true,
      scope: false,
      require: '^?bbServices',
      templateUrl: function(element, attrs) {
        return PathSvc.directivePartial("_price_filter");
      },
      controller: function($scope, $attrs) {
        var setPricefilter, suitable_max;
        $scope.$watch('items', function(new_val, old_val) {
          if (new_val) {
            return setPricefilter(new_val);
          }
        });
        setPricefilter = function(items) {
          $scope.price_array = _.uniq(_.map(items, function(item) {
            return item.price / 100 || 0;
          }));
          $scope.price_array.sort(function(a, b) {
            return a - b;
          });
          return suitable_max();
        };
        suitable_max = function() {
          var max_number, min_number, top_number;
          top_number = _.last($scope.price_array);
          max_number = (function() {
            switch (false) {
              case !(top_number < 1):
                return 0;
              case !(top_number < 11):
                return 10;
              case !(top_number < 51):
                return 50;
              case !(top_number < 101):
                return 100;
              case !(top_number < 1000):
                return (Math.ceil(top_number / 100)) * 100;
            }
          })();
          min_number = 0;
          $scope.price_options = {
            min: min_number,
            max: max_number
          };
          return $scope.filters.price = {
            min: min_number,
            max: max_number
          };
        };
        $scope.$watch('filters.price.min', function(new_val, old_val) {
          if (new_val !== old_val) {
            return $scope.filterChanged();
          }
        });
        return $scope.$watch('filters.price.max', function(new_val, old_val) {
          if (new_val !== old_val) {
            return $scope.filterChanged();
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbBookingExport
  * @restrict AE
  * @scope true;
  *
  * @description
  * Directive BB.Directives:bbBookingExport
  *
  * <pre>
  * //template
  * <div bb-include="_popout_export_booking" style="display: inline;"></div>
  * </pre>
  *
  * <pre>
  * scope.html = "
          <a class='image img_outlook' title='Add this booking to an Outlook Calendar' href='#{purchase_total.icalLink()}'><img alt='' src='//images.bookingbug.com/widget/outlook.png'></a>
          <a class='image img_ical' title='Add this booking to an iCal Calendar' href='#{purchase_total.webcalLink()}'><img alt='' src='//images.bookingbug.com/widget/ical.png'></a>
          <a class='image img_gcal' title='Add this booking to Google Calendar' href='#{purchase_total.gcalLink()}' target='_blank'><img src='//images.bookingbug.com/widget/gcal.png' border='0'></a>
        "
  * </pre>
  *
  * # Has the following set of methods:
  * - link(scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbBookingExport', function($compile) {
    return {
      restrict: 'AE',
      scope: true,
      template: '<div bb-include="_popout_export_booking" style="display: inline;"></div>',
      link: function(scope, element, attrs) {
        var setHTML;
        scope.$watch('total', function(newval, old) {
          if (newval) {
            return setHTML(newval);
          }
        });
        scope.$watch('purchase', function(newval, old) {
          if (newval) {
            return setHTML(newval);
          }
        });
        return setHTML = function(purchase_total) {
          return scope.html = "<a class='image img_outlook' title='Add this booking to an Outlook Calendar' href='" + (purchase_total.icalLink()) + "'><img alt='' src='//images.bookingbug.com/widget/outlook.png'></a> <a class='image img_ical' title='Add this booking to an iCal Calendar' href='" + (purchase_total.webcalLink()) + "'><img alt='' src='//images.bookingbug.com/widget/ical.png'></a> <a class='image img_gcal' title='Add this booking to Google Calendar' href='" + (purchase_total.gcalLink()) + "' target='_blank'><img src='//images.bookingbug.com/widget/gcal.png' border='0'></a>";
        };
      }
    };
  });

}).call(this);
