(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbMap
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbMap
  *
  * See Controller {@link BB.Controllers:MapCtrl MapCtrl}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'MapCtrl'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbMap', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'MapCtrl'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:MapCtrl
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller MapCtrl
  *
  * # Has the following set of methods:
  *
  * - $rootScope.connection_started.then
  * - $scope.map_init.then
  * - $scope.init(options)
  * - checkDataStore
  * - scope.title
  * - $scope.searchAddress(prms)
  * - searchPlaces(prms)
  * - searchSuccess(result)
  * - searchFailed()
  * - $scope.validateAddress(form)
  * - $scope.showClosestMarkers(latlong)
  * - $scope.openMarkerInfo(marker)
  * - $scope.selectItem(item, route)
  * - $scope.roundNumberUp(num, places)
  * - $scope.geolocate()
  * - geolocateFail(error)
  * - reverseGeocode(position)
  * - $scope.increaseRange()
  * - $scope.$watch 'display.xs', (new_value, old_value)
  * - $rootScope.$on 'widget:restart', ()
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {function} angular.element Wraps a raw DOM element or HTML string as a jQuery element.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/function/angular.element more}
  *
  * @param {service} $attrs Info
  *
  * @param {service} AlertService Info
  * <br>
  * {@link BB.Services:AlertService more}
  *
  * @param {service} ErrorService Info
  * <br>
  * {@link BB.Services:ErrorService more}
  *
  * @param {service} FormDataStoreService Info
  * <br>
  * {@link BB.Services:FormDataStoreService more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
   */

  angular.module('BB.Controllers').controller('MapCtrl', function($scope, $element, $attrs, $rootScope, AlertService, ErrorService, FormDataStoreService, $q, $window, $timeout) {
    var checkDataStore, geolocateFail, map_ready_def, options, reverseGeocode, searchFailed, searchPlaces, searchSuccess;
    $scope.controller = "public.controllers.MapCtrl";
    FormDataStoreService.init('MapCtrl', $scope, ['address', 'selectedStore', 'search_prms']);
    options = $scope.$eval($attrs.bbMap) || {};
    map_ready_def = $q.defer();
    $scope.mapLoaded = $q.defer();
    $scope.mapReady = map_ready_def.promise;
    $scope.map_init = $scope.mapLoaded.promise;
    $scope.numSearchResults = options.num_search_results || 6;
    $scope.range_limit = options.range_limit || Infinity;
    $scope.showAllMarkers = false;
    $scope.mapMarkers = [];
    $scope.shownMarkers = $scope.shownMarkers || [];
    $scope.numberedPin || ($scope.numberedPin = null);
    $scope.defaultPin || ($scope.defaultPin = null);
    $scope.hide_not_live_stores = false;
    if (!$scope.address && $attrs.bbAddress) {
      $scope.address = $scope.$eval($attrs.bbAddress);
    }
    $scope.error_msg = options.error_msg || "You need to select a store";
    $scope.notLoaded($scope);
    webshim.setOptions({
      'waitReady': false,
      'loadStyles': false
    });
    webshim.polyfill("geolocation");
    $rootScope.connection_started.then(function() {
      var comp, i, key, latlong, len, ref, ref1, value;
      if (!$scope.selectedStore) {
        $scope.setLoaded($scope);
      }
      if ($scope.bb.company.companies) {
        $rootScope.parent_id = $scope.bb.company.id;
      } else if ($rootScope.parent_id) {
        $scope.initWidget({
          company_id: $rootScope.parent_id,
          first_page: $scope.bb.current_page,
          keep_basket: true
        });
        return;
      } else {
        $scope.initWidget({
          company_id: $scope.bb.company.id,
          first_page: null
        });
        return;
      }
      $scope.companies = $scope.bb.company.companies;
      if (!$scope.companies || $scope.companies.length === 0) {
        $scope.companies = [$scope.bb.company];
      }
      $scope.mapBounds = new google.maps.LatLngBounds();
      ref = $scope.companies;
      for (i = 0, len = ref.length; i < len; i++) {
        comp = ref[i];
        if (comp.address && comp.address.lat && comp.address.long) {
          latlong = new google.maps.LatLng(comp.address.lat, comp.address.long);
          $scope.mapBounds.extend(latlong);
        }
      }
      $scope.mapOptions = {
        center: $scope.mapBounds.getCenter(),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      if (options && options.map_options) {
        ref1 = options.map_options;
        for (key in ref1) {
          value = ref1[key];
          $scope.mapOptions[key] = value;
        }
      }
      return map_ready_def.resolve(true);
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.map_init.then(function() {
      var comp, i, latlong, len, marker, ref;
      ref = $scope.companies;
      for (i = 0, len = ref.length; i < len; i++) {
        comp = ref[i];
        if (comp.address && comp.address.lat && comp.address.long) {
          latlong = new google.maps.LatLng(comp.address.lat, comp.address.long);
          marker = new google.maps.Marker({
            map: $scope.myMap,
            position: latlong,
            visible: $scope.showAllMarkers,
            icon: $scope.defaultPin
          });
          marker.company = comp;
          if (!($scope.hide_not_live_stores && !comp.live)) {
            $scope.mapMarkers.push(marker);
          }
        }
      }
      $timeout(function() {
        $scope.myMap.fitBounds($scope.mapBounds);
        return $scope.myMap.setZoom(15);
      });
      return checkDataStore();
    });
    $scope.init = function(options) {
      if (options) {
        return $scope.hide_not_live_stores = options.hide_not_live_stores;
      }
    };
    checkDataStore = function() {
      if ($scope.selectedStore) {
        $scope.notLoaded($scope);
        if ($scope.search_prms) {
          $scope.searchAddress($scope.search_prms);
        } else {
          $scope.geolocate();
        }
        return google.maps.event.addListenerOnce($scope.myMap, 'idle', function() {
          return _.each($scope.mapMarkers, function(marker) {
            if ($scope.selectedStore.id === marker.company.id) {
              return google.maps.event.trigger(marker, 'click');
            }
          });
        });
      }
    };
    $scope.title = function() {
      var ci, p1;
      ci = $scope.bb.current_item;
      if (ci.category && ci.category.description) {
        p1 = ci.category.description;
      } else {
        p1 = $scope.bb.company.extra.department;
      }
      return p1 + ' - ' + $scope.$eval('getCurrentStepTitle()');
    };
    $scope.searchAddress = function(prms) {
      if ($scope.reverse_geocode_address && $scope.reverse_geocode_address === $scope.address) {
        return false;
      }
      delete $scope.geocoder_result;
      if (!prms) {
        prms = {};
      }
      $scope.search_prms = prms;
      $scope.map_init.then(function() {
        var address, ne, req, sw;
        address = $scope.address;
        if (prms.address) {
          address = prms.address;
        }
        if (address) {
          req = {
            address: address
          };
          if (prms.region) {
            req.region = prms.region;
          }
          if (prms.componentRestrictions) {
            req.componentRestrictions = prms.componentRestrictions;
          }
          if (prms.bounds) {
            sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y);
            ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y);
            req.bounds = new google.maps.LatLngBounds(sw, ne);
          }
          return new google.maps.Geocoder().geocode(req, function(results, status) {
            if (results.length > 0 && status === 'OK') {
              $scope.geocoder_result = results[0];
            }
            if (!$scope.geocoder_result || ($scope.geocoder_result && $scope.geocoder_result.partial_match)) {
              searchPlaces(req);
              return;
            } else if ($scope.geocoder_result) {
              searchSuccess($scope.geocoder_result);
            } else {
              searchFailed();
            }
            return $scope.setLoaded($scope);
          });
        }
      });
      return $scope.setLoaded($scope);
    };
    searchPlaces = function(prms) {
      var req, service;
      req = {
        query: prms.address,
        types: ['shopping_mall', 'store', 'embassy']
      };
      if (prms.bounds) {
        req.bounds = prms.bounds;
      }
      service = new google.maps.places.PlacesService($scope.myMap);
      return service.textSearch(req, function(results, status) {
        if (results.length > 0 && status === 'OK') {
          return searchSuccess(results[0]);
        } else if ($scope.geocoder_result) {
          return searchSuccess($scope.geocoder_result);
        } else {
          return searchFailed();
        }
      });
    };
    searchSuccess = function(result) {
      AlertService.clear();
      $scope.search_failed = false;
      $scope.loc = result.geometry.location;
      $scope.myMap.setCenter($scope.loc);
      $scope.myMap.setZoom(15);
      $scope.showClosestMarkers($scope.loc);
      return $rootScope.$broadcast("map:search_success");
    };
    searchFailed = function() {
      $scope.search_failed = true;
      AlertService.danger(ErrorService.getError('LOCATION_NOT_FOUND'));
      return $rootScope.$apply();
    };
    $scope.validateAddress = function(form) {
      if (!form) {
        return false;
      }
      if (form.$error.required) {
        AlertService.clear();
        AlertService.danger(ErrorService.getError('MISSING_LOCATION'));
        return false;
      } else {
        return true;
      }
    };
    $scope.showClosestMarkers = function(latlong) {
      var R, a, c, chLat, chLon, d, dLat, dLon, distances, distances_kilometres, i, iconPath, index, item, items, j, k, l, lat1, lat2, len, len1, len2, localBounds, lon1, lon2, marker, pi, rLat1, rLat2, ref, ref1;
      pi = Math.PI;
      R = 6371;
      distances = [];
      distances_kilometres = [];
      lat1 = latlong.lat();
      lon1 = latlong.lng();
      ref = $scope.mapMarkers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        lat2 = marker.position.lat();
        lon2 = marker.position.lng();
        chLat = lat2 - lat1;
        chLon = lon2 - lon1;
        dLat = chLat * (pi / 180);
        dLon = chLon * (pi / 180);
        rLat1 = lat1 * (pi / 180);
        rLat2 = lat2 * (pi / 180);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        k = d;
        d = d * 0.621371192;
        if (!$scope.showAllMarkers) {
          marker.setVisible(false);
        }
        marker.distance = d;
        marker.distance_kilometres = k;
        if (d < $scope.range_limit) {
          distances.push(marker);
        }
        if (k < $scope.range_limit) {
          distances_kilometres.push(marker);
        }
        items = [distances, distances_kilometres];
        for (j = 0, len1 = items.length; j < len1; j++) {
          item = items[j];
          item.sort(function(a, b) {
            a.distance - b.distance;
            return a.distance_kilometres - b.distance_kilometres;
          });
        }
      }
      $scope.shownMarkers = distances.slice(0, $scope.numSearchResults);
      localBounds = new google.maps.LatLngBounds();
      localBounds.extend(latlong);
      index = 1;
      ref1 = $scope.shownMarkers;
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        marker = ref1[l];
        if ($scope.numberedPin) {
          iconPath = $window.sprintf($scope.numberedPin, index);
          marker.setIcon(iconPath);
        }
        marker.setVisible(true);
        localBounds.extend(marker.position);
        index += 1;
      }
      google.maps.event.trigger($scope.myMap, 'resize');
      return $scope.myMap.fitBounds(localBounds);
    };
    $scope.openMarkerInfo = function(marker) {
      $scope.currentMarker = marker;
      return $scope.myInfoWindow.open($scope.myMap, marker);
    };
    $scope.selectItem = function(item, route) {
      if (!$scope.$debounce(1000)) {
        return;
      }
      if (!item) {
        AlertService.warning({
          msg: $scope.error_msg
        });
        return;
      }
      $scope.notLoaded($scope);
      if ($scope.selectedStore && $scope.selectedStore.id !== item.id) {
        $scope.$emit('change:storeLocation');
      }
      $scope.selectedStore = item;
      return $scope.initWidget({
        company_id: item.id,
        first_page: route
      });
    };
    $scope.roundNumberUp = function(num, places) {
      return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
    };
    $scope.geolocate = function() {
      if (!navigator.geolocation || ($scope.reverse_geocode_address && $scope.reverse_geocode_address === $scope.address)) {
        return false;
      }
      $scope.notLoaded($scope);
      return webshim.ready('geolocation', function() {
        options = {
          timeout: 5000,
          maximumAge: 3600000
        };
        return navigator.geolocation.getCurrentPosition(reverseGeocode, geolocateFail, options);
      });
    };
    geolocateFail = function(error) {
      switch (error.code) {
        case 2:
        case 3:
          $scope.setLoaded($scope);
          return AlertService.danger(ErrorService.getError('GEOLOCATION_ERROR'));
        default:
          return $scope.setLoaded($scope);
      }
    };
    reverseGeocode = function(position) {
      var lat, latlng, long;
      lat = parseFloat(position.coords.latitude);
      long = parseFloat(position.coords.longitude);
      latlng = new google.maps.LatLng(lat, long);
      return new google.maps.Geocoder().geocode({
        'latLng': latlng
      }, function(results, status) {
        var ac, i, len, ref;
        if (results.length > 0 && status === 'OK') {
          $scope.geocoder_result = results[0];
          ref = $scope.geocoder_result.address_components;
          for (i = 0, len = ref.length; i < len; i++) {
            ac = ref[i];
            if (ac.types.indexOf("route") >= 0) {
              $scope.reverse_geocode_address = ac.long_name;
            }
            if (ac.types.indexOf("locality") >= 0) {
              $scope.reverse_geocode_address += ', ' + ac.long_name;
            }
            $scope.address = $scope.reverse_geocode_address;
          }
          searchSuccess($scope.geocoder_result);
        }
        return $scope.setLoaded($scope);
      });
    };
    $scope.increaseRange = function() {
      $scope.range_limit = Infinity;
      return $scope.searchAddress($scope.search_prms);
    };
    $scope.$watch('display.xs', (function(_this) {
      return function(new_value, old_value) {
        if (new_value !== old_value && $scope.loc) {
          $scope.myInfoWindow.close();
          $scope.myMap.setCenter($scope.loc);
          $scope.myMap.setZoom(15);
          return $scope.showClosestMarkers($scope.loc);
        }
      };
    })(this));
    return $rootScope.$on('widget:restart', function() {
      $scope.loc = null;
      $scope.reverse_geocode_address = null;
      return $scope.address = null;
    });
  });

}).call(this);
