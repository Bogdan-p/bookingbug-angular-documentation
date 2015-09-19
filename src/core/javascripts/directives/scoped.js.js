
/***
* @ngdoc directive
* @name BB.Directives:scoped
* @restrict A
*
* @description
* {@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BB.Directives:scoped
*
* <pre>
* restrict: 'A'
* </pre>
*
* Has the following set of methods:
*
* - scopeIt(element)
* - link(scope, element, attrs)
* - controller($scope, $element, $timeout)
*
* @param {service} $document A jQuery or jqLite wrapper for the browser's window.document object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$document more}
*
* @param {service} $timeout Angular's wrapper for window.setTimeout.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$timeout more}
*
*
 */

(function() {
  angular.module("BB.Directives").directive('scoped', function($document, $timeout) {
    var scopeIt;
    this.compat = (function() {
      var DOMRules, DOMStyle, changeSelectorTextAllowed, check, e, error, scopeSupported, testSheet, testStyle;
      check = document.createElement('style');
      if (typeof check.sheet !== 'undefined') {
        DOMStyle = 'sheet';
      } else if (typeof check.getSheet !== 'undefined') {
        DOMStyle = 'getSheet';
      } else {
        DOMStyle = 'styleSheet';
      }
      scopeSupported = void 0 !== check.scoped;
      document.body.appendChild(check);
      testSheet = check[DOMStyle];
      if (testSheet.addRule) {
        testSheet.addRule('c', 'blink');
      } else {
        testSheet.insertRule('c{}', 0);
      }
      DOMRules = testSheet.rules ? 'rules' : 'cssRules';
      testStyle = testSheet[DOMRules][0];
      try {
        testStyle.selectorText = 'd';
      } catch (error) {
        e = error;
      }
      changeSelectorTextAllowed = 'd' === testStyle.selectorText.toLowerCase();
      check.parentNode.removeChild(check);
      return {
        scopeSupported: scopeSupported,
        rules: DOMRules,
        sheet: DOMStyle,
        changeSelectorTextAllowed: changeSelectorTextAllowed
      };
    })();
    scopeIt = (function(_this) {
      return function(element) {
        var allRules, glue, id, idCounter, index, par, results, rule, selector, sheet, styleNode, styleRule;
        styleNode = element[0];
        idCounter = 0;
        sheet = styleNode[_this.compat.sheet];
        if (!sheet) {
          return;
        }
        allRules = sheet[_this.compat.rules];
        par = styleNode.parentNode;
        id = par.id || (par.id = 'scopedByScopedPolyfill_' + ++idCounter);
        glue = '';
        index = allRules.length || 0;
        while (par) {
          if (par.id) {
            glue = '#' + par.id + ' ' + glue;
          }
          par = par.parentNode;
        }
        results = [];
        while (index--) {
          rule = allRules[index];
          if (rule.selectorText) {
            if (!rule.selectorText.match(new RegExp(glue))) {
              selector = glue + ' ' + rule.selectorText.split(',').join(', ' + glue);
              selector = selector.replace(/[\ ]+:root/gi, '');
              if (_this.compat.changeSelectorTextAllowed) {
                results.push(rule.selectorText = selector);
              } else {
                if (!rule.type || 1 === rule.type) {
                  styleRule = rule.style.cssText;
                  if (styleRule) {
                    if (sheet.removeRule) {
                      sheet.removeRule(index);
                    } else {
                      sheet.deleteRule(index);
                    }
                    if (sheet.addRule) {
                      results.push(sheet.addRule(selector, styleRule));
                    } else {
                      results.push(sheet.insertRule(selector + '{' + styleRule + '}', index));
                    }
                  } else {
                    results.push(void 0);
                  }
                } else {
                  results.push(void 0);
                }
              }
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this);
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.scopeSupported = this.compat.scopeSupported;
        if (!this.compat.scopeSupported) {
          return $timeout(function() {
            return scopeIt(element);
          });
        }
      },
      controller: function($scope, $element, $timeout) {
        if (!$scope.scopeSupported) {
          this.updateCss = function() {
            return $timeout(function() {
              return scopeIt($element);
            });
          };
        }
      }
    };
  });

}).call(this);
