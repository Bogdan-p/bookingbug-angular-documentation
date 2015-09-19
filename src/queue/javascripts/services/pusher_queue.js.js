
/***
* @ngdoc service
* @name BBQueue.Services:PusherQueue
*
* @description
* Factory PusherQueue
*
* @requires $sessionStorage
* @requires $pusher
* @requires AppConfig
*
* @returns {Promise} This service has the following set of methods:
*
* - subscribe(comapy)
*
 */

(function() {
  angular.module('BBQueue.Services').factory('PusherQueue', function($sessionStorage, $pusher, AppConfig) {
    var PusherQueue;
    return PusherQueue = (function() {
      function PusherQueue() {}


      /***
      * @ngdoc method
      * @name this.subscribe
      * @methodOf BBQueue.Services:PusherQueue
      *
      * @description
      * Method this.subscribe
      *
      * @param {object} company company
      *
      * @returns {object} this.pusher.subscribe
      *
       */

      PusherQueue.subscribe = function(company) {
        if ((company != null) && (typeof Pusher !== "undefined" && Pusher !== null)) {
          if (this.client == null) {
            this.client = new Pusher('c8d8cea659cc46060608', {
              authEndpoint: "/api/v1/push/" + company.id + "/pusher.json",
              auth: {
                headers: {
                  'App-Id': AppConfig['App-Id'],
                  'App-Key': AppConfig['App-Key'],
                  'Auth-Token': $sessionStorage.getItem('auth_token')
                }
              }
            });
          }
          this.pusher = $pusher(this.client);
          return this.channel = this.pusher.subscribe("mobile-queue-" + company.id);
        }
      };

      return PusherQueue;

    })();
  });

}).call(this);
