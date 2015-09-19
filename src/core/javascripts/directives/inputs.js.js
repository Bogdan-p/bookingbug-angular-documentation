(function() {
  'use strict';
  var app, isEmpty;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestionLine
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestionLine
  *
  * <pre>
  * transclude: false,
  * restrict: 'A',
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbQuestionLine', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        var e, elm, html, index;
        if (scope.question.detail_type === "heading") {
          elm = "";
          if (scope.question.name.length > 0) {
            elm += "<div class='bb-question-heading'>" + scope.question.name + "</div>";
          }
          if (scope.question.help_text && scope.question.help_text.length > 0) {
            elm += "<div class='bb-question-help-text'>" + scope.question.help_text + "</div>";
          }
          element.html(elm);
        }
        if (scope.idmaps && ((scope.idmaps[scope.question.detail_type] && scope.idmaps[scope.question.detail_type].block) || (scope.idmaps[scope.question.id] && scope.idmaps[scope.question.id].block))) {
          index = scope.idmaps[scope.question.id] ? scope.question.id : scope.question.detail_type;
          html = scope.$parent.idmaps[index].html;
          return e = $compile(html)(scope, (function(_this) {
            return function(cloned, scope) {
              return element.replaceWith(cloned);
            };
          })(this));
        }
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestion
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestion
  *
  * <pre>
  * priority: 0,
  * replace: true,
  * transclude: false,
  * restrict: 'A',
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - compile(el,attr,trans)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
  * @param {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeout more}
  *
   */

  app.directive('bbQuestion', function($compile, $timeout) {
    return {
      priority: 0,
      replace: true,
      transclude: false,
      restrict: 'A',
      compile: function(el, attr, trans) {
        return {
          pre: function(scope, element, attrs) {
            var adminRequired, ref;
            adminRequired = (ref = attrs.bbAdminRequired) != null ? ref : false;
            return scope.$watch(attrs.bbQuestion, function(question) {
              var e, html, i, index, itemx, j, lastName, len1, len2, name, ref1, ref2;
              if (question) {
                html = '';
                lastName = '';
                scope.recalc = (function(_this) {
                  return function() {
                    if (angular.isDefined(scope.recalc_price)) {
                      if (!question.outcome) {
                        scope.recalc_price();
                      }
                    }
                    if (angular.isDefined(scope.recalc_question)) {
                      return scope.recalc_question();
                    }
                  };
                })(this);
                if (scope.idmaps && (scope.idmaps[question.detail_type] || scope.idmaps[question.id])) {
                  index = scope.idmaps[scope.question.id] ? scope.question.id : scope.question.detail_type;
                  html = scope.idmaps[index].html;
                } else if (question.detail_type === "select" || question.detail_type === "select-price") {
                  html = "<select ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' class='form-question form-control'>";
                  ref1 = question.options;
                  for (i = 0, len1 = ref1.length; i < len1; i++) {
                    itemx = ref1[i];
                    html += "<option data_id='" + itemx.id + "' value='" + itemx.name + "'>" + itemx.display_name + "</option>";
                  }
                  html += "</select>";
                } else if (question.detail_type === "text_area") {
                  html = "<textarea ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' rows=3 class='form-question form-control'>" + question['answer'] + "</textarea>";
                } else if (question.detail_type === "radio") {
                  html = '<div class="radio-group">';
                  ref2 = question.options;
                  for (j = 0, len2 = ref2.length; j < len2; j++) {
                    itemx = ref2[j];
                    html += "<div class='radio'><label class='radio-label'><input ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='radio' value=\"" + itemx.name + "\"/>" + itemx.name + "</label></div>";
                  }
                  html += "</div>";
                } else if (question.detail_type === "check") {
                  name = question.name;
                  if (name === lastName) {
                    name = "";
                  }
                  lastName = question.name;
                  html = "<div class='checkbox' ng-class='{\"selected\": question.answer}'><label><input name='q" + question.id + "' id='" + question.id + "' ng-model='question.answer' ng-checked='question.answer == \"1\"' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='checkbox' value=1>" + name + "</label></div>";
                } else if (question.detail_type === "check-price") {
                  html = "<div class='checkbox'><label><input name='q" + question.id + "' id='" + question.id + "' ng-model='question.answer' ng-checked='question.answer == \"1\"' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='checkbox' value=1> ({{question.price | currency:'GBP'}})</label></div>";
                } else if (question.detail_type === "date") {
                  html = "<div class='input-group date-picker'> <input type='text' class='form-question form-control' name='q" + question.id + "' id='" + question.id + "' bb-datepicker-popup='DD/MM/YYYY' datepicker-popup='dd/MM/yyyy' ng-model='question.answer' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' datepicker-options='{\"starting-day\": 1}' show-weeks='false' show-button-bar='false' is-open='opened' /> <span class='input-group-btn' ng-click='$event.preventDefault();$event.stopPropagation();opened=true'> <button class='btn btn-default' type='submit'><span class='glyphicon glyphicon-calendar'></span></button> </span> </div>";
                } else {
                  html = "<input type='text' ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' class='form-question form-control'/>";
                }
                if (html) {
                  return e = $compile(html)(scope, (function(_this) {
                    return function(cloned, scope) {
                      return element.replaceWith(cloned);
                    };
                  })(this));
                }
              }
            });
          },
          post: function(scope, $e, $a, parentControl) {}
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestionSetup
  * @restrict A
  * @priority 1000
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestionSetup
  *
  * <pre>
  * restrict: 'A'
  * terminal: true
  * priority: 1000
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
  *
   */

  app.directive('bbQuestionSetup', function() {
    return {
      restrict: 'A',
      terminal: true,
      priority: 1000,
      link: function(scope, element, attrs) {
        var block, child, def, i, id, idmaps, index, len1, ref;
        idmaps = {};
        def = null;
        ref = element.children();
        for (index = i = 0, len1 = ref.length; i < len1; index = ++i) {
          child = ref[index];
          id = $(child).attr("bb-question-id");
          block = false;
          if ($(child).attr("bb-replace-block")) {
            block = true;
          }
          child.innerHTML = child.innerHTML.replace(/question_form/g, "question_form_" + index);
          idmaps[id] = {
            id: id,
            html: child.innerHTML,
            block: block
          };
        }
        scope.idmaps = idmaps;
        return element.replaceWith("");
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbFocus
  * @restrict A
  * @priority 1000
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbFocus
  *
  * Directive for testing if a input is focused
  *
   * Provided by http://www.ng-newsletter.com/posts/validations.html
  *
  * <pre>
  * restrict: "A",
  * require: "ngModel",
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs, ctrl)
  *
   */

  app.directive("bbFocus", [
    function() {
      var FOCUS_CLASS;
      FOCUS_CLASS = "bb-focused";
      return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
          ctrl.$focused = false;
          return element.bind("focus", function(evt) {
            element.addClass(FOCUS_CLASS);
            return scope.$apply(function() {
              return ctrl.$focused = true;
            });
          }).bind("blur", function(evt) {
            element.removeClass(FOCUS_CLASS);
            return scope.$apply(function() {
              return ctrl.$focused = false;
            });
          });
        }
      };
    }
  ]);

  isEmpty = function(value) {
    return angular.isUndefined(value) || value === "" || value === null || value !== value;
  };


  /***
  * @ngdoc directive
  * @name BB.Directives:ngMin
  * @restrict A
  * @priority 1000
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:ngMin
  *
  * Min directives for use with number inputs.
  * Although angular provides min/max directives when using a HTML number input, the control does not validate if the field is actually a number
  * So we have to use a text input with a ng-pattern that only allows numbers.
  *
  * http://jsfiddle.net/g/s5gKC/
  *
  * <pre>
  * restrict: "A"
  * require: "ngModel"
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, elem, attr, ctrl)
  *
   */

  app.directive("ngMin", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, elem, attr, ctrl) {
        var minValidator;
        scope.$watch(attr.ngMin, function() {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
        minValidator = function(value) {
          var min;
          min = scope.$eval(attr.ngMin) || 0;
          if (!isEmpty(value) && value < min) {
            ctrl.$setValidity("ngMin", false);
            return undefined;
          } else {
            ctrl.$setValidity("ngMin", true);
            return value;
          }
        };
        ctrl.$parsers.push(minValidator);
        ctrl.$formatters.push(minValidator);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:ngMax
  * @restrict A
  * @priority 1000
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:ngMax
  *
  * Max directives for use with number inputs.
  * Although angular provides min/max directives when using a HTML number input, the control does not validate if the field is actually a number
  * So we have to use a text input with a ng-pattern that only allows numbers.
  *
  * http://jsfiddle.net/g/s5gKC/
  *
  * <pre>
  * restrict: "A"
  * require: "ngModel"
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, elem, attr, ctrl)
  *
   */

  app.directive("ngMax", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, elem, attr, ctrl) {
        var maxValidator;
        scope.$watch(attr.ngMax, function() {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
        maxValidator = function(value) {
          var max;
          max = scope.$eval(attr.ngMax);
          if (!isEmpty(value) && value > max) {
            ctrl.$setValidity("ngMax", false);
            return undefined;
          } else {
            ctrl.$setValidity("ngMax", true);
            return value;
          }
        };
        ctrl.$parsers.push(maxValidator);
        ctrl.$formatters.push(maxValidator);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:creditCardNumber
  * @restrict C
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:creditCardNumber
  *
  * <pre>
  * restrict: "C"
  * require: "ngModel"
  * link: linker
  * scope: {
  *   'cardType': '='
  * }
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - getCardType(ccnumber)
  * - isValid(ccnumber)
  * - linker(scope, element, attributes, ngModel)
  *
   */

  app.directive("creditCardNumber", function() {
    var getCardType, isValid, linker;
    getCardType = function(ccnumber) {
      if (!ccnumber) {
        return '';
      }
      ccnumber = ccnumber.toString().replace(/\s+/g, '');
      if (/^(34)|^(37)/.test(ccnumber)) {
        return "american_express";
      }
      if (/^(62)|^(88)/.test(ccnumber)) {
        return "china_unionpay";
      }
      if (/^30[0-5]/.test(ccnumber)) {
        return "diners_club_carte_blanche";
      }
      if (/^(2014)|^(2149)/.test(ccnumber)) {
        return "diners_club_enroute";
      }
      if (/^36/.test(ccnumber)) {
        return "diners_club_international";
      }
      if (/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)) {
        return "discover";
      }
      if (/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
        return "jcb";
      }
      if (/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
        return "laser";
      }
      if (/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
        return "maestro";
      }
      if (/^5[1-5]/.test(ccnumber)) {
        return "master";
      }
      if (/^4/.test(ccnumber)) {
        return "visa";
      }
      if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
        return "visa_electron";
      }
    };
    isValid = function(ccnumber) {
      var len, mul, prodArr, sum;
      if (!ccnumber) {
        return false;
      }
      ccnumber = ccnumber.toString().replace(/\s+/g, '');
      len = ccnumber.length;
      mul = 0;
      prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
      sum = 0;
      while (len--) {
        sum += prodArr[mul][parseInt(ccnumber.charAt(len), 10)];
        mul ^= 1;
      }
      return sum % 10 === 0 && sum > 0;
    };
    linker = function(scope, element, attributes, ngModel) {
      return scope.$watch(function() {
        return ngModel.$modelValue;
      }, function(newValue) {
        ngModel.$setValidity('card_number', isValid(newValue));
        scope.cardType = getCardType(newValue);
        if ((newValue != null) && newValue.length === 16) {
          if (ngModel.$invalid) {
            element.parent().addClass('has-error');
            return element.parent().removeClass('has-success');
          } else {
            element.parent().removeClass('has-error');
            return element.parent().addClass('has-success');
          }
        } else {
          return element.parent().removeClass('has-success');
        }
      });
    };
    return {
      restrict: "C",
      require: "ngModel",
      link: linker,
      scope: {
        'cardType': '='
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:cardSecurityCode
  * @restrict C
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:cardSecurityCode
  *
  * <pre>
  * restrict: "C"
  * link: linker
  * scope: {
  *   'cardType': '='
  * }
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - linker(scope, element, attributes)
  *
   */

  app.directive("cardSecurityCode", function() {
    var linker;
    linker = function(scope, element, attributes) {
      return scope.$watch('cardType', function(newValue) {
        if (newValue === 'american_express') {
          element.attr('maxlength', 4);
          return element.attr('placeholder', "••••");
        } else {
          element.attr('maxlength', 3);
          return element.attr('placeholder', "•••");
        }
      });
    };
    return {
      restrict: "C",
      link: linker,
      scope: {
        'cardType': '='
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbInputGroupManager
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbInputGroupManager
  *
  * Allows you you register inputs
  *
  * <pre>
  * restrict: 'A'
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - controller($scope, $element, $attrs)
  *
   */

  app.directive('bbInputGroupManager', function(ValidatorService) {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs) {
        $scope.input_manger = {
          input_groups: {},
          inputs: [],
          registerInput: function(input, name) {
            if (this.inputs.indexOf(input.$name) >= 0) {
              return;
            }
            this.inputs.push(input.$name);
            if (!this.input_groups[name]) {
              this.input_groups[name] = {
                inputs: [],
                valid: false
              };
            }
            return this.input_groups[name].inputs.push(input);
          },
          validateInputGroup: function(name) {
            var i, input, is_valid, j, len1, len2, ref, ref1;
            is_valid = false;
            ref = this.input_groups[name].inputs;
            for (i = 0, len1 = ref.length; i < len1; i++) {
              input = ref[i];
              is_valid = input.$modelValue;
              if (is_valid) {
                break;
              }
            }
            if (is_valid === !this.input_groups[name].valid) {
              ref1 = this.input_groups[name].inputs;
              for (j = 0, len2 = ref1.length; j < len2; j++) {
                input = ref1[j];
                input.$setValidity(input.$name, is_valid);
              }
              return this.input_groups[name].valid = is_valid;
            }
          }
        };
        return $element.on("submit", function() {
          var input_group, results;
          results = [];
          for (input_group in $scope.input_manger.input_groups) {
            results.push($scope.input_manger.validateInputGroup(input_group));
          }
          return results;
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbInputGroup
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbInputGroup
  *
  * Return if the input has already been registered.
  *
  * Register the input.
  *
  * Watch the input for changes
  *
  * <pre>
  * restrict: "A",
  * require: 'ngModel',
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, elem, attrs, ngModel)
  *
   */

  app.directive("bbInputGroup", function() {
    return {
      restrict: "A",
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        if (scope.input_manger.inputs.indexOf(ngModel.$name) >= 0) {
          return;
        }
        scope.input_manger.registerInput(ngModel, attrs.bbInputGroup);
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          if (newval === !oldval) {
            return scope.input_manger.validateInputGroup(attrs.bbInputGroup);
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestionLabel
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestionLabel
  *
  * <pre>
  * transclude: false,
  * restrict: 'A',
  * scope: false,
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbQuestionLabel', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        return scope.$watch(attrs.bbQuestionLabel, function(question) {
          if (question) {
            if (question.detail_type === "check" || question.detail_type === "check-price") {
              return element.html("");
            }
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestionLink
  * @restrict A
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestionLink
  *
  * <pre>
  * transclude: false,
  * restrict: 'A',
  * scope: true,
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbQuestionLink', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var id;
        id = parseInt(attrs.bbQuestionLink);
        return scope.$watch("question_set", function(newval, oldval) {
          var i, len1, q, ref, results;
          if (newval) {
            ref = scope.question_set;
            results = [];
            for (i = 0, len1 = ref.length; i < len1; i++) {
              q = ref[i];
              if (q.id === id) {
                scope.question = q;
                element.attr('ng-model', "question.answer");
                element.attr('bb-question-link', null);
                results.push($compile(element)(scope));
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbQuestionSet
  * @restrict A
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbQuestionSet
  *
  * <pre>
  * transclude: false,
  * restrict: 'A',
  * scope: true,
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbQuestionSet', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var set;
        set = attrs.bbQuestionSet;
        element.addClass('ng-hide');
        return scope.$watch(set, function(newval, oldval) {
          if (newval) {
            scope.question_set = newval;
            return element.removeClass('ng-hide');
          }
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbMatchInput
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbMatchInput
  *
  * <pre>
  * restrict: "A"
  * require: 'ngModel'
  * </pre>
  *
  * # Has the following set of methods:
  *
  * - link(scope, element, attrs, ctrl, ngModel)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive("bbMatchInput", function() {
    return {
      restrict: "A",
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl, ngModel) {
        var compare;
        scope.$watch(attrs.bbMatchInput, function() {
          scope.val_1 = scope.$eval(attrs.bbMatchInput);
          return compare(ctrl.$viewValue);
        });
        compare = function(value) {
          return ctrl.$setValidity('match', scope.val_1 === value);
        };
        return ctrl.$parsers.push(compare);
      }
    };
  });

}).call(this);
