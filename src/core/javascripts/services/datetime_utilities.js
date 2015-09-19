
/***
* @ngdoc service
* @name BB.Services:DateTimeUlititiesService
*
* @description
* Factory DateTimeUlititiesService
*
* @returns {Promise} This service has the following set of methods:
*
* - convertTimeSlotToMoment(day, time_slot)
* - convertMomentToTime(datetime)
*
 */

(function() {
  angular.module('BB.Services').factory("DateTimeUlititiesService", function() {
    return {
      convertTimeSlotToMoment: function(day, time_slot) {
        var datetime, hours, mins, val;
        if (!day && !time_slot) {
          return;
        }
        datetime = moment();
        val = parseInt(time_slot.time);
        hours = parseInt(val / 60);
        mins = val % 60;
        datetime.hour(hours);
        datetime.minutes(mins);
        datetime.seconds(0);
        datetime.date(day.date.date());
        datetime.month(day.date.month());
        datetime.year(day.date.year());
        return datetime;
      },
      convertMomentToTime: function(datetime) {
        return datetime.minutes() + datetime.hours() * 60;
      }
    };
  });

}).call(this);
