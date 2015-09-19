(function() {
  'use strict';

  /***
  * @ngdoc service
  * @name BB.Services:QuestionService
  *
  * @description
  * Factory QuestionService
  *
  * @param {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @param {model} QueryStringService Info
  * <br>
  * {@link BB.Services:QueryStringService more}
  *
  * @param {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
  * @returns {Promise} This service has the following set of methods:
  *
  * - convertDates(obj)
  * - addAnswersById(questions)
  * - convertToSnakeCase(str)
  * - addDynamicAnswersByName(questions)
  * - addAnswersByName(obj, keys)
  * - addAnswersFromDefaults(questions, answers)
  * - storeDefaults(obj)
  * - checkConditionalQuestions(questions)
  * - findByQuestionId(questions, qid)
  *
   */
  angular.module('BB.Services').factory('QuestionService', function($window, QueryStringService, $bbug) {
    var addAnswersById, addAnswersByName, addAnswersFromDefaults, addDynamicAnswersByName, checkConditionalQuestions, convertDates, convertToSnakeCase, defaults, findByQuestionId, storeDefaults;
    defaults = QueryStringService() || {};
    convertDates = function(obj) {
      return _.each(obj, function(val, key) {
        var date;
        date = $window.moment(obj[key]);
        if (_.isString(obj[key]) && date.isValid()) {
          return obj[key] = date;
        }
      });
    };
    if ($window.bb_setup) {
      convertDates($window.bb_setup);
      angular.extend(defaults, $window.bb_setup);
    }
    addAnswersById = function(questions) {
      if (!questions) {
        return;
      }
      if (angular.isArray(questions)) {
        return _.each(questions, function(question) {
          var id;
          id = question.id + '';
          if (!question.answer && defaults[id]) {
            return question.answer = defaults[id];
          }
        });
      } else {
        if (defaults[questions.id + '']) {
          return questions.answer = defaults[questions.id + ''];
        }
      }
    };
    convertToSnakeCase = function(str) {
      str = str.toLowerCase();
      str = $.trim(str);
      str = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '');
      str = str.replace(/\s{2,}/g, ' ');
      str = str.replace(/\s/g, '_');
      return str;
    };
    addDynamicAnswersByName = function(questions) {
      var keys;
      if (angular.isArray(questions)) {
        keys = _.keys(defaults);
        return _.each(questions, function(question) {
          var name;
          name = convertToSnakeCase(question.name);
          return _.each(keys, function(key) {
            if (name.indexOf(key) >= 0) {
              if (defaults[key] && !question.answer) {
                question.answer = defaults[key];
                delete defaults[key];
              }
            }
          });
        });
      }
    };
    addAnswersByName = function(obj, keys) {
      var i, key, len, type;
      type = Object.prototype.toString.call(obj).slice(8, -1);
      if (type === 'Object' && angular.isArray(keys)) {
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          if (defaults[key] && !obj[key]) {
            obj[key] = defaults[key];
            delete defaults[key];
          }
        }
      }
    };
    addAnswersFromDefaults = function(questions, answers) {
      var i, len, name, question, results;
      results = [];
      for (i = 0, len = questions.length; i < len; i++) {
        question = questions[i];
        name = question.help_text;
        if (answers[name]) {
          question.answer = answers[name];
        }
        if (answers[question.id + '']) {
          results.push(question.answer = answers[question.id + '']);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    storeDefaults = function(obj) {
      return angular.extend(defaults, obj.bb_setup || {});
    };
    checkConditionalQuestions = function(questions) {
      var a, ans, cond, found, i, len, q, ref, results, v;
      results = [];
      for (i = 0, len = questions.length; i < len; i++) {
        q = questions[i];
        if (q.settings && q.settings.conditional_question) {
          cond = findByQuestionId(questions, parseInt(q.settings.conditional_question));
          if (cond) {
            ans = cond.getAnswerId();
            found = false;
            if ($bbug.isEmptyObject(q.settings.conditional_answers) && cond.detail_type === "check" && !cond.answer) {
              found = true;
            }
            ref = q.settings.conditional_answers;
            for (a in ref) {
              v = ref[a];
              if (a[0] === 'c' && parseInt(v) === 1 && cond.answer) {
                found = true;
              } else if (parseInt(a) === ans && parseInt(v) === 1) {
                found = true;
              }
            }
            if (found) {
              results.push(q.showElement());
            } else {
              results.push(q.hideElement());
            }
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    findByQuestionId = function(questions, qid) {
      var i, len, q;
      for (i = 0, len = questions.length; i < len; i++) {
        q = questions[i];
        if (q.id === qid) {
          return q;
        }
      }
      return null;
    };
    return {
      getStoredData: function() {
        return defaults;
      },
      storeDefaults: storeDefaults,
      addAnswersById: addAnswersById,
      addAnswersByName: addAnswersByName,
      addDynamicAnswersByName: addDynamicAnswersByName,
      addAnswersFromDefaults: addAnswersFromDefaults,
      convertToSnakeCase: convertToSnakeCase,
      checkConditionalQuestions: checkConditionalQuestions
    };
  });

}).call(this);
