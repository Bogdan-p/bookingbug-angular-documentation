
/***
* @ngdoc service
* @name BB.Services:ItemDetailsService
*
* @description
* Factory ItemDetailsService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
*
 */

(function() {
  angular.module('BB.Services').factory("ItemDetailsService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        if (prms.cItem.service) {
          if (!prms.cItem.service.$has('questions')) {
            deferred.resolve(new BBModel.ItemDetails());
          } else {
            prms.cItem.service.$get('questions').then((function(_this) {
              return function(details) {
                return deferred.resolve(new BBModel.ItemDetails(details));
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
        } else if (prms.cItem.event_chain) {
          if (!prms.cItem.event_chain.$has('questions')) {
            deferred.resolve(new BBModel.ItemDetails());
          } else {
            prms.cItem.event_chain.$get('questions').then((function(_this) {
              return function(details) {
                return deferred.resolve(new BBModel.ItemDetails(details));
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
        } else if (prms.cItem.deal) {
          if (!prms.cItem.deal.$has('questions')) {
            deferred.resolve(new BBModel.ItemDetails());
          } else {
            prms.cItem.deal.$get('questions').then((function(_this) {
              return function(details) {
                return deferred.resolve(new BBModel.ItemDetails(details));
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
        } else {
          deferred.reject("No service link found");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);
