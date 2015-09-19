(function() {
  window.Collection = (function() {
    function Collection() {}

    return Collection;

  })();

  window.Collection.Base = (function() {
    function Base(res, items, params) {
      var m, n;
      this.res = res;
      this.items = items;
      this.params = params;
      this.callbacks = [];
      this.jparams = JSON.stringify(this.params);
      if (res) {
        for (n in res) {
          m = res[n];
          this[n] = m;
        }
      }
    }

    Base.prototype.checkItem = function(item) {
      var call, existingItem, i, index, j, k, len1, len2, len3, ref, ref1, ref2, results;
      if (!this.matchesParams(item)) {
        this.deleteItem(item);
        return true;
      } else {
        ref = this.items;
        for (index = i = 0, len1 = ref.length; i < len1; index = ++i) {
          existingItem = ref[index];
          if (item.self === existingItem.self) {
            this.items[index] = item;
            ref1 = this.callbacks;
            for (j = 0, len2 = ref1.length; j < len2; j++) {
              call = ref1[j];
              call[1](item, "update");
            }
            return true;
          }
        }
      }
      this.items.push(item);
      ref2 = this.callbacks;
      results = [];
      for (k = 0, len3 = ref2.length; k < len3; k++) {
        call = ref2[k];
        results.push(call[1](item, "add"));
      }
      return results;
    };

    Base.prototype.deleteItem = function(item) {
      var call, i, len, len1, ref, results;
      len = this.items.length;
      this.items = this.items.filter(function(x) {
        return x.self !== item.self;
      });
      if (this.items.length !== len) {
        ref = this.callbacks;
        results = [];
        for (i = 0, len1 = ref.length; i < len1; i++) {
          call = ref[i];
          results.push(call[1](item, "delete"));
        }
        return results;
      }
    };

    Base.prototype.getItems = function() {
      return this.items;
    };

    Base.prototype.addCallback = function(obj, fn) {
      var call, i, len1, ref;
      ref = this.callbacks;
      for (i = 0, len1 = ref.length; i < len1; i++) {
        call = ref[i];
        if (call[0] === obj) {
          return;
        }
      }
      return this.callbacks.push([obj, fn]);
    };

    Base.prototype.matchesParams = function(item) {
      return true;
    };

    return Base;

  })();

  window.BaseCollections = (function() {
    function BaseCollections() {
      this.collections = [];
    }

    BaseCollections.prototype.count = function() {
      return this.collections.length;
    };

    BaseCollections.prototype.add = function(col) {
      return this.collections.push(col);
    };

    BaseCollections.prototype.checkItems = function(item) {
      var col, i, len1, ref, results;
      ref = this.collections;
      results = [];
      for (i = 0, len1 = ref.length; i < len1; i++) {
        col = ref[i];
        results.push(col.checkItem(item));
      }
      return results;
    };

    BaseCollections.prototype.deleteItems = function(item) {
      var col, i, len1, ref, results;
      ref = this.collections;
      results = [];
      for (i = 0, len1 = ref.length; i < len1; i++) {
        col = ref[i];
        results.push(col.deleteItem(item));
      }
      return results;
    };

    BaseCollections.prototype.find = function(prms) {
      var col, i, jprms, len1, ref;
      jprms = JSON.stringify(prms);
      ref = this.collections;
      for (i = 0, len1 = ref.length; i < len1; i++) {
        col = ref[i];
        if (jprms === col.jparams) {
          return col;
        }
      }
    };

    return BaseCollections;

  })();

}).call(this);
