
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminSlotService
*
* @description
* Factory AdminSlotService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window read more}
*
* @param {model} halClient Info
*
* @param {model} SlotCollections Info
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {model} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminSlotService', function($q, $window, halClient, SlotCollections, BBModel, UriTemplate) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminSlotService
      *
      * @description
      * Method query
      *
      * @param {object} prms Info
      *
      * @returns {Promise} defer.reject(err) or deferred.promise
       */
      query: function(prms) {
        var deferred, existing, href, uri, url;
        deferred = $q.defer();
        existing = SlotCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else if (prms.user) {
          prms.user.$get('company').then(function(company) {
            return company.$get('slots', prms).then(function(slots_collection) {
              return slots_collection.$get('slots').then(function(slots) {
                var s, slot_models;
                slot_models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = slots.length; i < len; i++) {
                    s = slots[i];
                    results.push(new BBModel.Admin.Slot(s));
                  }
                  return results;
                })();
                return deferred.resolve(slot_models);
              }, function(err) {
                return deferred.reject(err);
              });
            });
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,date,service_id,resource_id,person_id,page,per_page}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('slots').then(function(items) {
                var i, item, len, sitems, slots;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Slot(item));
                }
                slots = new $window.Collection.Slot(found, sitems, prms);
                SlotCollections.add(slots);
                return deferred.resolve(slots);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name create
      * @methodOf BBAdmin.Services:AdminSlotService
      *
      * @description
      * Method create
      *
      * @param {object} prms Info
      *
      * @param {object} data Info
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
       */
      create: function(prms, data) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/slots";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$post(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name delete
      * @methodOf BBAdmin.Services:AdminSlotService
      *
      * @description
      * Method delete
      *
      * @param {object} item Info
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
       */
      "delete": function(item) {
        var deferred;
        deferred = $q.defer();
        item.$del('self').then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.deleteItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name update
      * @methodOf BBAdmin.Services:AdminSlotService
      *
      * @description
      * Method update
      *
      * @param {object} item Info
      *
      * @param {object} data Info
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
       */
      update: function(item, data) {
        var deferred;
        deferred = $q.defer();
        item.$put('self', {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
