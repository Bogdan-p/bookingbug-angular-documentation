(function() {
  'use strict';
  var queueapp;

  queueapp = angular.module('BBQueue', ['BB', 'BBAdmin.Services', 'BBAdmin.Directives', 'BBQueue.Services', 'BBQueue.Directives', 'BBQueue.Controllers', 'trNgGrid', 'ngDragDrop', 'pusher-angular']);

  angular.module('BBQueue.Directives', ['timer']);

  angular.module('BBQueue.Controllers', []);

  angular.module('BBQueue.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBQueueMockE2E', ['BBQueue', 'BBAdminMockE2E']);

  queueapp.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) {});

}).call(this);
