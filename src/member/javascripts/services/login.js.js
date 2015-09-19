
/***
* @ngdoc service
* @name BBMember.Services:MemberLoginService
*
* @description
* Factory MemberLoginService
*
* @requires $q
* @requires halClient
* @requires $rootScope
* @requires BB.Models:BBModel
*
* @returns {Promise} This service has the following set of methods:
*
* - login(form, options)
*
 */

(function() {
  angular.module('BBMember.Services').factory("MemberLoginService", function($q, halClient, $rootScope, BBModel) {
    return {

      /***
      * @ngdoc method
      * @name login
      * @methodOf BBMember.Services:MemberLoginService
      *
      * @description
      * Method login
      *
      * @param {object} form form
      * @param {object} options options
      *
      * @returns {Promise} defer.reject(err) or defer.promise
      *
       */
      login: function(form, options) {
        var defer, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login";
        if (options.company_id != null) {
          url = url + "/member/" + options.company_id;
        }
        halClient.$post(url, options, form).then(function(login) {
          if (login.$has('member')) {
            return login.$get('member').then(function(member) {
              member = new BBModel.Member.Member(member);
              return defer.resolve(member);
            });
          } else if (login.$has('members')) {
            return defer.resolve(login);
          } else {
            return defer.reject("No member account for login");
          }
        }, (function(_this) {
          return function(err) {
            var login;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('members')) {
                return defer.resolve(login);
              } else {
                return defer.reject(err);
              }
            } else {
              return defer.reject(err);
            }
          };
        })(this));
        return defer.promise;
      }
    };
  });

}).call(this);
