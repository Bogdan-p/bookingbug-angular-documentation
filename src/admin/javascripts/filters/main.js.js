(function() {
  'use strict';
  var bbAdminFilters;

  bbAdminFilters = angular.module('BBAdmin.Filters', []);


  /***
  * @ngdoc filter
  * @name BBAdmin.Filters:rag
  *
  * @description
  * bbAdminFilters.Filters.rag
  * <br>
  * if value <= v1 then return red
  * <br>
  * if value <= v2 then return amber
  * <br>
  * if value <= v3 then return green
  * @return {String} [red, amber, green]
  *
   */

  bbAdminFilters.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });


  /***
  * @ngdoc filter
  * @name BBAdmin.Filters:gar
  *
  * @description
  * <br> ---------------------------------------------------------------------------------
  * <br> NOTE
  * <br> This is the TEST file.
  * <br> Formatting of the documentation for this kind of functionality should be done first here
  * <br> !To avoid repetition and to mentain consistency.
  * <br> After the documentation for TEST file it is defined other files that have the same pattern can be also documented
  * <br> This should be the file that sets the STANDARD.
  * <br> ---------------------------------------------------------------------------------<br>
  * bbAdminFilters.Filters.gar
  * <br>
  * if value <= v1 then return green
  * <br>
  * if value <= v2 then return amber
  * <br>
  * if value <= v3 then return red
  * @return {String} [green, amber, red]
  *
   */

  bbAdminFilters.filter('gar', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "green";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "red";
      }
    };
  });


  /***
  * @ngdoc filter
  * @name BBAdmin.Filters:time
  *
  * @description
  * bbAdminFilters.Filters.time
  *
  * @param {$window} param1 this is the first param
  * @return {Date} Write formatted data to a string
  * <br>
  * $window.sprintf("%02d:%02d",Math.floor(v / 60), v%60 )
   */

  bbAdminFilters.filter('time', function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  });

}).call(this);
