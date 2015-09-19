(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbPackagePicker
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbPackagePicker
  *
  * See Controller {@link BB.Controllers:PackagePicker PackagePicker}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope : true
  * controller : 'PackagePicker'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbPackagePicker', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PackagePicker'
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:PackagePicker
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PackagePicker
  *
  * # Has the following set of methods:
  *
  * - $scope.loadDay()
  * - $scope.selectSlot(sel_item, slot)
  * - $scope.hasAvailability(slots, start_time, end_time)
  * - $scope.confirm()
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
   */

  angular.module('BB.Controllers').controller('PackagePicker', function($scope, $rootScope, $q, TimeService, BBModel) {
    $scope.controller = "public.controllers.PackagePicker";
    $scope.sel_date = moment().add(1, 'days');
    $scope.selected_date = $scope.sel_date.toDate();
    $scope.picked_time = false;
    $scope.$watch('selected_date', (function(_this) {
      return function(newv, oldv) {
        $scope.sel_date = moment(newv);
        return $scope.loadDay();
      };
    })(this));
    $scope.loadDay = (function(_this) {
      return function() {
        var i, item, len, pslots, ref;
        $scope.timeSlots = [];
        $scope.notLoaded($scope);
        pslots = [];
        ref = $scope.stackedItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          pslots.push(TimeService.query({
            company: $scope.bb.company,
            cItem: item,
            date: $scope.sel_date,
            client: $scope.client
          }));
        }
        return $q.all(pslots).then(function(res) {
          var _i, earliest, j, k, l, latest, len1, len2, len3, len4, len5, m, n, next_earliest, next_latest, ref1, ref2, ref3, ref4, ref5, results, slot;
          $scope.setLoaded($scope);
          $scope.data_valid = true;
          $scope.timeSlots = [];
          ref1 = $scope.stackedItems;
          for (_i = j = 0, len1 = ref1.length; j < len1; _i = ++j) {
            item = ref1[_i];
            item.slots = res[_i];
            if (!item.slots || item.slots.length === 0) {
              $scope.data_valid = false;
            }
            item.order = _i;
          }
          if ($scope.data_valid) {
            $scope.timeSlots = res;
            earliest = null;
            ref2 = $scope.stackedItems;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              item = ref2[k];
              next_earliest = null;
              ref3 = item.slots;
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                slot = ref3[l];
                if (earliest && slot.time < earliest) {
                  slot.disable();
                } else if (!next_earliest) {
                  next_earliest = slot.time + item.service.duration;
                }
              }
              earliest = next_earliest;
            }
            latest = null;
            ref4 = $scope.bb.stacked_items.slice(0).reverse();
            results = [];
            for (m = 0, len4 = ref4.length; m < len4; m++) {
              item = ref4[m];
              next_latest = null;
              ref5 = item.slots;
              for (n = 0, len5 = ref5.length; n < len5; n++) {
                slot = ref5[n];
                if (latest && slot.time > latest) {
                  slot.disable();
                } else {
                  next_latest = slot.time - item.service.duration;
                }
              }
              results.push(latest = next_latest);
            }
            return results;
          }
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(sel_item, slot) {
        var count, current, i, item, j, k, latest, len, len1, len2, next, ref, ref1, slots, time;
        ref = $scope.stackedItems;
        for (count = i = 0, len = ref.length; i < len; count = ++i) {
          item = ref[count];
          if (count === sel_item.order) {
            item.setDate(new BBModel.Day({
              date: $scope.sel_date.format(),
              spaces: 1
            }));
            item.setTime(slot);
            next = slot.time + item.service.duration;
            time = slot.time;
            slot = null;
            if (count > 0) {
              current = count - 1;
              while (current >= 0) {
                item = $scope.bb.stacked_items[current];
                latest = time - item.service.duration;
                if (!item.time || item.time.time > latest) {
                  item.setDate(new BBModel.Day({
                    date: $scope.sel_date.format(),
                    spaces: 1
                  }));
                  item.setTime(null);
                  ref1 = item.slots;
                  for (j = 0, len1 = ref1.length; j < len1; j++) {
                    slot = ref1[j];
                    if (slot.time < latest) {
                      item.setTime(slot);
                    }
                  }
                }
                time = item.time.time;
                current -= 1;
              }
            }
          } else if (count > sel_item.order) {
            slots = item.slots;
            item.setDate(new BBModel.Day({
              date: $scope.sel_date.format(),
              spaces: 1
            }));
            if (slots) {
              item.setTime(null);
              for (k = 0, len2 = slots.length; k < len2; k++) {
                slot = slots[k];
                if (slot.time >= next && !item.time) {
                  item.setTime(slot);
                  next = slot.time + item.service.duration;
                }
              }
            }
          }
        }
        return $scope.picked_time = true;
      };
    })(this);
    $scope.hasAvailability = (function(_this) {
      return function(slots, start_time, end_time) {
        var i, j, k, l, len, len1, len2, len3, slot;
        if (!slots) {
          return false;
        }
        if (start_time && end_time) {
          for (i = 0, len = slots.length; i < len; i++) {
            slot = slots[i];
            if (slot.time >= start_time && slot.time < end_time && slot.availability() > 0) {
              return true;
            }
          }
        } else if (end_time) {
          for (j = 0, len1 = slots.length; j < len1; j++) {
            slot = slots[j];
            if (slot.time < end_time && slot.availability() > 0) {
              return true;
            }
          }
        } else if (start_time) {
          for (k = 0, len2 = slots.length; k < len2; k++) {
            slot = slots[k];
            if (slot.time >= start_time && slot.availability() > 0) {
              return true;
            }
          }
        } else {
          for (l = 0, len3 = slots.length; l < len3; l++) {
            slot = slots[l];
            if (slot.availability() > 0) {
              return true;
            }
          }
        }
      };
    })(this);
    return $scope.confirm = (function(_this) {
      return function() {};
    })(this);
  });

}).call(this);
