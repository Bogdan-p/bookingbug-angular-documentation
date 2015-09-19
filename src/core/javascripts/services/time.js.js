
/***
* @ngdoc service
* @name BB.Services:TimeService
*
* @description
* Factory TimeService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {model} halClient Info
*
* @returns {Promise} This service has the following set of methods:
*
* - query(prms)
* - merge_times(all_events, service, item)
* - checkCurrentItem(item, sorted_times, ev)
*
 */

(function() {
  angular.module('BB.Services').factory("TimeService", function($q, BBModel, halClient) {
    return {
      query: function(prms) {
        var date, deferred, extra, item_link;
        deferred = $q.defer();
        if (prms.date) {
          date = prms.date.toISODate();
        } else {
          if (!prms.cItem.date) {
            deferred.reject("No date set");
            return deferred.promise;
          } else {
            date = prms.cItem.date.date.toISODate();
          }
        }
        if (prms.duration == null) {
          if (prms.cItem && prms.cItem.duration) {
            prms.duration = prms.cItem.duration;
          }
        }
        item_link = prms.item_link;
        if (prms.cItem && prms.cItem.days_link && !item_link) {
          item_link = prms.cItem.days_link;
        }
        if (item_link) {
          extra = {
            date: date
          };
          if (prms.location) {
            extra.location = prms.location;
          }
          if (prms.cItem.event_id) {
            extra.event_id = prms.cItem.event_id;
          }
          if (prms.cItem.person && !prms.cItem.anyPerson() && !item_link.event_id && !extra.event_id) {
            extra.person_id = prms.cItem.person.id;
          }
          if (prms.cItem.resource && !prms.cItem.anyResource() && !item_link.event_id && !extra.event_id) {
            extra.resource_id = prms.cItem.resource.id;
          }
          if (prms.end_date) {
            extra.end_date = prms.end_date.toISODate();
          }
          extra.duration = prms.duration;
          extra.num_resources = prms.num_resources;
          if (extra.event_id) {
            item_link = prms.company;
          }
          item_link.$get('times', extra).then((function(_this) {
            return function(results) {
              var times;
              if (results.$has('date_links')) {
                return results.$get('date_links').then(function(all_days) {
                  var all_days_def, date_times, day, fn, j, len;
                  date_times = {};
                  all_days_def = [];
                  fn = function(day) {
                    var times;
                    day.elink = $q.defer();
                    all_days_def.push(day.elink.promise);
                    if (day.$has('event_links')) {
                      return day.$get('event_links').then(function(all_events) {
                        var times;
                        times = _this.merge_times(all_events, prms.cItem.service, prms.cItem);
                        if (prms.available) {
                          times = _.filter(times, function(t) {
                            return t.avail >= prms.available;
                          });
                        }
                        date_times[day.date] = times;
                        return day.elink.resolve();
                      });
                    } else if (day.times) {
                      times = _this.merge_times([day], prms.cItem.service, prms.cItem);
                      if (prms.available) {
                        times = _.filter(times, function(t) {
                          return t.avail >= prms.available;
                        });
                      }
                      date_times[day.date] = times;
                      return day.elink.resolve();
                    }
                  };
                  for (j = 0, len = all_days.length; j < len; j++) {
                    day = all_days[j];
                    fn(day);
                  }
                  return $q.all(all_days_def).then(function() {
                    return deferred.resolve(date_times);
                  });
                });
              } else if (results.$has('event_links')) {
                return results.$get('event_links').then(function(all_events) {
                  var times;
                  times = _this.merge_times(all_events, prms.cItem.service, prms.cItem);
                  if (prms.available) {
                    times = _.filter(times, function(t) {
                      return t.avail >= prms.available;
                    });
                  }
                  return deferred.resolve(times);
                });
              } else if (results.times) {
                times = _this.merge_times([results], prms.cItem.service, prms.cItem);
                if (prms.available) {
                  times = _.filter(times, function(t) {
                    return t.avail >= prms.available;
                  });
                }
                return deferred.resolve(times);
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        } else {
          deferred.reject("No day data");
        }
        return deferred.promise;
      },
      merge_times: function(all_events, service, item) {
        var date_times, ev, i, j, k, l, len, len1, len2, ref, sorted_times, times;
        if (!all_events || all_events.length === 0) {
          return [];
        }
        sorted_times = [];
        for (j = 0, len = all_events.length; j < len; j++) {
          ev = all_events[j];
          if (ev.times) {
            ref = ev.times;
            for (k = 0, len1 = ref.length; k < len1; k++) {
              i = ref[k];
              if (!sorted_times[i.time] || sorted_times[i.time].avail === 0 || (Math.floor(Math.random() * all_events.length) === 0 && i.avail > 0)) {
                i.event_id = ev.event_id;
                sorted_times[i.time] = i;
              }
            }
            if (item.held) {
              this.checkCurrentItem(item.held, sorted_times, ev);
            }
            this.checkCurrentItem(item, sorted_times, ev);
          }
        }
        times = [];
        date_times = {};
        for (l = 0, len2 = sorted_times.length; l < len2; l++) {
          i = sorted_times[l];
          if (i) {
            times.push(new BBModel.TimeSlot(i, service));
          }
        }
        return times;
      },
      checkCurrentItem: function(item, sorted_times, ev) {
        if (item && item.id && item.event_id === ev.event_id && item.time && !sorted_times[item.time.time] && item.date && item.date.date.toISODate() === ev.date) {
          sorted_times[item.time.time] = item.time;
          return halClient.clearCache(ev.$href("self"));
        } else if (item && item.id && item.event_id === ev.event_id && item.time && sorted_times[item.time.time] && item.date && item.date.date.toISODate() === ev.date) {
          return sorted_times[item.time.time].avail = 1;
        }
      }
    };
  });

}).call(this);
