(function() {
  'use strict';
  var adminbookingapp;

  adminbookingapp = angular.module('BBAdminBooking', ['BB', 'BBAdmin.Services', 'trNgGrid']);

  angular.module('BBAdminBooking').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminBooking.Directives', []);

  angular.module('BBAdminBooking.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdminBooking.Controllers', ['ngLocalData', 'ngSanitize']);

  adminbookingapp.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) {
    return AdminLoginService.checkLogin().then(function() {
      if ($rootScope.user && $rootScope.user.company_id) {
        $rootScope.bb || ($rootScope.bb = {});
        return $rootScope.bb.company_id = $rootScope.user.company_id;
      }
    });
  });

}).call(this);
