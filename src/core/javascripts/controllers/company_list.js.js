(function() {
  'use strict';

  /***
  * @ngdoc controller
  * @name public.Controllers:CompanyList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller CompanyList
  *
  * # Has the following set of methods:
  *
  * - $scope.init(comp)
  * - $scope.selectItem(item, route)
  * - $scope.splitString(company)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires $q
  * @requires $attrs
  *
   */
  var CompanyListBase;

  CompanyListBase = function($scope, $rootScope, $q, $attrs) {
    var options;
    $scope.controller = "public.controllers.CompanyList";
    $scope.notLoaded($scope);
    options = $scope.$eval($attrs.bbCompanies);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company.companies) {
          $scope.init($scope.bb.company);
          $rootScope.parent_id = $scope.bb.company.id;
        } else if ($rootScope.parent_id) {
          $scope.initWidget({
            company_id: $rootScope.parent_id,
            first_page: $scope.bb.current_page
          });
          return;
        }
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = (function(_this) {
      return function(comp) {
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        if ($scope.companies.length === 1) {
          $scope.selectItem($scope.companies[0]);
        } else {
          if (options && options.hide_not_live_stores) {
            $scope.items = $scope.companies.filter(function(c) {
              return c.live;
            });
          } else {
            $scope.items = $scope.companies;
          }
        }
        return $scope.setLoaded($scope);
      };
    })(this);
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        var prms;
        $scope.notLoaded($scope);
        prms = {
          company_id: item.id
        };
        return $scope.initWidget(prms);
      };
    })(this);
    return $scope.splitString = function(company) {
      var arr, result;
      arr = company.name.split(' ');
      return result = arr[2] ? arr[2] : "";
    };
  };


  /***
  * @ngdoc directive
  * @name BB.Directives:bbCompanies
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbCompanies
  *
  * See Controller {@link BB.Controllers:CompanyList CompanyList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'CompanyList'
  * </pre>
  *
   */

  angular.module('BB.Directives').directive('bbCompanies', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'CompanyList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:CompanyList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller CompanyList
  *
  * # Has the following set of methods:
  *
   */

  angular.module('BB.Controllers').controller('CompanyList', CompanyListBase);


  /***
  * @ngdoc directive
  * @name BB.Directives:bbPostcodeLookup
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:CompanyList
  *
  * See Controller {@link BB.Controllers:PostcodeLookup PostcodeLookup}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'PostcodeLookup'
  * </pre>
  *
   */

  angular.module('BB.Directives').directive('bbPostcodeLookup', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PostcodeLookup'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:PostcodeLookup
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PostcodeLookup
  *
  * # Has the following set of methods:
  *
  * - $scope.getNearestCompany({center})
  * - $scope.searchPostcode(form, prms)
  *
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {service} ValidatorService Info
  * <br>
  * {@link BB.Services:ValidatorService more}
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {service} $attrs Info
  *
   */

  angular.module('BB.Controllers').controller('PostcodeLookup', function($scope, $rootScope, $q, ValidatorService, AlertService, $attrs) {
    $scope.controller = "PostcodeLookup";
    angular.extend(this, new CompanyListBase($scope, $rootScope, $q, $attrs));
    $scope.validator = ValidatorService;
    $scope.searchPostcode = (function(_this) {
      return function(form, prms) {
        var promise;
        $scope.notLoaded($scope);
        promise = ValidatorService.validatePostcode(form, prms);
        if (promise) {
          return promise.then(function() {
            var loc;
            $scope.bb.postcode = ValidatorService.getGeocodeResult().address_components[0].short_name;
            $scope.postcode = $scope.bb.postcode;
            loc = ValidatorService.getGeocodeResult().geometry.location;
            return $scope.selectItem($scope.getNearestCompany({
              center: loc
            }));
          }, function(err) {
            return $scope.setLoaded($scope);
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    return $scope.getNearestCompany = (function(_this) {
      return function(arg) {
        var R, a, c, center, chLat, chLon, company, d, dLat, dLon, distances, i, lat1, lat2, latlong, len, lon1, lon2, pi, rLat1, rLat2, ref;
        center = arg.center;
        pi = Math.PI;
        R = 6371;
        distances = [];
        lat1 = center.lat();
        lon1 = center.lng();
        ref = $scope.items;
        for (i = 0, len = ref.length; i < len; i++) {
          company = ref[i];
          if (company.address.lat && company.address.long && company.live) {
            latlong = new google.maps.LatLng(company.address.lat, company.address.long);
            lat2 = latlong.lat();
            lon2 = latlong.lng();
            chLat = lat2 - lat1;
            chLon = lon2 - lon1;
            dLat = chLat * (pi / 180);
            dLon = chLon * (pi / 180);
            rLat1 = lat1 * (pi / 180);
            rLat2 = lat2 * (pi / 180);
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
            company.distance = d;
            distances.push(company);
          }
          distances.sort(function(a, b) {
            return a.distance - b.distance;
          });
        }
        return distances[0];
      };
    })(this);
  });

}).call(this);
