
/***
* @ngdoc service
* @name BB.Services:SettingsService
*
* @description
* Factory SettingsService
*
@returns {Promise} This service has the following set of methods:
*
* - enableInternationalizaton()
* - isInternationalizatonEnabled()
* - setScrollOffset()
* - getScrollOffset()
*
 */

(function() {
  angular.module('BB.Services').factory('SettingsService', function() {
    var i18n, scroll_offset;
    i18n = false;
    scroll_offset = 0;
    return {
      enableInternationalizaton: function() {
        return i18n = true;
      },
      isInternationalizatonEnabled: function() {
        return i18n;
      },
      setScrollOffset: function(value) {
        return scroll_offset = parseInt(value);
      },
      getScrollOffset: function() {
        return scroll_offset;
      }
    };
  });

}).call(this);
