(function() {
  'use strict';
  angular.module('BBAdminServices', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid', 'ui.calendar']);

  angular.module('BBAdminServices').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminServicesMockE2E', ['BBAdminServices', 'BBAdminMockE2E']);

}).call(this);
