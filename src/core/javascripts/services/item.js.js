
/***
* @ngdoc service
* @name BB.Services:ItemService
*
* @description
* Factory ItemService
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
* - build_items(base_items, prms, deferred)
*
 */

(function() {
  angular.module('BB.Services').factory("ItemService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        if (prms.cItem.service && prms.item !== 'service') {
          if (!prms.cItem.service.$has('items')) {
            prms.cItem.service.$get('item').then((function(_this) {
              return function(base_item) {
                return _this.build_items(base_item.$get('items'), prms, deferred);
              };
            })(this));
          } else {
            this.build_items(prms.cItem.service.$get('items'), prms, deferred);
          }
        } else if (prms.cItem.resource && !prms.cItem.anyResource() && prms.item !== 'resource') {
          if (!prms.cItem.resource.$has('items')) {
            prms.cItem.resource.$get('item').then((function(_this) {
              return function(base_item) {
                return _this.build_items(base_item.$get('items'), prms, deferred);
              };
            })(this));
          } else {
            this.build_items(prms.cItem.resource.$get('items'), prms, deferred);
          }
        } else if (prms.cItem.person && !prms.cItem.anyPerson() && prms.item !== 'person') {
          if (!prms.cItem.person.$has('items')) {
            prms.cItem.person.$get('item').then((function(_this) {
              return function(base_item) {
                return _this.build_items(base_item.$get('items'), prms, deferred);
              };
            })(this));
          } else {
            this.build_items(prms.cItem.person.$get('items'), prms, deferred);
          }
        } else {
          deferred.reject("No service link found");
        }
        return deferred.promise;
      },
      build_items: function(base_items, prms, deferred) {
        var wait_items;
        wait_items = [base_items];
        if (prms.wait) {
          wait_items.push(prms.wait);
        }
        return $q.all(wait_items).then((function(_this) {
          return function(resources) {
            var resource;
            resource = resources[0];
            return resource.$get('items').then(function(found) {
              var i, len, m, matching, v, wlist;
              matching = [];
              wlist = [];
              for (i = 0, len = found.length; i < len; i++) {
                v = found[i];
                if (v.type === prms.item) {
                  matching.push(new BBModel.BookableItem(v));
                }
              }
              return $q.all((function() {
                var j, len1, results;
                results = [];
                for (j = 0, len1 = matching.length; j < len1; j++) {
                  m = matching[j];
                  results.push(m.ready.promise);
                }
                return results;
              })()).then(function() {
                return deferred.resolve(matching);
              });
            });
          };
        })(this));
      }
    };
  });

}).call(this);
