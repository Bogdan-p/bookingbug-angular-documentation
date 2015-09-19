
/***
* @ngdoc service
* @name BB.Services:BreadcrumbService
*
* @description
* Factory BreadcrumbService
*
* @returns {Promise} This service has the following set of methods:
*
* - setCurrentStep(step)
* - getCurrentStep()
*
 */

(function() {
  angular.module('BB.Services').factory("BreadcrumbService", function() {
    var current_step;
    current_step = 1;
    return {
      setCurrentStep: function(step) {
        return current_step = step;
      },
      getCurrentStep: function() {
        return current_step;
      }
    };
  });

}).call(this);
