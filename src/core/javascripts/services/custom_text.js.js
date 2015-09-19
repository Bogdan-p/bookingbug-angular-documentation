
/***
* @ngdoc service
* @name BB.Services:CustomTextService
*
* @description
* Factory CustomTextService
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
* - BookingText(company, basketItem)
* - confirmationText(company, total)
*
 */

(function() {
  angular.module('BB.Services').factory("CustomTextService", function($q, BBModel) {
    return {
      BookingText: function(company, basketItem) {
        var deferred;
        deferred = $q.defer();
        company.$get('booking_text').then((function(_this) {
          return function(emb) {
            return emb.$get('booking_text').then(function(details) {
              var detail, i, len, link, msgs, name, ref;
              msgs = [];
              for (i = 0, len = details.length; i < len; i++) {
                detail = details[i];
                if (detail.message_type === "Booking") {
                  ref = basketItem.parts_links;
                  for (name in ref) {
                    link = ref[name];
                    if (detail.$href('item') === link) {
                      if (msgs.indexOf(detail.message) === -1) {
                        msgs.push(detail.message);
                      }
                    }
                  }
                }
              }
              return deferred.resolve(msgs);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      confirmationText: function(company, total) {
        var deferred;
        deferred = $q.defer();
        company.$get('booking_text').then(function(emb) {
          return emb.$get('booking_text').then(function(details) {
            return total.getMessages(details, "Confirm").then(function(msgs) {
              return deferred.resolve(msgs);
            });
          });
        }, function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  });

}).call(this);
