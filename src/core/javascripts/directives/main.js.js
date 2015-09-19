(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');


  /***
  * @ngdoc directive
  * @name BB.Directives:bbContent
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbContent
  *
  * <pre>
  * transclude: false,
  * restrict: 'A',
  * </pre>
  *
  * Has the following set of methods:
  * - link: (scope, element, attrs)
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbContent', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.attr('ng-include', "bb_main");
        element.attr('onLoad', "initPage()");
        element.attr('bb-content', null);
        element.attr('ng-hide', "hide_page");
        scope.initPage = (function(_this) {
          return function() {
            scope.setPageLoaded();
            return scope.setLoadingPage(false);
          };
        })(this);
        return $compile(element)(scope);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbLoading
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbLoading
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbLoading', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.scopeLoaded = scope.areScopesLoaded(scope);
        element.attr('ng-hide', "scopeLoaded");
        element.attr('bb-loading', null);
        $compile(element)(scope);
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbWaitFor
  * @restrict A
  * @priority 800
  *
  * @description
  * Directive BB.Directives:bbWaitFor
  *
  * @param {service} $compile Compiles an HTML string or DOM into a template and produces a template function, which can then be used to link scope and the template together.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$compile more}
  *
   */

  app.directive('bbWaitFor', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      priority: 800,
      link: function(scope, element, attrs) {
        var name, prom;
        name = attrs.bbWaitVar;
        name || (name = "allDone");
        scope[name] = false;
        prom = scope.$eval(attrs.bbWaitFor);
        prom.then(function() {
          return scope[name] = true;
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbScrollTo
  * @restrict A
  *
  * @description
  * Directive BB.Directives:bbScrollTo
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {object} AppConfig Use this to inject application wide settings around the app
  * <br>
  * {@link AppConfig more}
   */

  app.directive('bbScrollTo', function($rootScope, AppConfig, BreadcrumbService, $bbug, $window, SettingsService) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        var always_scroll, bb_transition_time, evnts, scrollToCallback;
        evnts = attrs.bbScrollTo.split(',');
        always_scroll = (attrs.bbAlwaysScroll != null) || false;
        bb_transition_time = attrs.bbTransitionTime != null ? parseInt(attrs.bbTransitionTime, 10) : 500;
        if (angular.isArray(evnts)) {
          angular.forEach(evnts, function(evnt) {
            return scope.$on(evnt, function(e) {
              return scrollToCallback(evnt);
            });
          });
        } else {
          scope.$on(evnts, function(e) {
            return scrollToCallback(evnts);
          });
        }
        return scrollToCallback = function(evnt) {
          var current_step, scroll_to_element;
          if (evnt === "page:loaded" && scope.display && scope.display.xs && $bbug('[data-scroll-id="' + AppConfig.uid + '"]').length) {
            scroll_to_element = $bbug('[data-scroll-id="' + AppConfig.uid + '"]');
          } else {
            scroll_to_element = $bbug(element);
          }
          current_step = BreadcrumbService.getCurrentStep();
          if (scroll_to_element) {
            if ((evnt === "page:loaded" && current_step > 1) || always_scroll || (evnt === "widget:restart") || (!scroll_to_element.is(':visible') && scroll_to_element.offset().top !== 0)) {
              if ('parentIFrame' in $window) {
                return parentIFrame.scrollToOffset(0, scroll_to_element.offset().top - SettingsService.getScrollOffset());
              } else {
                return $bbug("html, body").animate({
                  scrollTop: scroll_to_element.offset().top
                }, bb_transition_time);
              }
            }
          }
        };
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbSlotGrouper
  * @restrict A
  *
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbSlotGrouper
  *
  * <pre>
  * restrict: 'A',
  * scope: true,
  * </pre>
  *
  * Has the following set of methods:
  * - link: (scope, element, attrs)
  *
   */

  app.directive('bbSlotGrouper', function() {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var i, len, slot, slots;
        slots = scope.$eval(attrs.slots);
        if (!slots) {
          return;
        }
        scope.grouped_slots = [];
        for (i = 0, len = slots.length; i < len; i++) {
          slot = slots[i];
          if (slot.time >= scope.$eval(attrs.startTime) && slot.time < scope.$eval(attrs.endTime)) {
            scope.grouped_slots.push(slot);
          }
        }
        return scope.has_slots = scope.grouped_slots.length > 0;
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbForm
  * @restrict A
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbForm
  *
  * <pre>
  * restrict: 'A',
  * require: '^form',
  * </pre>
  *
  * Has the following set of methods:
  * - link: (scope, elem, attrs, ctrls)
  *
  * @requires $bbug
  * @requires $windows
  * @requires BB.Services:SettingsService
  *
   */

  app.directive('bbForm', function($bbug, $window, SettingsService) {
    return {
      restrict: 'A',
      require: '^form',
      link: function(scope, elem, attrs, ctrls) {
        return elem.on("submit", function() {
          var invalid_form_group, invalid_input;
          invalid_form_group = elem.find('.has-error:first');
          if (invalid_form_group && invalid_form_group.length > 0) {
            if ('parentIFrame' in $window) {
              parentIFrame.scrollToOffset(0, invalid_form_group.offset().top - SettingsService.getScrollOffset());
            } else {
              $bbug("html, body").animate({
                scrollTop: invalid_form_group.offset().top
              }, 1000);
            }
            invalid_input = invalid_form_group.find('.ng-invalid');
            invalid_input.focus();
            return false;
          }
          return true;
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbAddressMap
  * @restrict A
  *
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbAddressMap
  *
  * <pre>
  * restrict: 'A',
  * scope: true,
  * </pre>
  *
  * Has the following set of methods:
  * - controller: ($scope, $element, $attrs)
  *
  * @requires $document
  *
   */

  app.directive('bbAddressMap', function($document) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      controller: function($scope, $element, $attrs) {
        $scope.isDraggable = $document.width() > 480;
        return $scope.$watch($attrs.bbAddressMap, function(new_val, old_val) {
          var map_item;
          if (!new_val) {
            return;
          }
          map_item = new_val;
          $scope.map = {
            center: {
              latitude: map_item.lat,
              longitude: map_item.long
            },
            zoom: 15
          };
          $scope.options = {
            scrollwheel: false,
            draggable: $scope.isDraggable
          };
          return $scope.marker = {
            id: 0,
            coords: {
              latitude: map_item.lat,
              longitude: map_item.long
            }
          };
        });
      }
    };
  });


  /***
  * @ngdoc directive
  * @name BB.Directives:bbMergeDuplicateQuestions
  * @restrict A
  *
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  *
  * Directive BB.Directives:bbMergeDuplicateQuestions
  *
  * <pre>
  * restrict: 'A',
  * scope: true,
  * </pre>
  *
  * Has the following set of methods:
  * - controller: ($scope, $rootScope)
  *
   */

  angular.module('BB.Directives').directive('bbMergeDuplicateQuestions', function() {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope, $rootScope) {
        debugger;
        var i, item, j, len, len1, question, questions, ref, ref1;
        questions = {};
        ref = $scope.bb.stacked_items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.item_details && item.item_details.questions) {
            item.item_details.hide_questions = false;
            ref1 = item.item_details.questions;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              question = ref1[j];
              if (questions[question.id]) {
                item.setCloneAnswers(questions[question.id].item);
                item.item_details.hide_questions = true;
                break;
              } else {
                questions[question.id] = {
                  question: question,
                  item: item
                };
              }
            }
          }
        }
        return $scope.has_questions = _.pluck(questions, 'question').length > 0;
      }
    };
  });

}).call(this);
