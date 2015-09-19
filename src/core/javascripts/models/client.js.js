(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ClientModel
  *
  * @description
  * This is ClientModel in BB.Models module that creates Client object.
  *
  * <pre>
  * //Creates class Client that extends BaseModel
  * class Client extends BaseModel
  * </pre>
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @param {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @param {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @param {model} LocaleService Info
  * <br>
  * {@link BB.Services:LocaleService more}
  *
  * @returns {object} Newly created Client object with the following set of methods:
  *
  * - constructor(data)
  * - setClientDetails(details)
  * - setDefaults(values)
  * - pre_fill_answers(details)
  * - getName()
  * - addressSingleLine()
  * - hasAddres()
  * - addressCsvLine()
  * - addressMultiLine()
  * - getPostData()
  * - valid()
  * - setValid(val)
  * - hasServerId()
  * - setAskedQuestions()
  * - fullMobile()
  * - remove_prefix()
  * - getPrePaidBookingsPromise(params)
  *
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("ClientModel", function($q, BBModel, BaseModel, LocaleService) {
    var Client;
    return Client = (function(superClass) {
      extend(Client, superClass);

      function Client(data) {
        Client.__super__.constructor.apply(this, arguments);
        this.name = this.getName();
        if (data) {
          if (data.answers && data.$has('questions')) {
            this.waitingQuestions = $q.defer();
            this.gotQuestions = this.waitingQuestions.promise;
            data.$get('questions').then((function(_this) {
              return function(details) {
                _this.client_details = new BBModel.ClientDetails(details);
                _this.client_details.setAnswers(data.answers);
                _this.questions = _this.client_details.questions;
                _this.setAskedQuestions();
                return _this.waitingQuestions.resolve();
              };
            })(this));
          }
          this.raw_mobile = this.mobile;
          if (this.mobile && this.mobile[0] !== "0") {
            this.mobile = "0" + this.mobile;
          }
          if (this.phone && this.phone[0] !== "0") {
            this.phone = "0" + this.phone;
          }
        }
      }

      Client.prototype.setClientDetails = function(details) {
        this.client_details = details;
        return this.questions = this.client_details.questions;
      };

      Client.prototype.setDefaults = function(values) {
        if (values.name) {
          this.name = values.name;
        }
        if (values.first_name) {
          this.first_name = values.first_name;
        }
        if (values.last_name) {
          this.last_name = values.last_name;
        }
        if (values.phone) {
          this.phone = values.phone;
        }
        if (values.mobile) {
          this.mobile = values.mobile;
        }
        if (values.email) {
          this.email = values.email;
        }
        if (values.id) {
          this.id = values.id;
        }
        if (values.ref) {
          this.comp_ref = values.ref;
        }
        if (values.comp_ref) {
          this.comp_ref = values.comp_ref;
        }
        if (values.address1) {
          this.address1 = values.address1;
        }
        if (values.address2) {
          this.address2 = values.address2;
        }
        if (values.address3) {
          this.address3 = values.address3;
        }
        if (values.address4) {
          this.address4 = values.address4;
        }
        if (values.address5) {
          this.address5 = values.address5;
        }
        if (values.postcode) {
          this.postcode = values.postcode;
        }
        if (values.country) {
          this.country = values.country;
        }
        if (values.answers) {
          return this.default_answers = values.answers;
        }
      };

      Client.prototype.pre_fill_answers = function(details) {
        var i, len, q, ref, results;
        if (!this.default_answers) {
          return;
        }
        ref = details.questions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          q = ref[i];
          if (this.default_answers[q.name]) {
            results.push(q.answer = this.default_answers[q.name]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      Client.prototype.getName = function() {
        var str;
        str = "";
        if (this.first_name) {
          str += this.first_name;
        }
        if (str.length > 0 && this.last_name) {
          str += " ";
        }
        if (this.last_name) {
          str += this.last_name;
        }
        return str;
      };

      Client.prototype.addressSingleLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += ", ";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += ", ";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += ", ";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += ", ";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += ", ";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Client.prototype.hasAddress = function() {
        return this.address1 || this.address2 || this.postcode;
      };

      Client.prototype.addressCsvLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        str += ", ";
        if (this.address2) {
          str += this.address2;
        }
        str += ", ";
        if (this.address3) {
          str += this.address3;
        }
        str += ", ";
        if (this.address4) {
          str += this.address4;
        }
        str += ", ";
        if (this.address5) {
          str += this.address5;
        }
        str += ", ";
        if (this.postcode) {
          str += this.postcode;
        }
        str += ", ";
        if (this.country) {
          str += this.country;
        }
        return str;
      };

      Client.prototype.addressMultiLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Client.prototype.getPostData = function() {
        var i, len, q, ref, x;
        x = {};
        x.first_name = this.first_name;
        x.last_name = this.last_name;
        if (this.house_number) {
          x.address1 = this.house_number + " " + this.address1;
        } else {
          x.address1 = this.address1;
        }
        x.address2 = this.address2;
        x.address3 = this.address3;
        x.address4 = this.address4;
        x.address5 = this.address5;
        x.postcode = this.postcode;
        x.country = this.country;
        x.phone = this.phone;
        x.email = this.email;
        x.id = this.id;
        x.comp_ref = this.comp_ref;
        x.parent_client_id = this.parent_client_id;
        x.password = this.password;
        x.notifications = this.notifications;
        if (this.mobile) {
          this.remove_prefix();
          x.mobile = this.mobile;
          x.mobile_prefix = this.mobile_prefix;
        }
        if (this.questions) {
          x.questions = [];
          ref = this.questions;
          for (i = 0, len = ref.length; i < len; i++) {
            q = ref[i];
            x.questions.push(q.getPostData());
          }
        }
        return x;
      };

      Client.prototype.valid = function() {
        if (this.isValid) {
          return this.isValid;
        }
        if (this.email || this.hasServerId()) {
          return true;
        } else {
          return false;
        }
      };

      Client.prototype.setValid = function(val) {
        return this.isValid = val;
      };

      Client.prototype.hasServerId = function() {
        return this.id;
      };

      Client.prototype.setAskedQuestions = function() {
        return this.asked_questions = true;
      };

      Client.prototype.fullMobile = function() {
        if (!this.mobile) {
          return;
        }
        if (!this.mobile_prefix) {
          return this.mobile;
        }
        return "+" + this.mobile_prefix + this.mobile;
      };

      Client.prototype.remove_prefix = function() {
        var pref_arr;
        pref_arr = this.mobile.match(/^(\+|00)(999|998|997|996|995|994|993|992|991|990|979|978|977|976|975|974|973|972|971|970|969|968|967|966|965|964|963|962|961|960|899|898|897|896|895|894|893|892|891|890|889|888|887|886|885|884|883|882|881|880|879|878|877|876|875|874|873|872|871|870|859|858|857|856|855|854|853|852|851|850|839|838|837|836|835|834|833|832|831|830|809|808|807|806|805|804|803|802|801|800|699|698|697|696|695|694|693|692|691|690|689|688|687|686|685|684|683|682|681|680|679|678|677|676|675|674|673|672|671|670|599|598|597|596|595|594|593|592|591|590|509|508|507|506|505|504|503|502|501|500|429|428|427|426|425|424|423|422|421|420|389|388|387|386|385|384|383|382|381|380|379|378|377|376|375|374|373|372|371|370|359|358|357|356|355|354|353|352|351|350|299|298|297|296|295|294|293|292|291|290|289|288|287|286|285|284|283|282|281|280|269|268|267|266|265|264|263|262|261|260|259|258|257|256|255|254|253|252|251|250|249|248|247|246|245|244|243|242|241|240|239|238|237|236|235|234|233|232|231|230|229|228|227|226|225|224|223|222|221|220|219|218|217|216|215|214|213|212|211|210|98|95|94|93|92|91|90|86|84|82|81|66|65|64|63|62|61|60|58|57|56|55|54|53|52|51|49|48|47|46|45|44|43|41|40|39|36|34|33|32|31|30|27|20|7|1)/);
        if (pref_arr) {
          this.mobile.replace(pref_arr[0], "");
          return this.mobile_prefix = pref_arr[0];
        }
      };

      Client.prototype.getPrePaidBookingsPromise = function(params) {
        var defer;
        defer = $q.defer();
        if (this.$has('pre_paid_bookings')) {
          this.$get('pre_paid_bookings', params).then(function(collection) {
            return collection.$get('pre_paid_bookings').then(function(prepaids) {
              var prepaid;
              return defer.resolve((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = prepaids.length; i < len; i++) {
                  prepaid = prepaids[i];
                  results.push(new BBModel.PrePaidBooking(prepaid));
                }
                return results;
              })());
            }, function(err) {
              return defer.reject(err);
            });
          }, function(err) {
            return defer.reject(err);
          });
        } else {
          defer.resolve([]);
        }
        return defer.promise;
      };

      return Client;

    })(BaseModel);
  });

}).call(this);
