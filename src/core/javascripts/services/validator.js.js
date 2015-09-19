
/***
* @ngdoc service
* @name BB.Services:ValidatorService
*
* @description
* Factory ValidatorService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {service} AlertService Info
* <br>
* {@link BB.Services:AlertService more}
*
* @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
* <br>
* {@link $bbug more}
*
* @param {service} ErrorService Info
* <br>
* {@link BB.Services:ErrorService more}
*
* @returns {Promise} This service has the following set of methods:
*
* - getUKPostcodePattern()
* - getNumberOnlyPattern()
* - getAlphaNumbericPattern()
* - getUKMobilePattern(strict = false)
* - getMobilePattern()
* - getUKLandlinePattern(strict = false)
* - getIntPhonePattern()
* - getGeocodeResult()
* - validatePostcode(form, prms)
* - validateForm(form)
* - resetForm(form)
* - resetForms(forms)
*
 */

(function() {
  angular.module('BB.Services').factory('ValidatorService', function($rootScope, AlertService, ErrorService, BBModel, $q, $bbug) {
    var alphanumeric, geocode_result, international_number, mobile_regex_lenient, number_only_regex, uk_landline_regex_lenient, uk_landline_regex_strict, uk_mobile_regex_strict, uk_postcode_regex, uk_postcode_regex_lenient;
    uk_postcode_regex = /^(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,1}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))$/i;
    uk_postcode_regex_lenient = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i;
    number_only_regex = /^\d+$/;
    uk_mobile_regex_strict = /^((\+44\s?|0)7([45789]\d{2}|624)\s?\d{3}\s?\d{3})$/;
    mobile_regex_lenient = /^(0|\+)([\d \(\)]{9,19})$/;
    uk_landline_regex_strict = /^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
    uk_landline_regex_lenient = /^(0|\+)([\d \(\)]{9,19})$/;
    international_number = /^(\+)([\d \(\)]{9,19})$/;
    alphanumeric = /^[a-zA-Z0-9]*$/;
    geocode_result = null;
    return {
      alpha: /^[a-zA-Z\s]*$/,
      us_phone_number: /(^[\d \(\)-]{9,16})$/,
      getUKPostcodePattern: function() {
        return uk_postcode_regex_lenient;
      },
      getNumberOnlyPattern: function() {
        return number_only_regex;
      },
      getAlphaNumbericPattern: function() {
        return alphanumeric;
      },
      getUKMobilePattern: function(strict) {
        if (strict == null) {
          strict = false;
        }
        if (strict) {
          return uk_mobile_regex_strict;
        }
        return mobile_regex_lenient;
      },
      getMobilePattern: function() {
        return mobile_regex_lenient;
      },
      getUKLandlinePattern: function(strict) {
        if (strict == null) {
          strict = false;
        }
        if (strict) {
          return uk_landline_regex_strict;
        }
        return uk_landline_regex_lenient;
      },
      getIntPhonePattern: function() {
        return international_number;
      },
      getGeocodeResult: function() {
        if (geocode_result) {
          return geocode_result;
        }
      },
      validatePostcode: function(form, prms) {
        var deferred, geocoder, ne, postcode, req, sw;
        AlertService.clear();
        if (!form || !form.postcode) {
          return false;
        }
        if (form.$error.required) {
          AlertService.danger(ErrorService.getError('MISSING_POSTCODE'));
          return false;
        } else if (form.$error.pattern) {
          AlertService.danger(ErrorService.getError('INVALID_POSTCODE'));
          return false;
        } else {
          deferred = $q.defer();
          postcode = form.postcode.$viewValue;
          req = {
            address: postcode
          };
          if (prms.region) {
            req.region = prms.region;
          }
          req.componentRestrictions = {
            'postalCode': req.address
          };
          if (prms.bounds) {
            sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y);
            ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y);
            req.bounds = new google.maps.LatLngBounds(sw, ne);
          }
          geocoder = new google.maps.Geocoder();
          geocoder.geocode(req, function(results, status) {
            if (results.length === 1 && status === 'OK') {
              geocode_result = results[0];
              return deferred.resolve(true);
            } else {
              AlertService.danger(ErrorService.getError('INVALID_POSTCODE'));
              $rootScope.$apply();
              return deferred.reject(false);
            }
          });
          return deferred.promise;
        }
      },
      validateForm: function(form) {
        if (!form) {
          return false;
        }
        form.submitted = true;
        if (form.$invalid && form.raise_alerts && form.alert) {
          AlertService.danger(form.alert);
          return false;
        } else if (form.$invalid && form.raise_alerts) {
          AlertService.danger(ErrorService.getError('FORM_INVALID'));
          return false;
        } else if (form.$invalid) {
          return false;
        } else {
          return true;
        }
      },
      resetForm: function(form) {
        if (form) {
          form.submitted = false;
          return form.$setPristine();
        }
      },
      resetForms: function(forms) {
        var form, i, len, results1;
        if (forms && $bbug.isArray(forms)) {
          results1 = [];
          for (i = 0, len = forms.length; i < len; i++) {
            form = forms[i];
            form.submitted = false;
            results1.push(form.$setPristine());
          }
          return results1;
        }
      }
    };
  });

}).call(this);
