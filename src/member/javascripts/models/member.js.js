
/***
* @ngdoc object
* @name BB.Models:Member.MemberModel
*
* @description
* This is Member.MemberModel in BB.Models module that creates Member object.
*
* <pre>
* //Creates class Member_Member that extends ClientModel
* class Member_Member extends ClientModel
* </pre>
*
* @requires $q
* @requires BB.Models:BBModel
* @requires BB.Models:BaseModel
* @requires BB.Models:ClientModel
*
* @returns {object} Newly created Member object with the following set of methods:
*
*
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Member.MemberModel", function($q, BBModel, BaseModel, ClientModel) {
    var Member_Member;
    return Member_Member = (function(superClass) {
      extend(Member_Member, superClass);

      function Member_Member() {
        return Member_Member.__super__.constructor.apply(this, arguments);
      }

      return Member_Member;

    })(ClientModel);
  });

}).call(this);
