(function() {
  'use strict';
  var adminbookingapp;

  adminbookingapp = angular.module('BBAdminDashboard', ['trNgGrid', 'BBAdmin', 'BBAdminServices', 'ui.calendar', 'ngStorage', 'BBAdminBooking']);

  angular.module('BBAdminDashboard').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminDashboard.Directives', []);

  angular.module('BBAdminDashboard.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdminDashboard.Controllers', ['ngLocalData', 'ngSanitize']);

}).call(this);
