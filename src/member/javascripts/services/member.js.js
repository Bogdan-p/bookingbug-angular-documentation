
/***
* @ngdoc service
* @name BB.Services:MemberService
*
* @description
* Factory MemberService
*
* @requires $q
* @requires halClient
* @requires $rootScope
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - refresh(member)
* - current()
*
 */

(function() {
  angular.module('BB.Services').factory("MemberService", function($q, halClient, $rootScope, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name refresh
      * @methodOf BB.Services:MemberService
      *
      * @description
      * Method refresh
      *
      * @param {object} member member
      *
      * @returns {Promise} deferred.reject(err) or deferred.promise
      *
       */
      refresh: function(member) {
        var deferred;
        deferred = $q.defer();
        member.$flush('self');
        member.$get('self').then((function(_this) {
          return function(member) {
            member = new BBModel.Member.Member(member);
            return deferred.resolve(member);
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
      * @name current
      * @methodOf BB.Services:MemberService
      *
      * @description
      * Method current
      *
      * @returns {Promise} deferred.promise
      *
       */
      current: function() {
        var callback, deferred;
        deferred = $q.defer();
        callback = function() {
          return deferred.resolve($rootScope.member);
        };
        setTimeout(callback, 200);
        return deferred.promise;
      }
    };
  });

}).call(this);
