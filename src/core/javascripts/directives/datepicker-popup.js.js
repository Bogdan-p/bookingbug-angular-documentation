
/***
* @ngdoc directive
* @name BB.Directives:bbDatepickerPopup
* @restrict A
*
* @description
* Directive BB.Directives:bbDatepickerPopup
* <br>
* Replaces the date parse method for the angular-ui datepicker popup. The picker
* defaults to US style dates when typing a date into the picker input, so
* 05/09/2014 is translated as 9th May rather than the 5th September
*
* <pre>
* ie8orLess = false
* //stop user typing in input field if using ie8 or less as the date gets a
* //little delyaed and outputs wrong date
* try
*   ie8orLess = window.parseInt(/MSIE\s*(\d)/.exec(window.navigator.userAgent)[1])
* catch e
*   ie8orLess = false
*
* restrict: 'A'
* //set low priority as we want to make sure the 'datepickerPopup' directive
* //runs first
* priority: -1
* require : 'ngModel'
* </pre>
* # Has the following set of methods:
*
* - link(scope, element, attrs, ngModel)
*
* This is the original effort at trying to allow the user to type the date in
* to the input field. It works ok but there are a few bugs relative to setting
* the ngmodel value and it then it dissapears during the digest loop
*
* - getTimeRangeScope(scope)
*
* The date picker is sometimes in a nested controller so we need to find the
*  timerange scope as the 'selected_date' property is assigned directly to
* the scope, which causes inheritance issues.
*
* - $bbug(element).on 'keydown', (e)
*
* The date picker doesn't support the typing in of dates very well, or
* hiding the popup after typing a date.
*
* - callDateHandler (date)
*
* Call the function which handles the date change.
*
* - replacementDateParser(viewValue, returnKey)
*
* @param {service} $parse Converts Angular expression into a function.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$parse more}
*
* @param {service} $document A jQuery or jqLite wrapper for the browser's window.document object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$document more}
*
* @param {service} $timeout Angular's wrapper for window.setTimeout.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$timeout more}
*
* @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
* <br>
* {@link $bbug more}
*
 */

(function() {
  angular.module('BB.Directives').directive('bbDatepickerPopup', function($parse, $document, $timeout, $bbug) {
    var e, error, ie8orLess;
    ie8orLess = false;
    try {
      ie8orLess = window.parseInt(/MSIE\s*(\d)/.exec(window.navigator.userAgent)[1]);
    } catch (error) {
      e = error;
      ie8orLess = false;
    }
    return {
      restrict: 'A',
      priority: -1,
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var callDateHandler, data, dateFormat, f, getTimeRangeScope, getter, origDateParser, replacementDateParser, timeRangeScope, yearNow;
        origDateParser = null;
        data = element.controller('ngModel');
        dateFormat = !!attrs.bbDatepickerPopup ? attrs.bbDatepickerPopup : 'DD/MM/YYYY';
        yearNow = moment(new Date()).year();
        getter = $parse(attrs.ngModel);
        timeRangeScope = scope;
        getTimeRangeScope = function(scope) {
          if (scope) {
            if (scope.controller && scope.controller.indexOf('TimeRangeList') > 0) {
              return timeRangeScope = scope;
            } else {
              return getTimeRangeScope(scope.$parent);
            }
          }
        };
        getTimeRangeScope(scope);
        if (ie8orLess) {
          $bbug(element).on('keydown keyup keypress', function(ev) {
            ev.preventDefault();
            return ev.stopPropagation();
          });
        }
        if (ie8orLess || scope.display.xs) {
          $bbug(element).attr('readonly', 'true');
        }
        $bbug(element).on('keydown', function(e) {
          if (e.keyCode === 13) {
            replacementDateParser($bbug(e.target).val(), true);
            $document.trigger('click');
            return $bbug(element).blur();
          }
        });
        $bbug(element).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return $timeout(function() {
            return scope.opened = true;
          });
        });
        callDateHandler = function(date) {
          var isDate, watch;
          watch = scope.$watch(getter, function(newVal, oldVal) {
            if (!newVal) {
              return getter.assign(timeRangeScope, date);
            }
          });
          $timeout(watch, 0);
          isDate = _.isDate(date);
          if (isDate) {
            getter.assign(timeRangeScope, date);
            ngModel.$setValidity('date', true);
            scope.$eval(attrs.onDateChange);
          }
          return isDate;
        };
        replacementDateParser = function(viewValue, returnKey) {
          var mDate;
          if (callDateHandler(viewValue)) {
            return viewValue;
          }
          if (ie8orLess) {
            return viewValue;
          }
          mDate = moment(viewValue, dateFormat);
          if (!mDate.isValid()) {
            mDate = moment(new Date());
          }
          if (/\/YY$/.test(dateFormat)) {
            dateFormat += 'YY';
          }
          if (mDate.year() === 0) {
            mDate.year(yearNow);
          }
          viewValue = mDate.format('MM/DD/YYYY');
          viewValue = viewValue.replace(/\/00/, '/20');
          if (/\/02\d{2}$/.test(viewValue)) {
            return;
          }
          if (returnKey) {
            if (mDate.year().toString().length === 2) {
              mDate.year(mDate.year() + 2000);
            }
            return callDateHandler(mDate._d);
          } else {
            return origDateParser.call(this, viewValue);
          }
        };
        f = function() {
          if (_.isFunction(data.$parsers[0])) {
            origDateParser = data.$parsers[0];
            data.$parsers[0] = replacementDateParser;
          } else {
            return setTimeout(f, 10);
          }
        };
        return f();
      }
    };
  });

}).call(this);
