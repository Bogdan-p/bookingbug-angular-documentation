
/***
* @ngdoc directive
* @name BB.Directives:bbAddresses
* @restrict AE
* @scope true
*
* @description
{@link https://docs.angularjs.org/guide/directive more about Directives}

* Directive BB.Directives:bbAddresses
*
* <pre>
*  restrict: 'AE'
*  replace: true
*  scope : true
* </pre>
*
 */

(function() {
  angular.module('BB.Directives').directive('bbAddresses', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AddressList'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:AddressList
  *
  * @description
  *{@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller AddressList
  *
  * # Has the following set of methods:
  * - $scope.findByPostcode()
  * - $scope.showCompleteAddress()
  * - $scope.setManualPostcodeEntry(value)
  * - $scope.$on "client_details:reset_search", (event)
  *
  * @requires $scope
  * @requires $rootScope
  * @requires $sniffer
  * @requires $filter
  * @requires BB.Services:AddressListService
  * @requires BB.Services:FormDataStoreService
  *
   */

  angular.module('BB.Controllers').controller('AddressList', function($scope, $rootScope, $filter, $sniffer, AddressListService, FormDataStoreService) {
    $scope.controller = "public.controllers.AddressList";
    $scope.manual_postcode_entry = false;
    FormDataStoreService.init('AddressList', $scope, ['show_complete_address']);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.client.postcode && !$scope.bb.postcode) {
          $scope.bb.postcode = $scope.client.postcode;
        }
        if ($scope.client.postcode && $scope.bb.postcode && $scope.client.postcode === $scope.bb.postcode && !$scope.bb.address1) {
          $scope.bb.address1 = $scope.client.address1;
          $scope.bb.address2 = $scope.client.address2;
          $scope.bb.address3 = $scope.client.address3;
          $scope.bb.address4 = $scope.client.address4;
          $scope.bb.address5 = $scope.client.address5;
        }
        $scope.manual_postcode_entry = !$scope.bb.postcode ? true : false;
        $scope.show_complete_address = $scope.bb.address1 ? true : false;
        if (!$scope.postcode_submitted) {
          $scope.findByPostcode();
          return $scope.postcode_submitted = false;
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });

    /***
    * @ngdoc method
    * @name $scope.findByPostcode
    * @methodOf BB.Controllers:AddressList
    *
    * @description
    * Make a request for a list of addresses. They come as seperate list of
    * objects containing addresses and monikers, which are converted into a single
    * list of objects containing both properties.
    *
     */
    $scope.findByPostcode = function() {
      $scope.postcode_submitted = true;
      if (!$scope.bb.postcode) {
        return;
      }
      $scope.notLoaded($scope);
      return AddressListService.query({
        company: $scope.bb.company,
        post_code: $scope.bb.postcode
      }).then(function(response) {
        var addressArr, newaddr;
        if (angular.isArray(response)) {
          addressArr = _.map(response, function(item, i) {
            return {
              address: item.partialAddress,
              moniker: item.moniker
            };
          });
        } else {
          addressArr = [
            {
              address: response.partialAddress,
              moniker: response.moniker
            }
          ];
        }
        if (addressArr.length === 1 && $sniffer.msie) {
          newaddr = [];
          newaddr.push(addressArr[0]);
          newaddr.push({
            address: ''
          });
          addressArr = newaddr;
        }
        $scope.addresses = addressArr;
        $scope.bb.address = addressArr[0];
        $scope.client.address = addressArr[0];
        $scope.setLoaded($scope);
      }, function(err) {
        $scope.show_complete_address = true;
        $scope.postcode_submitted = true;
        return $scope.setLoaded($scope);
      });
    };

    /***
    * @ngdoc method
    * @name $scope.showCompleteAddress
    * @methodOf BB.Controllers:AddressList
    *
    *
     */
    $scope.showCompleteAddress = function() {
      $scope.show_complete_address = true;
      $scope.postcode_submitted = false;
      if ($scope.bb.address && $scope.bb.address.moniker) {
        $scope.notLoaded($scope);
        return AddressListService.getAddress({
          company: $scope.bb.company,
          id: $scope.bb.address.moniker
        }).then(function(response) {
          var address, address2, address3, addressLine2, building_number, house_number, streetName;
          address = response;
          house_number = '';
          if (typeof address.buildingNumber === 'string') {
            house_number = address.buildingNumber;
          } else if (address.buildingNumber == null) {
            house_number = address.buildingName;
          }
          if (typeof address.streetName === 'string') {
            streetName = address.streetName ? address.streetName : '';
            $scope.bb.address1 = house_number + ' ' + streetName;
          } else {
            addressLine2 = address.addressLine2 ? address.addressLine2 : '';
            $scope.bb.address1 = house_number + ' ' + addressLine2;
          }
          if (address.buildingName && (address.buildingNumber == null)) {
            $scope.bb.address1 = house_number;
            $scope.bb.address2 = address.streetName;
            if (address.county != null) {
              $scope.bb.address4 = address.county;
            }
          }
          if (typeof address.buildingNumber === 'string' && typeof address.buildingName === 'string' && typeof address.streetName === 'string') {
            streetName = address.streetName ? address.streetName : '';
            $scope.bb.address1 = address.buildingName;
            $scope.bb.address2 = address.buildingNumber + " " + streetName;
          }
          if ((address.buildingName != null) && address.buildingName.match(/(^[^0-9]+$)/)) {
            building_number = address.buildingNumber ? address.buildingNumber : '';
            $scope.bb.address1 = address.buildingName + " " + building_number;
            $scope.bb.address2 = address.streetName;
          }
          if ((address.buildingNumber == null) && (address.streetName == null)) {
            $scope.bb.address1 = address.buildingName;
            $scope.bb.address2 = address.addressLine3;
            $scope.bb.address4 = address.town;
          }
          if (address.companyName != null) {
            $scope.bb.address1 = address.companyName;
            if ((address.buildingNumber == null) && (address.streetName == null)) {
              $scope.bb.address2 = address.addressLine3;
            } else if (address.buildingNumber == null) {
              address2 = address.buildingName ? address.buildingName + ', ' + address.streetName : address.streetName;
              $scope.bb.address2 = address2;
            } else if ((address.buildingName == null) && (address.addressLine2 == null)) {
              $scope.bb.address2 = address.buildingNumber + ", " + address.streetName;
            } else {
              $scope.bb.address2 = address.buildingName;
            }
            $scope.bb.address3 = address.buildingName;
            if (address.addressLine3 && (address.buildingNumber != null)) {
              address3 = address.addressLine3;
            } else if ((address.addressLine2 == null) && (address.buildingNumber != null)) {
              address3 = address.buildingNumber + " " + address.streetName;
            } else if ((address.addressLine2 == null) && (address.buildingNumber == null) && (address.buildingName != null)) {
              address3 = address.addressLine3;
            } else {
              address3 = '';
            }
            $scope.bb.address3 = address3;
            $scope.bb.address4 = address.town;
            $scope.bb.address5 = "";
            $scope.bb.postcode = address.postCode;
          }
          if ((address.buildingName == null) && (address.companyName == null) && (address.county == null)) {
            if ((address.addressLine2 == null) && (address.companyName == null)) {
              address2 = address.addressLine3;
            } else {
              address2 = address.addressLine2;
            }
            $scope.bb.address2 = address2;
          } else if ((address.buildingName == null) && (address.companyName == null)) {
            $scope.bb.address2 = address.addressLine3;
          }
          if ((address.buildingName != null) && (address.streetName != null) && (address.companyName == null) && (address.addressLine3 != null)) {
            if (address.addressLine3 == null) {
              $scope.bb.address3 = address.buildingName;
            } else {
              $scope.bb.address3 = address.addressLine3;
            }
          } else if ((address.buildingName == null) && (address.companyName == null) && (address.addressLine2 != null)) {
            $scope.bb.address3 = address.addressLine3;
          } else if ((address.buildingName == null) && (address.streetName != null) && (address.addressLine3 == null)) {
            $scope.bb.address3 = address.addressLine3;
          }
          $scope.bb.address4 = address.town;
          if (address.county != null) {
            $scope.bb.address5 = address.county;
          }
          $scope.setLoaded($scope);
        }, function(err) {
          $scope.show_complete_address = true;
          $scope.postcode_submitted = false;
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };

    /***
    * @ngdoc method
    * @name $scope.setManualPostcodeEntry
    * @methodOf BB.Controllers:AddressList
    *
    *
    * @param {object} value Info
    *
     */
    $scope.setManualPostcodeEntry = function(value) {
      return $scope.manual_postcode_entry = value;
    };
    return $scope.$on("client_details:reset_search", function(event) {
      $scope.bb.address1 = null;
      $scope.bb.address2 = null;
      $scope.bb.address3 = null;
      $scope.bb.address4 = null;
      $scope.bb.address5 = null;
      $scope.show_complete_address = false;
      $scope.postcode_submitted = false;
      return $scope.bb.address = $scope.addresses[0];
    });
  });

}).call(this);
