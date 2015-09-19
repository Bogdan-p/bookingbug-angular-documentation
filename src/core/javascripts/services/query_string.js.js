
/***
* @ngdoc service
* @name BB.Services:QueryStringService
*
* @description
* Factory QueryStringService
*
* @param {service} $timeout Angular's wrapper for window.setTimeout.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$timeout more}
*
* @returns {Promise} This service has the following set of methods:
*
* - isNum(num)
*
 */

(function() {
  angular.module('BB.Services').factory('QueryStringService', function($window) {
    return function(keyName) {
      var hash, hashes, href, i, isNum, len, val, varObj;
      varObj = {};
      href = $window.location.href;
      if (href.indexOf('?') < 0) {
        return;
      }
      hashes = href.slice(href.indexOf('?') + 1).split(/[#&]/);
      isNum = function(num) {
        if (num == null) {
          return;
        }
        if (num.substr(0, 1) === '0') {
          return;
        }
        if (/[a-zA-Z\-\_\+\.\#\%\*\,]/.test(num)) {
          return;
        }
        if (window.isNaN(window.parseInt(num, 10))) {
          return;
        }
        return true;
      };
      for (i = 0, len = hashes.length; i < len; i++) {
        hash = hashes[i];
        hash = hash.split('=');
        val = hash[1];
        if (isNum(val)) {
          val = window.parseInt(val, 10);
        } else {
          if (val === 'true') {
            val = true;
          } else if (val === 'false') {
            val = false;
          } else {
            val = window.decodeURIComponent(val);
          }
        }
        varObj[hash[0]] = val;
      }
      if (keyName) {
        return varObj[keyName];
      }
      return varObj;
    };
  });

}).call(this);
