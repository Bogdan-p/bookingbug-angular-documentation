(function() {
  'use strict';

  /***
  * @ngdoc directive
  * @name BB.Directives:bbPeople
  * @restrict AE
  * @scope true
  *
  * @description
  * {@link https://docs.angularjs.org/guide/directive more about Directives}
  
  * Directive BB.Directives:bbPeople
  *
  * See Controller {@link BB.Controllers:PersonList PersonList}
  *
  * <pre>
  * restrict: 'AE'
  * replace: true
  * scope: true
  * controller: 'PersonList'
  * </pre>
  *
   */
  angular.module('BB.Directives').directive('bbPeople', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PersonList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
      }
    };
  });


  /***
  * @ngdoc controller
  * @name BB.Controllers:PersonList
  *
  * @description
  * {@link https://docs.angularjs.org/guide/controller more about Controllers}
  *
  * Controller PersonList
  *
  * # Has the following set of methods:
  *
  * - loadData()
  * - setPerson(people)
  * - getItemFromPerson(person)
  * - $scope.selectItem(item, route)
  * - $scope.selectAndRoute(item, route)
  * - $scope.$watch 'person',(newval, oldval)
  * - $scope.setReady()
  *
  * @param {service} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope more}
  *
  * @param {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @param {service} PageControllerService Info
  * <br>
  * {@link BB.Services:PageControllerService more}
  *
  * @param {service} PersonService Info
  * <br>
  * {@link BB.Services:PersonService more}
  *
   */

  angular.module('BB.Controllers').controller('PersonList', function($scope, $rootScope, PageControllerService, PersonService, ItemService, $q, BBModel, PersonModel, FormDataStoreService) {
    var getItemFromPerson, loadData, setPerson;
    $scope.controller = "public.controllers.PersonList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then(function() {
      return loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    loadData = function() {
      var bi, ppromise;
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      bi = $scope.booking_item;
      if (!bi.service || bi.service === $scope.change_watch_item) {
        if (!bi.service) {
          $scope.setLoaded($scope);
        }
        return;
      }
      $scope.change_watch_item = bi.service;
      $scope.notLoaded($scope);
      ppromise = PersonService.query($scope.bb.company);
      ppromise.then(function(people) {
        if (bi.group) {
          people = people.filter(function(x) {
            return !x.group_id || x.group_id === bi.group;
          });
        }
        return $scope.all_people = people;
      });
      return ItemService.query({
        company: $scope.bb.company,
        cItem: bi,
        wait: ppromise,
        item: 'person'
      }).then(function(items) {
        var i, j, len, promises;
        if (bi.group) {
          items = items.filter(function(x) {
            return !x.group_id || x.group_id === bi.group;
          });
        }
        promises = [];
        for (j = 0, len = items.length; j < len; j++) {
          i = items[j];
          promises.push(i.promise);
        }
        return $q.all(promises).then((function(_this) {
          return function(res) {
            var k, len1, people;
            people = [];
            for (k = 0, len1 = items.length; k < len1; k++) {
              i = items[k];
              people.push(i.item);
              if (bi && bi.person && bi.person.self === i.item.self) {
                $scope.person = i.item;
                $scope.selected_bookable_items = [i];
              }
              if (bi && bi.selected_person && bi.selected_person.item.self === i.item.self) {
                bi.selected_person = i;
              }
            }
            if (items.length === 1 && $scope.bb.company.settings && $scope.bb.company.settings.merge_people) {
              if (!$scope.selectItem(items[0], $scope.nextRoute)) {
                setPerson(people);
                $scope.bookable_items = items;
                $scope.selected_bookable_items = items;
              } else {
                $scope.skipThisStep();
              }
            } else {
              setPerson(people);
              $scope.bookable_items = items;
              if (!$scope.selected_bookable_items) {
                $scope.selected_bookable_items = items;
              }
            }
            return $scope.setLoaded($scope);
          };
        })(this));
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    setPerson = function(people) {
      $scope.bookable_people = people;
      if ($scope.person) {
        return _.each(people, function(person) {
          if (person.id === $scope.person.id) {
            return $scope.person = person;
          }
        });
      }
    };
    getItemFromPerson = (function(_this) {
      return function(person) {
        var item, j, len, ref;
        if (person instanceof PersonModel) {
          if ($scope.bookable_items) {
            ref = $scope.bookable_items;
            for (j = 0, len = ref.length; j < len; j++) {
              item = ref[j];
              if (item.item.self === person.self) {
                return item;
              }
            }
          }
        }
        return person;
      };
    })(this);
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.person = item;
          return false;
        } else {
          $scope.booking_item.setPerson(getItemFromPerson(item));
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.selectAndRoute = (function(_this) {
      return function(item, route) {
        $scope.booking_item.setPerson(getItemFromPerson(item));
        $scope.decideNextPage(route);
        return true;
      };
    })(this);
    $scope.$watch('person', (function(_this) {
      return function(newval, oldval) {
        if ($scope.person && $scope.booking_item) {
          if (!$scope.booking_item.person || $scope.booking_item.person.self !== $scope.person.self) {
            $scope.booking_item.setPerson(getItemFromPerson($scope.person));
            return $scope.broadcastItemUpdate();
          }
        } else if (newval !== oldval) {
          $scope.booking_item.setPerson(null);
          return $scope.broadcastItemUpdate();
        }
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return loadData();
    });
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.person) {
          $scope.booking_item.setPerson(getItemFromPerson($scope.person));
          return true;
        } else {
          $scope.booking_item.setPerson(null);
          return true;
        }
      };
    })(this);
  });

}).call(this);
