
/***
* @ngdoc service
* @name BB.Services:BB.Service.address
*
* @description
* Factory MyService
*
* @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
* <br>
* {@link https://docs.angularjs.org/api/ng/service/$q more}
*
* @param {model} BBModel Info
* <br>
* {@link BB.Models:BBModel more}
*
* @returns {Promise} This service has the following set of methods:
*
 */

(function() {
  angular.module('BB.Services').factory("BB.Service.address", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Address(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.person", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Person(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.people", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('people').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Person(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.resource", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Resource(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.resources", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('resources').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Resource(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.service", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Service(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.services", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('services').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Service(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_group", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.EventGroup(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_groups", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('event_groups').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.EventGroup(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_chain", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.EventChain(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.category", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Category(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.categories", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('categories').then((function(_this) {
          return function(items) {
            var cat, i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              cat = new BBModel.Category(i);
              cat.order || (cat.order = _i);
              models.push(cat);
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.client", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Client(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.child_clients", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('clients').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Client(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.clients", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('clients').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Client(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.questions", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        var defer, i, j, k, len, len1, ref, results, results1;
        if (resource.questions) {
          ref = resource.questions;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(new BBModel.Question(i));
          }
          return results;
        } else if (resource.$has('questions')) {
          defer = $q.defer();
          resource.$get('questions').then(function(items) {
            return defer.resolve((function() {
              var k, len1, results1;
              results1 = [];
              for (k = 0, len1 = items.length; k < len1; k++) {
                i = items[k];
                results1.push(new BBModel.Question(i));
              }
              return results1;
            })());
          }, function(err) {
            return defer.reject(err);
          });
          return defer.promise;
        } else {
          results1 = [];
          for (k = 0, len1 = resource.length; k < len1; k++) {
            i = resource[k];
            results1.push(new BBModel.Question(i));
          }
          return results1;
        }
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.question", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Question(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.answers", function($q, BBModel) {
    return {
      promise: false,
      unwrap: function(items) {
        var answers, i, j, len, models;
        models = [];
        for (j = 0, len = items.length; j < len; j++) {
          i = items[j];
          models.push(new BBModel.Answer(i));
        }
        answers = {
          answers: models,
          getAnswer: function(question) {
            var a, k, len1, ref;
            ref = this.answers;
            for (k = 0, len1 = ref.length; k < len1; k++) {
              a = ref[k];
              if (a.question_text === question || a.question_id === question) {
                return a.value;
              }
            }
          }
        };
        return answers;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.administrators", function($q, BBModel) {
    return {
      unwrap: function(items) {
        var i, j, len, results;
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          i = items[j];
          results.push(new BBModel.Admin.User(i));
        }
        return results;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.company", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Company(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_chains", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        return new BBModel.EventChain(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.parent", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Company(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.company_questions", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('company_questions').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.BusinessQuestion(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.company_question", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.BusinessQuestion(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.images", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('images').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Image(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.bookings", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('bookings').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Member.Booking(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);
