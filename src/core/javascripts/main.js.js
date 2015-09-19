(function() {
  'use strict';
  var app;

  app = angular.module('BB', ['BB.Controllers', 'BB.Filters', 'BB.Models', 'BB.Services', 'BB.Directives', 'ngStorage', 'angular-hal', 'ui.bootstrap', 'ngSanitize', 'ui.map', 'ui.router.util', 'ngLocalData', 'ngAnimate', 'angular-data.DSCacheFactory', 'angularFileUpload', 'schemaForm', 'ngStorage', 'uiGmapgoogle-maps', 'angular.filter', 'ui-rangeSlider', 'ngCookies', 'slick', 'pascalprecht.translate', 'vcRecaptcha']);


  /***
  * @ngdoc object
  * @name AppConfig
  *
  * @description
  * Use this to inject application wide settings around the app.
  *
  * <pre>
  * app.value('AppConfig', {
  *   appId: 'f6b16c23',
  *   appKey: 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
  * })
  * </pre>
   */

  app.value('AppConfig', {
    appId: 'f6b16c23',
    appKey: 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
  });


  /***
  * @ngdoc object
  * @name $bbug
  *
  * @description
  * Releases the hold on the $ shortcut identifier, so that other scripts can use it.
   */

  if (window.use_no_conflict) {
    window.bbjq = $.noConflict();
    app.value('$bbug', jQuery.noConflict(true));
  } else {
    app.value('$bbug', jQuery);
  }


  /***
  * @ngdoc object
  * @name UriTemplate
  *
  * @description
  * UriTemplate is injectable as constant
  *
   */

  app.constant('UriTemplate', window.UriTemplate);

  app.config(function($locationProvider, $httpProvider, $provide, ie8HttpBackendProvider) {
    var int, lowercase, msie;
    $httpProvider.defaults.headers.common = {
      'App-Id': 'f6b16c23',
      'App-Key': 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
    };
    $locationProvider.html5Mode(false).hashPrefix('!');
    int = function(str) {
      return parseInt(str, 10);
    };
    lowercase = function(string) {
      if (angular.isString(string)) {
        return string.toLowerCase();
      } else {
        return string;
      }
    };
    msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
    if (isNaN(msie)) {
      msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
    }
    if (msie && msie < 10) {
      return $provide.provider({
        $httpBackend: ie8HttpBackendProvider
      });
    }
  });

  app.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig) {
    $rootScope.$log = $log;
    $rootScope.$setIfUndefined = FormDataStoreService.setIfUndefined;
    $rootScope.bb || ($rootScope.bb = {});
    $rootScope.bb.api_url = $sessionStorage.getItem("host");
    if ($bbug.support.opacity === false) {
      document.createElement('header');
      document.createElement('nav');
      document.createElement('section');
      return document.createElement('footer');
    }
  });

  angular.module('BB.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BB.Controllers', ['ngLocalData', 'ngSanitize']);

  angular.module('BB.Directives', []);

  angular.module('BB.Filters', []);

  angular.module('BB.Models', []);

  window.bookingbug = {
    logout: function(options) {
      var logout_opts;
      options || (options = {});
      if (options.reload !== false) {
        options.reload = true;
      }
      logout_opts = {
        app_id: 'f6b16c23',
        app_key: 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
      };
      if (options.root) {
        logout_opts.root = options.root;
      }
      angular.injector(['BB.Services', 'BB.Models', 'ng']).get('LoginService').logout(logout_opts);
      if (options.reload) {
        return window.location.reload();
      }
    }
  };

}).call(this);
