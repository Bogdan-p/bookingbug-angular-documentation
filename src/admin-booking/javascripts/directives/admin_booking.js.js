
/***
* @ndgoc directive
* @name BBAdminBooking.Directives:bbAdminBooking
*
* @description
*{@link https://docs.angularjs.org/guide/directive more about Directives}
*
* Directive BBAdminBooking.Directives:bbAdminBooking
*
* # Has the following set of methods:
*
* - getTemplate(template)
* - renderTemplate(scope, element, design_mode, template)
* - link(scope, element, attrs) 
*
* @requires BBAdmin.Services:AdminCompanyService
* @requires $log
* @requires $compile
* @requires $q
* @requires BB.Services:PathSvc
* @requires $templateCache
* @requires $http
*
 */

(function() {
  angular.module('BBAdminBooking').directive('bbAdminBooking', function(AdminCompanyService, $log, $compile, $q, PathSvc, $templateCache, $http) {
    var getTemplate, link, renderTemplate;
    getTemplate = function(template) {
      var fromTemplateCache, partial, src;
      partial = template ? template : 'main';
      fromTemplateCache = $templateCache.get(partial);
      if (fromTemplateCache) {
        return fromTemplateCache;
      } else {
        src = PathSvc.directivePartial(partial).$$unwrapTrustedValue();
        return $http.get(src, {
          cache: $templateCache
        }).then(function(response) {
          return response.data;
        });
      }
    };
    renderTemplate = function(scope, element, design_mode, template) {
      return $q.when(getTemplate(template)).then(function(template) {
        element.html(template).show();
        if (design_mode) {
          element.append('<style widget_css scoped></style>');
        }
        return $compile(element.contents())(scope);
      });
    };
    link = function(scope, element, attrs) {
      var config;
      config = scope.$eval(attrs.bbAdminBooking);
      config || (config = {});
      config.admin = true;
      if (!attrs.companyId) {
        if (config.company_id) {
          attrs.companyId = config.company_id;
        } else if (scope.company) {
          attrs.companyId = scope.company.id;
        }
      }
      if (attrs.companyId) {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          scope.initWidget(config);
          return renderTemplate(scope, element, config.design_mode, config.template);
        });
      }
    };
    return {
      link: link,
      controller: 'BBCtrl'
    };
  });

}).call(this);
