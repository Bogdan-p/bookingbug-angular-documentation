
/***
* @ngdoc service
* @name BB.Services:AlertService
*
* @description
* Factory AlertService
*
* @param {service} $rootScope Every application has a single root scope.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
* - titleLookup (type, title)
* - add(type, {title, msg})
* - closeAlert(alert)
* - closeAlertIdx(index)
* - clear()
* - error(alert)
* - danger(alert)
* - info(alert)
* - warning(alert)
*
 */

(function() {
  angular.module('BB.Services').factory('AlertService', function($rootScope, ErrorService) {
    var alertService, titleLookup;
    $rootScope.alerts = [];
    titleLookup = function(type, title) {
      if (title) {
        return title;
      }
      switch (type) {
        case "error":
        case "danger":
          title = "Error";
          break;
        default:
          title = null;
      }
      return title;
    };
    return alertService = {
      add: function(type, arg) {
        var msg, title;
        title = arg.title, msg = arg.msg;
        $rootScope.alerts = [];
        $rootScope.alerts.push({
          type: type,
          title: titleLookup(type, title),
          msg: msg,
          close: function() {
            return alertService.closeAlert(this);
          }
        });
        return $rootScope.$broadcast("alert:raised");
      },
      closeAlert: function(alert) {
        return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
      },
      clear: function() {
        return $rootScope.alerts = [];
      },
      error: function(alert) {
        return this.add('error', {
          title: alert.title,
          msg: alert.msg
        });
      },
      danger: function(alert) {
        return this.add('danger', {
          title: alert.title,
          msg: alert.msg
        });
      },
      info: function(alert) {
        return this.add('info', {
          title: alert.title,
          msg: alert.msg
        });
      },
      warning: function(alert) {
        return this.add('warning', {
          title: alert.title,
          msg: alert.msg
        });
      }
    };
  });

}).call(this);
