
/***
* @ngdoc service
* @name BBAdmin.Services:AdminBookingService
*
* @description
* <br> ---------------------------------------------------------------------------------
* <br> NOTE
* <br> This is the TEST file.
* <br> Formatting of the documentation for this kind of functionality should be done first here
* <br> !To avoid repetition and to mentain consistency.
* <br> After the documentation for TEST file it is defined other files that have the same pattern can be also documented
* <br> This should be the file that sets the STANDARD.
* <br> ---------------------------------------------------------------------------------<br><br>
* Factory AdminBookingService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q read more}
*
* @param {object} $window A reference to the browser's window object.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$window read more}
*
* @param {model} BookingCollections Info
*
* @param {model} halClient Info
*
* @param {service} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @param {constant} UriTemplate Info
* <br>
* {@link UriTemplate more}
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('AdminBookingService', function($q, $window, halClient, BookingCollections, BBModel, UriTemplate) {
    return {

      /***
      * @ngdoc method
      * @name query
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method query
      *
      * @param {Promise} prms Info
      *
      * @returns {Promise} deferred.promise
       */
      query: function(prms) {
        var deferred, existing, href, uri, url;
        if (prms.slot) {
          prms.slot_id = prms.slot.id;
        }
        if (prms.date) {
          prms.start_date = prms.date;
          prms.end_date = prms.date;
        }
        if (prms.per_page == null) {
          prms.per_page = 1024;
        }
        if (prms.include_cancelled == null) {
          prms.include_cancelled = false;
        }
        deferred = $q.defer();
        existing = BookingCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else if (prms.company) {
          prms.company.$get('bookings', prms).then(function(collection) {
            return collection.$get('bookings').then(function(bookings) {
              var b, models;
              models = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Admin.Booking(b));
                }
                return results;
              })();
              return deferred.resolve(models);
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            return deferred.reject(err);
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('bookings').then(function(items) {
                var i, item, len, sitems, spaces;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Booking(item));
                }
                spaces = new $window.Collection.Booking(found, sitems, prms);
                BookingCollections.add(spaces);
                return deferred.resolve(spaces);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name getBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method getBooking.
      *
      * If a company exists and don't have an id it gets one
      * <pre>
      * if prms.company && !prms.company_id prms.company_id = prms.company.id
      * </pre>
      *
      * Gets the href for boogking
      * <pre>
      * href = "/api/v1/admin/{company_id}/bookings/{id}{?embed}"
      * </pre>
      *
      * Is created a new uri
      * <pre>
      * uri = new UriTemplate(href).fillFromObject(prms || {})
      * </pre>
      *
      * If the promise is resolved
      * <pre>
      * deferred.resolve(booking)
      * </pre>
      *
      * If the promise is rejected it displays an error
      * <pre>
      * deferred.reject(err)
      * </pre>
      *
      * Newly created deferred object return its promise property
      * <pre>
      * deferred.promise
      * </pre>
      *
      * @param {Promise} prms Info
      *
      * @returns {Promise} deferred.promise
       */
      getBooking: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        if (prms.company && !prms.company_id) {
          prms.company_id = prms.company.id;
        }
        href = "/api/v1/admin/{company_id}/bookings/{id}{?embed}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$get(uri, {
          no_cache: true
        }).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name cancelBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method cancelBooking
      *
      * It creates a new deferred object, then return its promise property.
      * <pre>
      * deferred = $q.defer()
      * </pre>
      *
      * Gets the href for boogking
      * <pre>
      * href = "/api/v1/admin/{company_id}/bookings/{id}?notify={notify}"
      * </pre>
      *
      * Is created a new uri
      * <pre>
      * uri = new UriTemplate(href).fillFromObject(prms || {})
      * </pre>
      *
      * If the promise is resolved the booking is canceled
      * <pre>
      * deferred.resolve(booking)
      * </pre>
      *
      * If the promise is rejected it displays an error
      * <pre>
      * deferred.reject(err)
      * </pre>
      *
      * Newly created deferred object return its promise property
      * <pre>
      * deferred.promise
      * </pre>
      *
      * @param {Promise} prms Info
      *
      * @param {object} booking Info
      *
      * @returns {Promise} deferred.promise
       */
      cancelBooking: function(prms, booking) {
        var deferred, href, notify, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}?notify={notify}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        notify = prms.notify;
        if (notify == null) {
          notify = true;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {
          notify: notify
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name updateBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method updateBooking
      *
      * It creates a new deferred object, then return its promise property.
      * <pre>
      * deferred = $q.defer()
      * </pre>
      *
      * Gets the href for boogking
      * <pre>
      * href = "/api/v1/admin/{company_id}/bookings/{id}"
      * </pre>
      *
      * Is created a new uri
      * <pre>
      * uri = new UriTemplate(href).fillFromObject(prms || {})
      * </pre>
      *
      * If the promise is resolved the booking is updated
      * <pre>
      * deferred.resolve(booking)
      * </pre>
      *
      * If the promise is rejected it displays an error
      * <pre>
      * deferred.reject(err)
      * </pre>
      *
      * Newly created deferred object return its promise property
      * <pre>
      * deferred.promise
      * </pre>
      *
      * @param {Promise} prms Info
      *
      * @param {object} booking Info
      *
      * @returns {Promise} deferred.promise
       */
      updateBooking: function(prms, booking) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name blockTimeForPerson
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method blockTimeForPerson
      *
      * It creates a new deferred object, then return its promise property.
      * <pre>
      * deferred = $q.defer()
      * </pre>
      *
      * Gets the href for boogking
      * <pre>
      * href = "/api/v1/admin/{company_id}/people/{person_id}/block"
      * </pre>
      *
      * Is created a new uri
      * <pre>
      * uri = new UriTemplate(href).fillFromObject(prms || {})
      * </pre>
      *
      * halClien.$put
      * <br>
      * It creates a new Booking Model for Admin in BBmodel module
      * <pre>
      * uri = new UriTemplate(href).fillFromObject(prms || {})
      * </pre>
      *
      * If the promise is resolved the booking is updated
      * <pre>
      * deferred.resolve(booking)
      * </pre>
      *
      * If the promise is rejected it displays an error
      * <pre>
      * deferred.reject(err)
      * </pre>
      *
      * Newly created deferred object return its promise property
      * <pre>
      * deferred.promise
      * </pre>
      *
      * @param {Promise} prms Info
      *
      * @param {object} person Info
      *
      * @returns {Promise} deferred.promise
       */
      blockTimeForPerson: function(prms, person) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/people/{person_id}/block";
        if (prms.person_id == null) {
          prms.person_id = person.id;
        }
        prms.booking = true;
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name addStatusToBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method addStatusToBooking
      *
      * @param {Promise} prms Info
      * @param {object} booking Info
      * @param {String} status Info
      *
      * @returns {Promise} deferred.promise
       */
      addStatusToBooking: function(prms, booking, status) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/multi_status";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          status: status
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name addPrivateNoteToBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method addPrivateNoteToBooking
      *
      * @param {Promise} prms Info
      * @param {object} booking Info
      * @param {object} note Info
      *
      * @returns {Promise} deferred.promise
       */
      addPrivateNoteToBooking: function(prms, booking, note) {
        var deferred, href, noteParam, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (note.note != null) {
          noteParam = note.note;
        }
        if (noteParam == null) {
          noteParam = note;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: noteParam
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name updatePrivateNoteForBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method updatePrivateNoteForBooking
      *
      * @param {Promise} prms Info
      * @param {object} booking Info
      * @param {object} note Info
      *
      * @returns {Promise} deferred.promise
       */
      updatePrivateNoteForBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: note.note
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },

      /***
      * @ngdoc method
      * @name deletePrivateNoteFromBooking
      * @methodOf BBAdmin.Services:AdminBookingService
      *
      * @description
      * Method deletePrivateNoteFromBooking
      *
      * @param {Promise} prms Info
      * @param {object} booking Info
      * @param {object} note Info
      *
      * @returns {Promise} deferred.promise
       */
      deletePrivateNoteFromBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {}).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
