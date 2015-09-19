(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:ScheduleRules
  *
  * @description
  * This is ScheduleRules in BB.Models module that creates ScheduleRules object.
  *
  * <pre>
  * //Creates class ScheduleRules
  * class ScheduleRules
  * </pre>
  *
  * @returns {object} Newly created ScheduleRules object with the following set of methods:
  *
  * - constructor(rules = {})
  * - addRange(start, end)
  * - removeRange(start, end)
  * - addWeekdayRange(start, end)
  * - removeWeekdayRange(start, end)
  * - addRangeToDate(date, range)
  * - removeRangeFromDate(date, range)
  * - applyFunctionToDateRange(start, end, format, func)
  * - diffInDays(start, end)
  * - subtractRange(ranges, range)
  * - joinRanges: (ranges)
  * - filterRulesByDates()
  * - filterRulesByWeekdays()
  * - formatTime(time)
  * - toEvents(d)
  * - toWeekdayEvents()
  *
   */
  angular.module('BB.Models').factory("ScheduleRules", function() {
    var ScheduleRules;
    ScheduleRules = (function() {

      /***
          * @ngdoc method
          * @name constructor
          * @methodOf BB.Models:ScheduleRules
          *
          * @description
          * constructor
          *
          * @param {object} rules rules
          *
       */
      function ScheduleRules() {}

      return ScheduleRules;

    })();
    return {
      constructor: function(rules) {
        if (rules == null) {
          rules = {};
        }
        return this.rules = rules;
      },

      /***
      * @ngdoc method
      * @name addRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * addRange
      *
      * @param {object} start start
      * @param {object} end end
      *
       */
      addRange: function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.addRangeToDate);
      },

      /***
      * @ngdoc method
      * @name removeRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * removeRange
      *
      * @param {object} start start
      * @param {object} end end
      *
       */
      removeRange: function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.removeRangeFromDate);
      },

      /***
      * @ngdoc method
      * @name addWeekdayRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * addWeekdayRange
      *
      * @param {object} start start
      * @param {object} end end
      *
       */
      addWeekdayRange: function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'd', this.addRangeToDate);
      },

      /***
      * @ngdoc method
      * @name removeWeekdayRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * removeWeekdayRange
      *
      * @param {object} start start
      * @param {object} end end
      *
       */
      removeWeekdayRange: function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'd', this.removeRangeFromDate);
      },

      /***
      * @ngdoc method
      * @name addRangeToDate
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * addRangeToDate
      *
      * @param {object} date date
      * @param {object} range range
      *
       */
      addRangeToDate: (function(_this) {
        return function(date, range) {
          var ranges;
          ranges = _this.rules[date] ? _this.rules[date].split(',') : [];
          return _this.rules[date] = _this.joinRanges(_this.insertRange(ranges, range));
        };
      })(this),

      /***
      * @ngdoc method
      * @name removeRangeFromDate
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * removeRangeFromDate
      *
      * @param {object} date date
      * @param {object} range range
      *
      * @returns {array} this.rules[date]
       */
      removeRangeFromDate: (function(_this) {
        return function(date, range) {
          var ranges;
          ranges = _this.rules[date] ? _this.rules[date].split(',') : [];
          _this.rules[date] = _this.joinRanges(_this.subtractRange(ranges, range));
          if (_this.rules[date] === '') {
            return delete _this.rules[date];
          }
        };
      })(this),

      /***
      * @ngdoc method
      * @name applyFunctionToDateRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * applyFunctionToDateRange
      *
      * @param {object} start start
      * @param {object} end end
      * @param {object} format format
      * @param {object} func func
      *
      * @returns {object} this.rules
       */
      applyFunctionToDateRange: function(start, end, format, func) {
        var date, days, end_time, j, range, results;
        days = this.diffInDays(start, end);
        if (days === 0) {
          date = start.format(format);
          range = [start.format('HHmm'), end.format('HHmm')].join('-');
          func(date, range);
        } else {
          end_time = moment(start).endOf('day');
          this.applyFunctionToDateRange(start, end_time, format, func);
          _.each((function() {
            results = [];
            for (var j = 1; 1 <= days ? j <= days : j >= days; 1 <= days ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this), (function(_this) {
            return function(i) {
              var start_time;
              date = moment(start).add(i, 'days');
              if (i === days) {
                if (!(end.hour() === 0 && end.minute() === 0)) {
                  start_time = moment(end).startOf('day');
                  return _this.applyFunctionToDateRange(start_time, end, format, func);
                }
              } else {
                start_time = moment(date).startOf('day');
                end_time = moment(date).endOf('day');
                return _this.applyFunctionToDateRange(start_time, end_time, format, func);
              }
            };
          })(this));
        }
        return this.rules;
      },

      /***
      * @ngdoc method
      * @name diffInDays
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * diffInDays
      *
      * @param {object} start start
      * @param {object} end end
      *
      * @returns {function} days()
       */
      diffInDays: function(start, end) {
        return moment.duration(end.diff(start)).days();
      },

      /***
      * @ngdoc method
      * @name insertRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * insertRange
      *
      * @param {object} ranges ranges
      * @param {object} range range
      *
      * @returns {object} ranges
       */
      insertRange: function(ranges, range) {
        ranges.splice(_.sortedIndex(ranges, range), 0, range);
        return ranges;
      },

      /***
      * @ngdoc method
      * @name subtractRange
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * subtractRange
      *
      * @param {object} ranges ranges
      * @param {object} range range
      *
      * @returns {function}  _.without(ranges, range)
       */
      subtractRange: function(ranges, range) {
        if (_.indexOf(ranges, range, true) > -1) {
          return _.without(ranges, range);
        } else {
          return _.flatten(_.map(ranges, function(r) {
            if (range.slice(0, 4) >= r.slice(0, 4) && range.slice(5, 9) <= r.slice(5, 9)) {
              if (range.slice(0, 4) === r.slice(0, 4)) {
                return [range.slice(5, 9), r.slice(5, 9)].join('-');
              } else if (range.slice(5, 9) === r.slice(5, 9)) {
                return [r.slice(0, 4), range.slice(0, 4)].join('-');
              } else {
                return [[r.slice(0, 4), range.slice(0, 4)].join('-'), [range.slice(5, 9), r.slice(5, 9)].join('-')];
              }
            } else {
              return r;
            }
          }));
        }
      },

      /***
      * @ngdoc method
      * @name joinRanges
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * joinRanges
      *
      * @param {object} ranges ranges
      *
      * @returns {object} range
       */
      joinRanges: function(ranges) {
        return _.reduce(ranges, function(m, range) {
          if (m === '') {
            return range;
          } else if (range.slice(0, 4) <= m.slice(m.length - 4, m.length)) {
            if (range.slice(5, 9) >= m.slice(m.length - 4, m.length)) {
              return m.slice(0, m.length - 4) + range.slice(5, 9);
            } else {
              return m;
            }
          } else {
            return [m, range].join();
          }
        }, "");
      },

      /***
      * @ngdoc method
      * @name filterRulesByDates
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * filterRulesByDates
      *
       */
      filterRulesByDates: function() {
        return _.pick(this.rules, function(value, key) {
          return key.match(/^\d{4}-\d{2}-\d{2}$/);
        });
      },

      /***
      * @ngdoc method
      * @name filterRulesByWeekdays
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * filterRulesByWeekdays
      *
       */
      filterRulesByWeekdays: function() {
        return _.pick(this.rules, function(value, key) {
          return key.match(/^\d$/);
        });
      },

      /***
      * @ngdoc method
      * @name formatTime
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * formatTime
      *
      * @params {array} time time
      *
      * @returns {array} time
       */
      formatTime: function(time) {
        return [time.slice(0, 2), time.slice(2, 4)].join(':');
      },

      /***
      * @ngdoc method
      * @name toEvents
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * toEvents
      *
      * @params {object} d d
      *
       */
      toEvents: function(d) {
        if (d) {
          return _.map(this.rules[d].split(','), (function(_this) {
            return function(range) {
              return {
                start: [d, _this.formatTime(range.split('-')[0])].join('T'),
                end: [d, _this.formatTime(range.split('-')[1])].join('T')
              };
            };
          })(this));
        } else {
          return _.reduce(this.filterRulesByDates(), (function(_this) {
            return function(memo, ranges, date) {
              return memo.concat(_.map(ranges.split(','), function(range) {
                return {
                  start: [date, _this.formatTime(range.split('-')[0])].join('T'),
                  end: [date, _this.formatTime(range.split('-')[1])].join('T')
                };
              }));
            };
          })(this), []);
        }
      },

      /***
      * @ngdoc method
      * @name toWeekdayEvents
      * @methodOf BB.Models:ScheduleRules
      *
      * @description
      * toWeekdayEvents
      *
       */
      toWeekdayEvents: function() {
        return _.reduce(this.filterRulesByWeekdays(), (function(_this) {
          return function(memo, ranges, day) {
            var date;
            date = moment().set('day', day).format('YYYY-MM-DD');
            return memo.concat(_.map(ranges.split(','), function(range) {
              return {
                start: [date, _this.formatTime(range.split('-')[0])].join('T'),
                end: [date, _this.formatTime(range.split('-')[1])].join('T')
              };
            }));
          };
        })(this), []);
      }
    };
  });

}).call(this);
