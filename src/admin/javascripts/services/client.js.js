
/***
* @ngdoc service
* @name  BBAdmin.Services:AdminClientService
*
* @description
* Factory AdminClientService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window read more}
*
* @param {object} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
*
* @param {model} halClient Info
*
* @param {model} ClientCollections Info
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
  angular.module('BBAdmin.Services').factory('AdminClientService', function($q, $window, $rootScope, halClient, ClientCollections, BBModel, UriTemplate) {
    return {

      /***
      * @ngdoc query
      * @name sinceStart
      * @methodOf BBAdmin.Services:AdminClientService
      *
      * @description
      * Method query
      *
      * @param {Promise} prms Info
      *
      * @returns {Promise} deferred.promise
       */
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.company) {
          prms.company_id = prms.company.id;
        }
        url = "";
        if ($rootScope.bb.api_url) {
          url = $rootScope.bb.api_url;
        }
        href = url + "/api/v1/admin/{company_id}/client{/id}{?page,per_page,filter_by,filter_by_fields,order_by,order_by_reverse}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(resource) {
            var client;
            if (resource.$has('clients')) {
              return resource.$get('clients').then(function(items) {
                var clients, i, j, len, people;
                people = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  people.push(new BBModel.Client(i));
                }
                clients = new $window.Collection.Client(resource, people, prms);
                clients.total_entries = resource.total_entries;
                ClientCollections.add(clients);
                return deferred.resolve(clients);
              });
            } else {
              client = new BBModel.Client(resource);
              return deferred.resolve(client);
            }
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
      * @methodOf BBAdmin.Services:AdminClientService
      *
      * @description
      * Method update
      *
      * @param {object} client Info
      *
      * @returns {Promise} deferred.promise
       */
      update: function(client) {
        var deferred;
        deferred = $q.defer();
        client.$put('self', {}, client).then((function(_this) {
          return function(res) {
            return deferred.resolve(new BBModel.Client(res));
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
