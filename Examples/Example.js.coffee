###**
* @ngdoc service [directive,]
* @name myName
*
* @description
* Factory AdminBookingService
*
********************************************************************************
* $rootScopeCMT
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
********************************************************************************
*$scopeCMT
* @param {service} $scope Scope is an object that refers to the application mode.
* <br>
* {@link https://docs.angularjs.org/guide/scope more}
*
********************************************************************************
*$windowCMT
* @param {service} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window more}
*
********************************************************************************
*$qCMT
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
*******************************************************************************
*$timeoutCMT
* @param {service} $timeout Angular's wrapper for window.setTimeout.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$timeout more}
*
*******************************************************************************
* $filterCMT
* @param {service} $filter Filters are used for formatting data displayed to the user.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$filter more}
*
*******************************************************************************
* @param {service} $sce $sce is a service that provides Strict Contextual Escaping services to AngularJS.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$sce more}
*
*******************************************************************************
* @param {service} $parse Converts Angular expression into a function.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$parse more}
*

===== $modal =====
* @param {service} $modal is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.
* <br>
* {@link https://github.com/angular-ui/bootstrap/tree/master/src/modal/docs more}
*
===== $log =====
* @param {service} $log Simple service for logging.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$log more}
*
===== $templateCache =====
* @param {service} $templateCache $templateCache
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$templateCachee more}
*
===== $location =====
* @param {service} $location The $location service parses the URL in the browser address bar
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$location more}
*
===== $injector =====
* @param {service} $injector $injector is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.
* <br>
* {@link https://docs.angularjs.org/api/auto/service/$injector more}
*
===== $cookies =====
* @param {service} $cookies Provides read/write access to browser's cookies.
* <br>
* {@link https://docs.angularjs.org/api/ngCookies/service/$cookies more}
*

*********************************************************************************
* Unknown TO ME !!!!!!!!!!!!!!!
*********************************************************************************



===== UriTemplate =====
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
===== ClientCollections =====
* @param {model} ClientCollections Info
*
===== BBModel =====
===== BBModelCMT =====
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
===== BaseModel =====
* @param {model} BaseModel Info
* <br>
* {@link BB.Models:BaseModel more}
*
===== $sessionStorage =====
* @param {object} $sessionStorage Info
*
===== AdminBookingService =====
* @param {service} AdminBookingService Model
* <br>
* {@link BBAdmin.Services:AdminBookingService more}
*
===== BookableItemModel =====
* @param {model} BookableItemModel Info
* <br>
* {@link BB.Models:BookableItemModel more}
*
===== $bbug =====
* @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
* <br>
* {@link $bbug more}
*
* ===== Dialog =====
* @param {service} Dialog Info
* <br>
* {@link BB.Services:Dialog more}
*
* ===== QuestionService =====
* @param {service} QuestionService Info
* <br>
* {@link BB.Services:QuestionService more}
*
* ===== QueryStringService =====
* @param {service} QueryStringService Info
* <br>
* {@link BB.Services:QueryStringService more}
*
###


###=================================== MODEL Example ===================================
###**
* @ngdoc service
* @name BB.Models:MyCoreModel
*
* @description
* This is MyCoreModel in BB.Models module that creates MyCoreModel object.
*
* <pre>
* //Creates class MyCoreModel that extends BaseModel
* class MyClMyCoreModelass extends BaseModel
* </pre>
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {model} BaseModel Info
* <br>
* {@link BB.Models:BaseModel more}
*
* @returns {object} Newly created MyCoreModel object with the following set of methods:
*
###

###=================================== SERVICE Example ===================================

###**
* @ngdoc service
* @name BBAdmin.Services:CommentService
*
* @description
* Factory AddressListService
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
*
###

###=================================== DIRECTIVE Example ===================================
###**
* @ngdoc directive
* @name MyDirective
* @restrict A
* @replace true
* @scope true
*
* @description
* Directive BB.Directives:MyDirective
*
* <pre>
* // Example usage
* <div bb-basket></div>
* <div bb-basket mini></div>
* </pre>
*
* @param {service} PathSvc Info
* <br>
* {@link BB.Services:PathSvc more}
*
###
