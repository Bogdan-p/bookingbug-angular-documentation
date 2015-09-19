(function() {
  'use strict';

  /***
  * @ngdoc object
  * @name BB.Models:BasketItemModel
  *
  * @description
  * This is BasketItemModel in BB.Models module that creates BasketItem object.
  *
  * <pre>
  * //Creates class BasketItem that extends BaseModel
  * class BasketItem extends BaseModel
  * </pre>
  *
  * @requires {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$q more}
  *
  * @requires {service} $window A reference to the browser's window object.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$window more}
  *
  * @requires {model} $bbug Releases the hold on the $ shortcut identifier, so that other scripts can use it.
  * <br>
  * {@link $bbug more}
  *
  * @requires {model} BBModel Info
  * <br>
  * {@link BB.Models:BBModel more}
  *
  * @requires {model} BaseModel Info
  * <br>
  * {@link BB.Models:BaseModel more}
  *
  * @requires {model} BookableItemModel Info
  * <br>
  * {@link BB.Models:BookableItemModel more}
  *
  * @returns {object} Newly created BasketItem object with the following set of methods:
  *
  * - constructor(data, bb)
  * - setDefaults(defaults)
  * - storeDefaults(defaults)
  * - defaultService()
  * - requestedTimeUnavailable
  * - setSlot(slot)
  * - setCompany(company)
  * - clearExistingItem()
  * - setItem(item)
  * - setService(serv, default_questions = null)
  * - setEventGroup(event_group)
  * - setEventChain(event_chain, default_questions = null)
  * - setEvent(event)
  * - setCategory(cat)
  * - setPerson: (per, set_selected = true)
  * - setResource(res, set_selected = true)
  * - setDuration(dur)
  * - print_time()
  * - print_end_time()
  * - print_time12(show_suffix = true)
  * - print_end_time12(show_suffix = true)
  * - setTime(time)
  * - setDate(date)
  * - clearDateTime()
  * - clearTime()
  * - setGroup(group)
  * - setAskedQuestions()
  * - getPostData()
  * - setPrice(nprice)
  * - getStep()
  * - loadStep(step)
  * - describe()
  * - booking_date(format)
  * - booking_time(seperator = '-')
  * - duePrice()
  * - isWaitlist()
  * - start_datetime()
  * - end_datetime()
  * - setSrcBooking(booking)
  * - anyPerson()
  * - anyResource()
  * - isMovingBooking()
  * - setCloneAnswers(otherItem)
  * - questionPrice()
  * - getQty()
  * - totalPrice()
  * - fullPrice()
  * - setProduct(product)
  * - setDeal(deal)
  * - hasPrice()
  * - getAttachment()
  *
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("BasketItemModel", function($q, $window, BBModel, BookableItemModel, BaseModel, $bbug) {
    var BasketItem;
    return BasketItem = (function(superClass) {
      extend(BasketItem, superClass);

      function BasketItem(data, bb) {
        this.fullPrice = bind(this.fullPrice, this);
        this.totalPrice = bind(this.totalPrice, this);
        this.getQty = bind(this.getQty, this);
        this.questionPrice = bind(this.questionPrice, this);
        var chain, comp, per, res, serv, t;
        BasketItem.__super__.constructor.call(this, data);
        this.ready = false;
        this.days_link = null;
        this.book_link = null;
        this.parts_links = {};
        this.settings || (this.settings = {});
        this.has_questions = false;
        if (bb) {
          this.reserve_without_questions = bb.reserve_without_questions;
        }
        if (this.time) {
          this.time = new BBModel.TimeSlot({
            time: this.time,
            event_id: this.event_id,
            selected: true,
            avail: 1,
            price: this.price
          });
        }
        if (this.date) {
          this.date = new BBModel.Day({
            date: this.date,
            spaces: 1
          });
        }
        if (this.datetime) {
          this.date = new BBModel.Day({
            date: this.datetime.toISODate(),
            spaces: 1
          });
          t = this.datetime.hour() * 60 + this.datetime.minute();
          this.time = new BBModel.TimeSlot({
            time: t,
            event_id: this.event_id,
            selected: true,
            avail: 1,
            price: this.price
          });
        }
        if (this.id) {
          this.reserve_ready = true;
          this.held = {
            time: this.time,
            date: this.date,
            event_id: this.event_id
          };
        }
        this.promises = [];
        if (data) {
          if (data.$has("answers")) {
            data.$get("answers").then((function(_this) {
              return function(answers) {
                var a, i, len, results;
                data.questions = [];
                results = [];
                for (i = 0, len = answers.length; i < len; i++) {
                  a = answers[i];
                  results.push(data.questions.push({
                    id: a.question_id,
                    answer: a.value
                  }));
                }
                return results;
              };
            })(this));
          }
          if (data.$has('company')) {
            comp = data.$get('company');
            this.promises.push(comp);
            comp.then((function(_this) {
              return function(comp) {
                var c;
                c = new BBModel.Company(comp);
                _this.promises.push(c.getSettings());
                return _this.setCompany(c);
              };
            })(this));
          }
          if (data.$has('service')) {
            serv = data.$get('service');
            this.promises.push(serv);
            serv.then((function(_this) {
              return function(serv) {
                var prom;
                if (serv.$has('category')) {
                  prom = serv.$get('category');
                  _this.promises.push(prom);
                  prom.then(function(cat) {
                    return _this.setCategory(new BBModel.Category(cat));
                  });
                }
                _this.setService(new BBModel.Service(serv), data.questions);
                if (_this.duration) {
                  _this.setDuration(_this.duration);
                }
                _this.checkReady();
                if (_this.time) {
                  return _this.time.service = _this.service;
                }
              };
            })(this));
          }
          if (data.$has('event_group')) {
            serv = data.$get('event_group');
            this.promises.push(serv);
            serv.then((function(_this) {
              return function(serv) {
                var prom;
                if (serv.$has('category')) {
                  prom = serv.$get('category');
                  _this.promises.push(prom);
                  prom.then(function(cat) {
                    return _this.setCategory(new BBModel.Category(cat));
                  });
                }
                _this.setEventGroup(new BBModel.EventGroup(serv));
                if (_this.time) {
                  return _this.time.service = _this.event_group;
                }
              };
            })(this));
          }
          if (data.$has('event_chain')) {
            chain = data.$get('event_chain');
            this.promises.push(chain);
            chain.then((function(_this) {
              return function(serv) {
                return _this.setEventChain(new BBModel.EventChain(serv), data.questions);
              };
            })(this));
          }
          if (data.$has('resource')) {
            res = data.$get('resource');
            this.promises.push(res);
            res.then((function(_this) {
              return function(res) {
                return _this.setResource(new BBModel.Resource(res), false);
              };
            })(this));
          }
          if (data.$has('person')) {
            per = data.$get('person');
            this.promises.push(per);
            per.then((function(_this) {
              return function(per) {
                return _this.setPerson(new BBModel.Person(per), false);
              };
            })(this));
          }
          if (data.$has('event')) {
            data.$get('event').then((function(_this) {
              return function(event) {
                return _this.setEvent(new BBModel.Event(event));
              };
            })(this));
          }
          if (data.settings) {
            this.settings = $bbug.extend(true, {}, data.settings);
          }
          if (data.attachment_id) {
            this.attachment_id = data.attachment_id;
          }
          if (data.$has('product')) {
            data.$get('product').then((function(_this) {
              return function(product) {
                return _this.setProduct(product);
              };
            })(this));
          }
          if (data.$has('deal')) {
            data.$get('deal').then((function(_this) {
              return function(deal) {
                return _this.setDeal(new BBModel.Deal(deal));
              };
            })(this));
          }
        }
      }

      BasketItem.prototype.setDefaults = function(defaults) {
        if (defaults.settings) {
          this.settings = defaults.settings;
        }
        if (defaults.company) {
          this.setCompany(defaults.company);
        }
        if (defaults.merge_resources) {
          this.setResource(null);
        }
        if (defaults.merge_people) {
          this.setPerson(null);
        }
        if (defaults.resource) {
          this.setResource(defaults.resource);
        }
        if (defaults.person) {
          this.setPerson(defaults.person);
        }
        if (defaults.service) {
          this.setService(defaults.service);
        }
        if (defaults.category) {
          this.setCategory(defaults.category);
        }
        if (defaults.time) {
          this.requested_time = parseInt(defaults.time);
        }
        if (defaults.date) {
          this.requested_date = moment(defaults.date);
        }
        if (defaults.service_ref) {
          this.service_ref = defaults.service_ref;
        }
        if (defaults.group) {
          this.group = defaults.group;
        }
        if (defaults.private_note) {
          this.private_note = defaults.private_note;
        }
        if (defaults.event_group) {
          this.setEventGroup(defaults.event_group);
        }
        if (defaults.event) {
          this.setEvent(defaults.event);
        }
        return this.defaults = defaults;
      };

      BasketItem.prototype.storeDefaults = function(defaults) {
        return this.defaults = defaults;
      };

      BasketItem.prototype.defaultService = function() {
        if (!this.defaults) {
          return null;
        }
        return this.defaults.service;
      };

      BasketItem.prototype.requestedTimeUnavailable = function() {
        delete this.requested_time;
        return delete this.requested_date;
      };

      BasketItem.prototype.setSlot = function(slot) {
        var t;
        this.date = new BBModel.Day({
          date: slot.datetime.toISODate(),
          spaces: 1
        });
        t = slot.datetime.hour() * 60 + slot.datetime.minute();
        this.time = new BBModel.TimeSlot({
          time: t,
          avail: 1,
          price: this.price
        });
        return this.available_slot = slot.id;
      };

      BasketItem.prototype.setCompany = function(company) {
        this.company = company;
        this.parts_links.company = this.company.$href('self');
        if (this.item_details) {
          return this.item_details.currency_code = this.company.currency_code;
        }
      };

      BasketItem.prototype.clearExistingItem = function() {
        var prom;
        if (this.$has('self') && this.event_id) {
          prom = this.$del('self');
          this.promises.push(prom);
          prom.then(function() {});
        }
        delete this.earliest_time;
        return delete this.event_id;
      };

      BasketItem.prototype.setItem = function(item) {
        if (!item) {
          return;
        }
        if (item.type === "person") {
          return this.setPerson(item);
        } else if (item.type === "service") {
          return this.setService(item);
        } else if (item.type === "resource") {
          return this.setResource(item);
        }
      };

      BasketItem.prototype.setService = function(serv, default_questions) {
        var prom;
        if (default_questions == null) {
          default_questions = null;
        }
        if (this.service) {
          if (this.service.self && serv.self && this.service.self === serv.self) {
            if (this.service.$has('book')) {
              this.book_link = this.service;
            }
            if (serv.$has('days')) {
              this.days_link = serv;
            }
            if (serv.$has('book')) {
              this.book_link = serv;
            }
            return;
          }
          this.item_details = null;
          this.clearExistingItem();
        }
        if (this.service && serv && this.service.self && serv.self) {
          if ((this.service.self !== serv.self) && serv.durations && serv.durations.length > 1) {
            this.duration = null;
            this.listed_duration = null;
          }
        }
        this.service = serv;
        if (serv && (serv instanceof BookableItemModel)) {
          this.service = serv.item;
        }
        this.parts_links.service = this.service.$href('self');
        if (this.service.$has('book')) {
          this.book_link = this.service;
        }
        if (serv.$has('days')) {
          this.days_link = serv;
        }
        if (serv.$has('book')) {
          this.book_link = serv;
        }
        if (this.service.$has('questions')) {
          this.has_questions = true;
          prom = this.service.$get('questions');
          this.promises.push(prom);
          prom.then((function(_this) {
            return function(details) {
              if (_this.company) {
                details.currency_code = _this.company.currency_code;
              }
              _this.item_details = new BBModel.ItemDetails(details);
              _this.has_questions = _this.item_details.hasQuestions;
              if (default_questions) {
                _this.item_details.setAnswers(default_questions);
                return _this.setAskedQuestions();
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return _this.has_questions = false;
            };
          })(this));
        } else {
          this.has_questions = false;
        }
        if (this.service && this.service.durations && this.service.durations.length === 1) {
          this.setDuration(this.service.durations[0]);
          this.listed_duration = this.service.durations[0];
        }
        if (this.service && this.service.listed_durations && this.service.listed_durations.length === 1) {
          this.listed_duration = this.service.listed_durations[0];
        }
        if (this.service.$has('category')) {
          prom = this.service.getCategoryPromise();
          if (prom) {
            return this.promises.push(prom);
          }
        }
      };

      BasketItem.prototype.setEventGroup = function(event_group) {
        var prom;
        if (this.event_group) {
          if (this.event_group.self && event_group.self && this.event_group.self === event_group.self) {
            return;
          }
        }
        this.event_group = event_group;
        this.parts_links.event_group = this.event_group.$href('self').replace('event_group', 'service');
        if (this.event_group.$has('category')) {
          prom = this.event_group.getCategoryPromise();
          if (prom) {
            return this.promises.push(prom);
          }
        }
      };

      BasketItem.prototype.setEventChain = function(event_chain, default_questions) {
        var prom;
        if (default_questions == null) {
          default_questions = null;
        }
        if (this.event_chain) {
          if (this.event_chain.self && event_chain.self && this.event_chain.self === event_chain.self) {
            return;
          }
        }
        this.event_chain = event_chain;
        this.base_price = parseFloat(event_chain.price);
        if (this.price !== this.base_price) {
          this.setPrice(this.price);
        } else {
          this.setPrice(this.base_price);
        }
        if (this.event_chain.isSingleBooking()) {
          this.tickets = {
            name: "Admittance",
            max: 1,
            type: "normal",
            price: this.base_price
          };
          this.tickets.pre_paid_booking_id = this.pre_paid_booking_id;
          if (this.num_book) {
            this.tickets.qty = this.num_book;
          }
        }
        if (this.event_chain.$has('questions')) {
          this.has_questions = true;
          prom = this.event_chain.$get('questions');
          this.promises.push(prom);
          return prom.then((function(_this) {
            return function(details) {
              _this.item_details = new BBModel.ItemDetails(details);
              _this.has_questions = _this.item_details.hasQuestions;
              if (default_questions) {
                _this.item_details.setAnswers(default_questions);
                return _this.setAskedQuestions();
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return _this.has_questions = false;
            };
          })(this));
        } else {
          return this.has_questions = false;
        }
      };

      BasketItem.prototype.setEvent = function(event) {
        var prom;
        if (this.event) {
          this.event.unselect();
        }
        this.event = event;
        this.event.select();
        this.event_chain_id = event.event_chain_id;
        this.setDate({
          date: event.date
        });
        this.setTime(event.time);
        this.setDuration(event.duration);
        if (event.$has('book')) {
          this.book_link = event;
        }
        prom = this.event.getChain();
        this.promises.push(prom);
        prom.then((function(_this) {
          return function(chain) {
            return _this.setEventChain(chain);
          };
        })(this));
        prom = this.event.getGroup();
        this.promises.push(prom);
        prom.then((function(_this) {
          return function(group) {
            return _this.setEventGroup(group);
          };
        })(this));
        this.num_book = event.qty;
        if (this.event.getSpacesLeft() <= 0 && !this.company.settings) {
          if (this.company.getSettings().has_waitlists) {
            return this.status = 8;
          }
        } else if (this.event.getSpacesLeft() <= 0 && this.company.settings && this.company.settings.has_waitlists) {
          return this.status = 8;
        }
      };

      BasketItem.prototype.setCategory = function(cat) {
        return this.category = cat;
      };

      BasketItem.prototype.setPerson = function(per, set_selected) {
        if (set_selected == null) {
          set_selected = true;
        }
        if (set_selected && this.earliest_time) {
          delete this.earliest_time;
        }
        if (!per) {
          this.person = true;
          if (set_selected) {
            this.settings.person = -1;
          }
          this.parts_links.person = null;
          if (this.service) {
            this.setService(this.service);
          }
          if (this.resource && !this.anyResource()) {
            this.setResource(this.resource, false);
          }
          if (this.event_id) {
            delete this.event_id;
            if (this.resource && this.defaults && this.defaults.merge_resources) {
              return this.setResource(null);
            }
          }
        } else {
          this.person = per;
          if (set_selected) {
            this.settings.person = this.person.id;
          }
          this.parts_links.person = this.person.$href('self');
          if (per.$has('days')) {
            this.days_link = per;
          }
          if (per.$has('book')) {
            this.book_link = per;
          }
          if (this.event_id && this.$has('person') && this.$href('person') !== this.person.self) {
            delete this.event_id;
            if (this.resource && this.defaults && this.defaults.merge_resources) {
              return this.setResource(null);
            }
          }
        }
      };

      BasketItem.prototype.setResource = function(res, set_selected) {
        if (set_selected == null) {
          set_selected = true;
        }
        if (set_selected && this.earliest_time) {
          delete this.earliest_time;
        }
        if (!res) {
          this.resource = true;
          if (set_selected) {
            this.settings.resource = -1;
          }
          this.parts_links.resource = null;
          if (this.service) {
            this.setService(this.service);
          }
          if (this.person && !this.anyPerson()) {
            this.setPerson(this.person, false);
          }
          if (this.event_id) {
            delete this.event_id;
            if (this.person && this.defaults && this.defaults.merge_people) {
              return this.setPerson(null);
            }
          }
        } else {
          this.resource = res;
          if (set_selected) {
            this.settings.resource = this.resource.id;
          }
          this.parts_links.resource = this.resource.$href('self');
          if (res.$has('days')) {
            this.days_link = res;
          }
          if (res.$has('book')) {
            this.book_link = res;
          }
          if (this.event_id && this.$has('resource') && this.$href('resource') !== this.resource.self) {
            delete this.event_id;
            if (this.person && this.defaults && this.defaults.merge_people) {
              return this.setPerson(null);
            }
          }
        }
      };

      BasketItem.prototype.setDuration = function(dur) {
        this.duration = dur;
        if (this.service) {
          this.base_price = this.service.getPriceByDuration(dur);
        }
        if (this.time && this.time.price) {
          this.base_price = this.time.price;
        }
        if (this.price && (this.price !== this.base_price)) {
          return this.setPrice(this.price);
        } else {
          return this.setPrice(this.base_price);
        }
      };

      BasketItem.prototype.print_time = function() {
        if (this.time) {
          return this.time.print_time();
        }
      };

      BasketItem.prototype.print_end_time = function() {
        if (this.time) {
          return this.time.print_end_time(this.duration);
        }
      };

      BasketItem.prototype.print_time12 = function(show_suffix) {
        if (show_suffix == null) {
          show_suffix = true;
        }
        if (this.time) {
          return this.time.print_time12(show_suffix);
        }
      };

      BasketItem.prototype.print_end_time12 = function(show_suffix) {
        if (show_suffix == null) {
          show_suffix = true;
        }
        if (this.time) {
          return this.time.print_end_time12(show_suffix, this.duration);
        }
      };

      BasketItem.prototype.setTime = function(time) {
        var hours, mins, val;
        if (this.time) {
          this.time.unselect();
        }
        this.time = time;
        if (this.time) {
          this.time.select();
          if (this.datetime) {
            val = parseInt(time.time);
            hours = parseInt(val / 60);
            mins = val % 60;
            this.datetime.hour(hours);
            this.datetime.minutes(mins);
          }
          if (this.price && this.time.price && (this.price !== this.time.price)) {
            this.setPrice(this.price);
          } else if (this.price && !this.time.price) {
            this.setPrice(this.price);
          } else if (this.time.price && !this.price) {
            this.setPrice(this.time.price);
          } else {
            this.setPrice(null);
          }
        }
        return this.checkReady();
      };

      BasketItem.prototype.setDate = function(date) {
        this.date = date;
        if (this.date) {
          this.date.date = moment(this.date.date);
          if (this.datetime) {
            this.datetime.date(this.date.date.date());
            this.datetime.month(this.date.date.month());
            this.datetime.year(this.date.date.year());
          }
        }
        return this.checkReady();
      };

      BasketItem.prototype.clearDateTime = function() {
        delete this.date;
        delete this.time;
        delete this.datetime;
        this.ready = false;
        return this.reserve_ready = false;
      };

      BasketItem.prototype.clearTime = function() {
        delete this.time;
        this.ready = false;
        return this.reserve_ready = false;
      };

      BasketItem.prototype.setGroup = function(group) {
        return this.group = group;
      };

      BasketItem.prototype.setAskedQuestions = function() {
        this.asked_questions = true;
        return this.checkReady();
      };

      BasketItem.prototype.checkReady = function() {
        if (((this.date && this.time && this.service) || this.event || this.product || this.deal || (this.date && this.service && this.service.duration_unit === 'day')) && (this.asked_questions || !this.has_questions)) {
          this.ready = true;
        }
        if (((this.date && this.time && this.service) || this.event || this.product || this.deal || (this.date && this.service && this.service.duration_unit === 'day')) && (this.asked_questions || !this.has_questions || this.reserve_without_questions)) {
          return this.reserve_ready = true;
        }
      };

      BasketItem.prototype.getPostData = function() {
        var data, i, j, len, len1, m_question, o_question, ref, ref1;
        if (this.cloneAnswersItem) {
          ref = this.cloneAnswersItem.item_details.questions;
          for (i = 0, len = ref.length; i < len; i++) {
            o_question = ref[i];
            ref1 = this.item_details.questions;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              m_question = ref1[j];
              if (m_question.id === o_question.id) {
                m_question.answer = o_question.answer;
              }
            }
          }
        }
        data = {};
        if (this.date) {
          data.date = this.date.date.toISODate();
        }
        if (this.time) {
          data.time = this.time.time;
          if (this.time.event_id) {
            data.event_id = this.time.event_id;
          } else if (this.time.event_ids) {
            data.event_ids = this.time.event_ids;
          }
        } else if (this.date && this.date.event_id) {
          data.event_id = this.date.event_id;
        }
        data.price = this.price;
        data.paid = this.paid;
        if (this.book_link) {
          data.book = this.book_link.$href('book');
        }
        data.id = this.id;
        data.duration = this.duration;
        data.settings = this.settings;
        data.settings || (data.settings = {});
        if (this.earliest_time) {
          data.settings.earliest_time = this.earliest_time;
        }
        if (this.item_details && this.asked_questions) {
          data.questions = this.item_details.getPostData();
        }
        if (this.move_item_id) {
          data.move_item_id = this.move_item_id;
        }
        if (this.srcBooking) {
          data.move_item_id = this.srcBooking.id;
        }
        if (this.service) {
          data.service_id = this.service.id;
        }
        if (this.resource) {
          data.resource_id = this.resource.id;
        }
        if (this.person) {
          data.person_id = this.person.id;
        }
        data.length = this.length;
        if (this.event) {
          data.event_id = this.event.id;
          if (this.event.pre_paid_booking_id != null) {
            data.pre_paid_booking_id = this.event.pre_paid_booking_id;
          } else if (this.tickets.pre_paid_booking_id != null) {
            data.pre_paid_booking_id = this.tickets.pre_paid_booking_id;
          }
          data.tickets = this.tickets;
        }
        if (this.pre_paid_booking_id != null) {
          data.pre_paid_booking_id = this.pre_paid_booking_id;
        }
        data.event_chain_id = this.event_chain_id;
        data.event_group_id = this.event_group_id;
        data.qty = this.qty;
        if (this.status) {
          data.status = this.status;
        }
        if (this.num_resources != null) {
          data.num_resources = parseInt(this.num_resources);
        }
        data.product = this.product;
        if (this.deal) {
          data.deal = this.deal;
        }
        if (this.deal && this.recipient) {
          data.recipient = this.recipient;
        }
        if (this.deal && this.recipient && this.recipient_mail) {
          data.recipient_mail = this.recipient_mail;
        }
        data.coupon_id = this.coupon_id;
        data.is_coupon = this.is_coupon;
        if (this.attachment_id) {
          data.attachment_id = this.attachment_id;
        }
        if (this.deal_codes) {
          data.vouchers = this.deal_codes;
        }
        if (this.email) {
          data.email = this.email;
        }
        if (this.first_name) {
          data.first_name = this.first_name;
        }
        if (this.last_name) {
          data.last_name = this.last_name;
        }
        if (this.email != null) {
          data.email = this.email;
        }
        if (this.email_admin != null) {
          data.email_admin = this.email_admin;
        }
        if (this.private_note) {
          data.private_note = this.private_note;
        }
        if (this.available_slot) {
          data.available_slot = this.available_slot;
        }
        return data;
      };

      BasketItem.prototype.setPrice = function(nprice) {
        var printed_price;
        if (nprice != null) {
          this.price = parseFloat(nprice);
          printed_price = this.price / 100;
          this.printed_price = printed_price % 1 === 0 ? "£" + parseInt(printed_price) : $window.sprintf("£%.2f", printed_price);
          if (this.company && this.company.settings) {
            this.printed_vat_cal = this.company.settings.payment_tax;
          }
          if (this.printed_vat_cal) {
            this.printed_vat = this.printed_vat_cal / 100 * printed_price;
          }
          if (this.printed_vat_cal) {
            return this.printed_vat_inc = this.printed_vat_cal / 100 * printed_price + printed_price;
          }
        } else {
          this.price = null;
          this.printed_price = null;
          this.printed_vat_cal = null;
          this.printed_vat = null;
          return this.printed_vat_inc = null;
        }
      };

      BasketItem.prototype.getStep = function() {
        var temp;
        temp = {};
        temp.service = this.service;
        temp.category = this.category;
        temp.person = this.person;
        temp.resource = this.resource;
        temp.duration = this.duration;
        temp.event = this.event;
        temp.event_group = this.event_group;
        temp.event_chain = this.event_chain;
        temp.time = this.time;
        temp.date = this.date;
        temp.days_link = this.days_link;
        temp.book_link = this.book_link;
        temp.ready = this.ready;
        return temp;
      };

      BasketItem.prototype.loadStep = function(step) {
        if (this.id) {
          return;
        }
        this.service = step.service;
        this.category = step.category;
        this.person = step.person;
        this.resource = step.resource;
        this.duration = step.duration;
        this.event = step.event;
        this.event_chain = step.event_chain;
        this.event_group = step.event_group;
        this.time = step.time;
        this.date = step.date;
        this.days_link = step.days_link;
        this.book_link = step.book_link;
        return this.ready = step.ready;
      };

      BasketItem.prototype.describe = function() {
        var title;
        title = "-";
        if (this.service) {
          title = this.service.name;
        }
        if (this.event_group && this.event && title === "-") {
          title = this.event_group.name + " - " + this.event.description;
        }
        if (this.product) {
          title = this.product.name;
        }
        if (this.deal) {
          title = this.deal.name;
        }
        return title;
      };

      BasketItem.prototype.booking_date = function(format) {
        if (!this.date || !this.date.date) {
          return null;
        }
        return this.date.date.format(format);
      };

      BasketItem.prototype.booking_time = function(seperator) {
        var duration;
        if (seperator == null) {
          seperator = '-';
        }
        if (!this.time) {
          return null;
        }
        duration = this.listed_duration ? this.listed_duration : this.duration;
        return this.time.print_time() + " " + seperator + " " + this.time.print_end_time(duration);
      };

      BasketItem.prototype.duePrice = function() {
        if (this.isWaitlist()) {
          return 0;
        }
        return this.price;
      };

      BasketItem.prototype.isWaitlist = function() {
        return this.status && this.status === 8;
      };

      BasketItem.prototype.start_datetime = function() {
        var start_datetime;
        if (!this.date || !this.time) {
          return null;
        }
        start_datetime = moment(this.date.date.toISODate());
        start_datetime.minutes(this.time.time);
        return start_datetime;
      };

      BasketItem.prototype.end_datetime = function() {
        var duration, end_datetime;
        if (!this.date || !this.time || (!this.listed_duration && !this.duration)) {
          return null;
        }
        duration = this.listed_duration ? this.listed_duration : this.duration;
        end_datetime = moment(this.date.date.toISODate());
        end_datetime.minutes(this.time.time + duration);
        return end_datetime;
      };

      BasketItem.prototype.setSrcBooking = function(booking) {
        this.srcBooking = booking;
        return this.duration = booking.duration / 60;
      };

      BasketItem.prototype.anyPerson = function() {
        return this.person && (typeof this.person === 'boolean');
      };

      BasketItem.prototype.anyResource = function() {
        return this.resource && (typeof this.resource === 'boolean');
      };

      BasketItem.prototype.isMovingBooking = function() {
        return this.srcBooking || this.move_item_id;
      };

      BasketItem.prototype.setCloneAnswers = function(otherItem) {
        return this.cloneAnswersItem = otherItem;
      };

      BasketItem.prototype.questionPrice = function() {
        if (!this.item_details) {
          return 0;
        }
        return this.item_details.questionPrice(this.getQty());
      };

      BasketItem.prototype.getQty = function() {
        if (this.qty) {
          return this.qty;
        }
        if (this.tickets) {
          return this.tickets.qty;
        }
        return 1;
      };

      BasketItem.prototype.totalPrice = function() {
        var pr;
        if (this.tickets.pre_paid_booking_id) {
          return 0;
        }
        if (this.discount_price != null) {
          return this.discount_price + this.questionPrice();
        }
        pr = this.total_price;
        if (!angular.isNumber(pr)) {
          pr = this.price;
        }
        if (!angular.isNumber(pr)) {
          pr = 0;
        }
        return pr + this.questionPrice();
      };

      BasketItem.prototype.fullPrice = function() {
        var pr;
        pr = this.base_price;
        pr || (pr = this.total_price);
        pr || (pr = this.price);
        pr || (pr = 0);
        return pr + this.questionPrice();
      };

      BasketItem.prototype.setProduct = function(product) {
        this.product = product;
        if (this.product.$has('book')) {
          return this.book_link = this.product;
        }
      };

      BasketItem.prototype.setDeal = function(deal) {
        this.deal = deal;
        if (this.deal.$has('book')) {
          this.book_link = this.deal;
        }
        if (deal.price) {
          return this.setPrice(deal.price);
        }
      };

      BasketItem.prototype.hasPrice = function() {
        if (this.price) {
          return true;
        } else {
          return false;
        }
      };

      BasketItem.prototype.getAttachment = function() {
        if (this.attachment) {
          return this.attachment;
        }
        if (this.$has('attachment') && this.attachment_id) {
          return this._data.$get('attachment').then((function(_this) {
            return function(att) {
              _this.attachment = att;
              return _this.attachment;
            };
          })(this));
        }
      };

      return BasketItem;

    })(BaseModel);
  });

}).call(this);
