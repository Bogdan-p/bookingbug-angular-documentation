
/***
* @ngdoc object
* @name BB.Models:BBModel
*
* @description
* Build a dynamic injector for each of the models.
* This creates a service that is capable of creating any given model.
* It uses dynamic injection, to avoid a cuicular dependancy -
* as any model needs to be able to create instances of other models
*
* @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @requires {service} $injector $injector is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.
* <br>
* {@link https://docs.angularjs.org/api/auto/service/$injector read more}
*
*
 */

(function() {
  angular.module('BB.Models').service("BBModel", function($q, $injector) {
    var admin_models, afuncs, fn, fn1, fn2, fn3, funcs, i, j, k, l, len, len1, len2, len3, member_models, mfuncs, model, models, pfuncs, purchase_models;
    models = ['Address', 'Answer', 'Affiliate', 'Basket', 'BasketItem', 'BookableItem', 'Category', 'Client', 'ClientDetails', 'Company', 'CompanySettings', 'Day', 'Event', 'EventChain', 'EventGroup', 'EventTicket', 'EventSequence', 'ItemDetails', 'Person', 'PurchaseItem', 'PurchaseTotal', 'Question', 'Resource', 'Service', 'Slot', 'Space', 'SurveyQuestion', 'TimeSlot', 'BusinessQuestion', 'Image', 'Deal', 'PrePaidBooking'];
    funcs = {};
    fn = (function(_this) {
      return function(model) {
        return funcs[model] = function(p1, p2) {
          return new ($injector.get(model + "Model"))(p1, p2);
        };
      };
    })(this);
    for (i = 0, len = models.length; i < len; i++) {
      model = models[i];
      fn(model);
    }
    purchase_models = ['Booking', 'Total', 'CourseBooking'];
    pfuncs = {};
    fn1 = (function(_this) {
      return function(model) {
        return pfuncs[model] = function(init) {
          return new ($injector.get("Purchase." + model + "Model"))(init);
        };
      };
    })(this);
    for (j = 0, len1 = purchase_models.length; j < len1; j++) {
      model = purchase_models[j];
      fn1(model);
    }
    funcs['Purchase'] = pfuncs;
    member_models = ['Member', 'Booking', 'PrePaidBooking'];
    mfuncs = {};
    fn2 = (function(_this) {
      return function(model) {
        return mfuncs[model] = function(init) {
          return new ($injector.get("Member." + model + "Model"))(init);
        };
      };
    })(this);
    for (k = 0, len2 = member_models.length; k < len2; k++) {
      model = member_models[k];
      fn2(model);
    }
    funcs['Member'] = mfuncs;
    admin_models = ['Booking', 'Slot', 'User', 'Administrator', 'Schedule', 'Address', 'Resource', 'Person', 'Service', 'Login', 'EventChain', 'EventGroup', 'Event', 'Queuer', 'ClientQueue', 'Clinic'];
    afuncs = {};
    fn3 = (function(_this) {
      return function(model) {
        return afuncs[model] = function(init) {
          return new ($injector.get("Admin." + model + "Model"))(init);
        };
      };
    })(this);
    for (l = 0, len3 = admin_models.length; l < len3; l++) {
      model = admin_models[l];
      fn3(model);
    }
    funcs['Admin'] = afuncs;
    return funcs;
  });


  /***
  * @ngdoc object
  * @name BB.Models:BaseModel
  *
  * @description
  * Build a dynamic injector for each of the models.
  * This creates a service that is capable of creating any given model.
  * It uses dynamic injection, to avoid a cuicular dependancy -
  * as any model needs to be able to create instances of other models
  *
  * @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q read more}
  *
  * @requires {service} $injector $injector is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.
  * <br>
  * {@link https://docs.angularjs.org/api/auto/service/$injector more}
  *
  * @requires {service} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope more}
  *
  * @requires {service} $timeout Angular's wrapper for window.setTimeout.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$timeoutmore}
  *
  * @returns {object} Newly created Base object with the following set of methods:
  *
  * - constructor(data)
  * - updateModel(data)
  * - _snakeToCamel(s)
  * - $buildOject(link)
  * - $buildOjectPromise(link)
  * - get(ikey)
  * - set(ikey, value)
  * - $href(rel, params)
  * - $has(rel)
  * - $flush(rel, params)
  * - $get(rel, params)
  * - $post(rel, params, dat)
  * - $put(rel, params, dat)
  * - $patch(rel, params, dat)
  * - $del(rel, params)
  * - $links()
  * - $toStore()
  *
   */

  angular.module('BB.Models').service("BaseModel", function($q, $injector, $rootScope, $timeout) {
    var Base;
    return Base = (function() {
      function Base(data) {
        this.deleted = false;
        this.updateModel(data);
      }

      Base.prototype.updateModel = function(data) {
        var link, links, m, n, name, obj, results;
        if (data) {
          this._data = data;
        }
        if (data) {
          for (n in data) {
            m = data[n];
            this[n] = m;
          }
        }
        if (this._data && this._data.$href) {
          this.self = this._data.$href("self");
          links = this.$links();
          this.__linkedData = {};
          this.__linkedPromises = {};
          results = [];
          for (link in links) {
            obj = links[link];
            name = this._snakeToCamel("get_" + link);
            results.push((function(_this) {
              return function(link, obj, name) {
                if (!_this[name]) {
                  _this[name] = function() {
                    return this.$buildOject(link);
                  };
                }
                if (!_this[name + "Promise"]) {
                  return _this[name + "Promise"] = function() {
                    return this.$buildOjectPromise(link);
                  };
                }
              };
            })(this)(link, obj, name));
          }
          return results;
        }
      };

      Base.prototype._snakeToCamel = function(s) {
        return s.replace(/(\_\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      };

      Base.prototype.$buildOject = function(link) {
        if (this.__linkedData[link]) {
          return this.__linkedData[link];
        }
        this.$buildOjectPromise(link).then((function(_this) {
          return function(ans) {
            _this.__linkedData[link] = ans;
            return $timeout(function() {
              return _this.__linkedData[link] = ans;
            });
          };
        })(this));
        return null;
      };

      Base.prototype.$buildOjectPromise = function(link) {
        var prom;
        if (this.__linkedPromises[link]) {
          return this.__linkedPromises[link];
        }
        prom = $q.defer();
        this.__linkedPromises[link] = prom.promise;
        this.$get(link).then((function(_this) {
          return function(res) {
            var inj;
            inj = $injector.get('BB.Service.' + link);
            if (inj) {
              if (inj.promise) {
                return inj.unwrap(res).then(function(ans) {
                  return prom.resolve(ans);
                }, function(err) {
                  return prom.reject(err);
                });
              } else {
                return prom.resolve(inj.unwrap(res));
              }
            } else {
              return prom.resolve(res);
            }
          };
        })(this), function(err) {
          return prom.reject(err);
        });
        return this.__linkedPromises[link];
      };

      Base.prototype.get = function(ikey) {
        if (!this._data) {
          return null;
        }
        return this._data[ikey];
      };

      Base.prototype.set = function(ikey, value) {
        if (!this._data) {
          return null;
        }
        return this._data[ikey] = value;
      };

      Base.prototype.$href = function(rel, params) {
        if (this._data) {
          return this._data.$href(rel, params);
        }
      };

      Base.prototype.$has = function(rel) {
        if (this._data) {
          return this._data.$has(rel);
        }
      };

      Base.prototype.$flush = function(rel, params) {
        if (this._data) {
          return this._data.$href(rel, params);
        }
      };

      Base.prototype.$get = function(rel, params) {
        if (this._data) {
          return this._data.$get(rel, params);
        }
      };

      Base.prototype.$post = function(rel, params, dat) {
        if (this._data) {
          return this._data.$post(rel, params, dat);
        }
      };

      Base.prototype.$put = function(rel, params, dat) {
        if (this._data) {
          return this._data.$put(rel, params, dat);
        }
      };

      Base.prototype.$patch = function(rel, params, dat) {
        if (this._data) {
          return this._data.$patch(rel, params, dat);
        }
      };

      Base.prototype.$del = function(rel, params) {
        if (this._data) {
          return this._data.$del(rel, params);
        }
      };

      Base.prototype.$links = function() {
        if (this._data) {
          return this._data.$links();
        }
      };

      Base.prototype.$toStore = function() {
        if (this._data) {
          return this._data.$toStore();
        }
      };

      return Base;

    })();
  });

}).call(this);
