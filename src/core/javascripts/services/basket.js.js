
/***
* @ngdoc service
* @name BB.Services:BasketService
*
* @description
* Factory BasketService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
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
* - addItem(company, params)
* - applyCoupon(company, params)
* - updateBasket(company, params)
* - checkPrePaid(company, event, pre_paid_bookings)
* - query(company, params)
* - deleteItem(item, company, params)
* - checkout(company, basket, params)
* - empty(bb)
* - memberCheckout(basket, params)
* - applyDeal(company, params)
* - removeDeal(company, params)
*
 */

(function() {
  angular.module('BB.Services').factory("BasketService", function($q, $rootScope, BBModel, MutexService) {
    return {
      addItem: function(company, params) {
        var data, deferred, lnk;
        deferred = $q.defer();
        lnk = params.item.book_link;
        data = params.item.getPostData();
        if (!lnk) {
          deferred.reject("rel book not found for event");
        } else {
          MutexService.getLock().then(function(mutex) {
            return lnk.$post('book', params, data).then(function(basket) {
              var mbasket;
              MutexService.unlock(mutex);
              company.$flush('basket');
              mbasket = new BBModel.Basket(basket, params.bb);
              return basket.$get('items').then(function(items) {
                var i, item, j, len, promises;
                promises = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  item = new BBModel.BasketItem(i, params.bb);
                  mbasket.addItem(item);
                  promises = promises.concat(item.promises);
                }
                if (promises.length > 0) {
                  return $q.all(promises).then(function() {
                    return deferred.resolve(mbasket);
                  });
                } else {
                  return deferred.resolve(mbasket);
                }
              }, function(err) {
                return deferred.reject(err);
              });
            }, function(err) {
              MutexService.unlock(mutex);
              return deferred.reject(err);
            });
          });
        }
        return deferred.promise;
      },
      applyCoupon: function(company, params) {
        var deferred;
        deferred = $q.defer();
        MutexService.getLock().then(function(mutex) {
          return company.$post('coupon', {}, {
            coupon: params.coupon
          }).then(function(basket) {
            var mbasket;
            MutexService.unlock(mutex);
            company.$flush('basket');
            mbasket = new BBModel.Basket(basket, params.bb);
            return basket.$get('items').then(function(items) {
              var i, item, j, len, promises;
              promises = [];
              for (j = 0, len = items.length; j < len; j++) {
                i = items[j];
                item = new BBModel.BasketItem(i, params.bb);
                mbasket.addItem(item);
                promises = promises.concat(item.promises);
              }
              if (promises.length > 0) {
                return $q.all(promises).then(function() {
                  return deferred.resolve(mbasket);
                });
              } else {
                return deferred.resolve(mbasket);
              }
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        });
        return deferred.promise;
      },
      updateBasket: function(company, params) {
        var data, deferred, item, j, len, lnk, ref, xdata;
        deferred = $q.defer();
        data = {
          entire_basket: true,
          items: []
        };
        ref = params.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          if (item.book_link) {
            lnk = item.book_link;
          }
          xdata = item.getPostData();
          data.items.push(xdata);
        }
        if (!lnk) {
          deferred.reject("rel book not found for event");
          return deferred.promise;
        }
        MutexService.getLock().then(function(mutex) {
          return lnk.$post('book', params, data).then(function(basket) {
            var mbasket;
            MutexService.unlock(mutex);
            company.$flush('basket');
            mbasket = new BBModel.Basket(basket, params.bb);
            return basket.$get('items').then(function(items) {
              var i, k, len1, promises;
              promises = [];
              for (k = 0, len1 = items.length; k < len1; k++) {
                i = items[k];
                item = new BBModel.BasketItem(i, params.bb);
                mbasket.addItem(item);
                promises = promises.concat(item.promises);
              }
              if (promises.length > 0) {
                return $q.all(promises).then(function() {
                  return deferred.resolve(mbasket);
                });
              } else {
                return deferred.resolve(mbasket);
              }
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        });
        return deferred.promise;
      },
      checkPrePaid: function(company, event, pre_paid_bookings) {
        var booking, j, len, valid_pre_paid;
        valid_pre_paid = null;
        for (j = 0, len = pre_paid_bookings.length; j < len; j++) {
          booking = pre_paid_bookings[j];
          if (booking.checkValidity(event)) {
            valid_pre_paid = booking;
          }
        }
        return valid_pre_paid;
      },
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('basket')) {
          deferred.reject("rel basket not found for company");
        } else {
          company.$get('basket').then(function(basket) {
            basket = new BBModel.Basket(basket, params.bb);
            if (basket.$has('items')) {
              basket.$get('items').then(function(items) {
                var item, j, len, results;
                results = [];
                for (j = 0, len = items.length; j < len; j++) {
                  item = items[j];
                  results.push(basket.addItem(new BBModel.BasketItem(item, params.bb)));
                }
                return results;
              });
            }
            return deferred.resolve(basket);
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      deleteItem: function(item, company, params) {
        var deferred;
        if (!params) {
          params = {};
        }
        deferred = $q.defer();
        if (!item.$has('self')) {
          deferred.reject("rel self not found for item");
        } else {
          MutexService.getLock().then(function(mutex) {
            return item.$del('self', params).then(function(basket) {
              MutexService.unlock(mutex);
              company.$flush('basket');
              basket = new BBModel.Basket(basket, params.bb);
              if (basket.$has('items')) {
                basket.$get('items').then(function(items) {
                  var j, len, results;
                  results = [];
                  for (j = 0, len = items.length; j < len; j++) {
                    item = items[j];
                    results.push(basket.addItem(new BBModel.BasketItem(item, params.bb)));
                  }
                  return results;
                });
              }
              return deferred.resolve(basket);
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      checkout: function(company, basket, params) {
        var data, deferred;
        deferred = $q.defer();
        if (!basket.$has('checkout')) {
          deferred.reject("rel checkout not found for basket");
        } else {
          data = basket.getPostData();
          if (params.bb.qudini_booking_id) {
            data.qudini_booking_id = params.bb.qudini_booking_id;
          }
          data.affiliate_id = $rootScope.affiliate_id;
          MutexService.getLock().then(function(mutex) {
            return basket.$post('checkout', params, data).then(function(total) {
              var tot;
              MutexService.unlock(mutex);
              $rootScope.$broadcast('updateBookings');
              tot = new BBModel.Purchase.Total(total);
              $rootScope.$broadcast('newCheckout', tot);
              basket.clear();
              return deferred.resolve(tot);
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      empty: function(bb) {
        var deferred;
        deferred = $q.defer();
        MutexService.getLock().then(function(mutex) {
          return bb.company.$del('basket').then(function(basket) {
            MutexService.unlock(mutex);
            bb.company.$flush('basket');
            return deferred.resolve(new BBModel.Basket(basket, bb));
          }, function(err) {
            return deferred.reject(err);
          });
        }, function(err) {
          MutexService.unlock(mutex);
          return deferred.reject(err);
        });
        return deferred.promise;
      },
      memberCheckout: function(basket, params) {
        var data, deferred, item;
        deferred = $q.defer();
        if (!basket.$has('checkout')) {
          deferred.reject("rel checkout not found for basket");
        } else if ($rootScope.member === null) {
          deferred.reject("member not set");
        } else {
          basket._data.setOption('auth_token', $rootScope.member._data.getOption('auth_token'));
          data = {
            items: (function() {
              var j, len, ref, results;
              ref = basket.items;
              results = [];
              for (j = 0, len = ref.length; j < len; j++) {
                item = ref[j];
                results.push(item._data);
              }
              return results;
            })()
          };
          basket.$post('checkout', params, data).then(function(total) {
            if (total.$has('member')) {
              total.$get('member').then(function(member) {
                $rootScope.member.flushBookings();
                return $rootScope.member = new BBModel.Member.Member(member);
              });
            }
            return deferred.resolve(total);
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      applyDeal: function(company, params) {
        var deferred;
        deferred = $q.defer();
        MutexService.getLock().then(function(mutex) {
          return params.bb.basket.$post('deal', {}, {
            deal_code: params.deal_code
          }).then(function(basket) {
            var mbasket;
            MutexService.unlock(mutex);
            company.$flush('basket');
            mbasket = new BBModel.Basket(basket, params.bb);
            return basket.$get('items').then(function(items) {
              var i, item, j, len, promises;
              promises = [];
              for (j = 0, len = items.length; j < len; j++) {
                i = items[j];
                item = new BBModel.BasketItem(i, params.bb);
                mbasket.addItem(item);
                promises = promises.concat(item.promises);
              }
              if (promises.length > 0) {
                return $q.all(promises).then(function() {
                  return deferred.resolve(mbasket);
                });
              } else {
                return deferred.resolve(mbasket);
              }
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        });
        return deferred.promise;
      },
      removeDeal: function(company, params) {
        var deferred;
        if (!params) {
          params = {};
        }
        deferred = $q.defer();
        if (!params.bb.basket.$has('deal')) {
          return deferred.reject("No Remove Deal link found");
        } else {
          MutexService.getLock().then(function(mutex) {
            return params.bb.basket.$put('deal', {}, {
              deal_code_id: params.deal_code_id.toString()
            }).then(function(basket) {
              MutexService.unlock(mutex);
              company.$flush('basket');
              basket = new BBModel.Basket(basket, params.bb);
              if (basket.$has('items')) {
                return basket.$get('items').then(function(items) {
                  var item, j, len;
                  for (j = 0, len = items.length; j < len; j++) {
                    item = items[j];
                    basket.addItem(new BBModel.BasketItem(item, params.bb));
                  }
                  return deferred.resolve(basket);
                }, function(err) {
                  return deferred.reject(err);
                });
              }
            }, function(err) {
              MutexService.unlock(mutex);
              return deferred.reject(err);
            });
          });
          return deferred.promise;
        }
      }
    };
  });

}).call(this);
