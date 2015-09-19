(function() {
  'use strict';
  angular.module('BBMember', ['BB', 'BBMember.Directives', 'BBMember.Services', 'BBMember.Filters', 'BBMember.Controllers', 'BBMember.Models', 'trNgGrid', 'pascalprecht.translate']);

  angular.module('BBMember').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBMember').run(function() {
    return TrNgGrid.defaultColumnOptions = {
      enableFiltering: false
    };
  });

  angular.module('BBMember.Directives', []);

  angular.module('BBMember.Filters', []);

  angular.module('BBMember.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBMember.Controllers', ['ngLocalData', 'ngSanitize']);

  angular.module('BBMember.Models', []);

  angular.module('BBMemberMockE2E', ['BBMember', 'BBAdminMockE2E']);

}).call(this);
