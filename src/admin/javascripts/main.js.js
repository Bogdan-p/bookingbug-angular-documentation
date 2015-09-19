(function() {
  'use strict';
  var adminapp;

  adminapp = angular.module('BBAdmin', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid']);

  angular.module('BBAdmin').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdmin.Directives', []);

  angular.module('BBAdmin.Filters', []);

  angular.module('BBAdmin.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdmin.Controllers', ['ngLocalData', 'ngSanitize']);

  adminapp.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) {
    return AdminLoginService.checkLogin().then(function() {
      if ($rootScope.user && $rootScope.user.company_id) {
        $rootScope.bb || ($rootScope.bb = {});
        return $rootScope.bb.company_id = $rootScope.user.company_id;
      }
    });
  });

}).call(this);
