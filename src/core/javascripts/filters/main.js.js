(function() {
  var app;

  app = angular.module('BB.Filters');


  /***
  * @ngdoc filter
  * @name BB.Filters:stripPostcode
  *
  * @description
  * BB.Filters:stripPostcode
  * 
  * <pre>
  * if match
  *   address = address.substr(0, match.index)
  *   address = $.trim(address)
  *   if /,$/.test(address)
  *     address = address.slice(0, -1)
  * </pre>
  *
  * @return {String} address
  *
   */

  app.filter('stripPostcode', function() {
    return function(address) {
      var match;
      match = address.toLowerCase().match(/[a-z]+\d/);
      if (match) {
        address = address.substr(0, match.index);
      }
      address = $.trim(address);
      if (/,$/.test(address)) {
        address = address.slice(0, -1);
      }
      return address;
    };
  });

  app.filter('labelNumber', function() {
    return function(input, labels) {
      var response;
      response = input;
      if (labels[input]) {
        response = labels[input];
      }
      return response;
    };
  });

  app.filter('interpolate', [
    'version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }
  ]);

  app.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });

  app.filter('time', function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  });

  app.filter('address_single_line', function() {
    return (function(_this) {
      return function(address) {
        var addr;
        if (!address) {
          return;
        }
        if (!address.address1) {
          return;
        }
        addr = "";
        addr += address.address1;
        if (address.address2 && address.address2.length > 0) {
          addr += ", ";
          addr += address.address2;
        }
        if (address.address3 && address.address3.length > 0) {
          addr += ", ";
          addr += address.address3;
        }
        if (address.address4 && address.address4.length > 0) {
          addr += ", ";
          addr += address.address4;
        }
        if (address.address5 && address.address5.length > 0) {
          addr += ", ";
          addr += address.address5;
        }
        if (address.postcode && address.postcode.length > 0) {
          addr += ", ";
          addr += address.postcode;
        }
        return addr;
      };
    })(this);
  });

  app.filter('address_multi_line', function() {
    return (function(_this) {
      return function(address) {
        var str;
        if (!address) {
          return;
        }
        if (!address.address1) {
          return;
        }
        str = "";
        if (address.address1) {
          str += address.address1;
        }
        if (address.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address2) {
          str += address.address2;
        }
        if (address.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address3) {
          str += address.address3;
        }
        if (address.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address4) {
          str += address.address4;
        }
        if (address.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address5) {
          str += address.address5;
        }
        if (address.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (address.postcode) {
          str += address.postcode;
        }
        return str;
      };
    })(this);
  });

  app.filter('map_lat_long', function() {
    return (function(_this) {
      return function(address) {
        var cord;
        if (!address) {
          return;
        }
        if (!address.map_url) {
          return;
        }
        cord = /([-+]*\d{1,3}[\.]\d*)[, ]([-+]*\d{1,3}[\.]\d*)/.exec(address.map_url);
        return cord[0];
      };
    })(this);
  });

  app.filter('currency', function($filter) {
    return (function(_this) {
      return function(number, currencyCode) {
        return $filter('icurrency')(number, currencyCode);
      };
    })(this);
  });

  app.filter('icurrency', function($window, $rootScope) {
    return (function(_this) {
      return function(number, currencyCode) {
        var currency, decimal, format, thousand;
        currencyCode || (currencyCode = $rootScope.bb_currency);
        currency = {
          USD: "$",
          GBP: "£",
          AUD: "$",
          EUR: "€",
          CAD: "$",
          MIXED: "~"
        };
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED", "GBP"]) >= 0) {
          thousand = ",";
          decimal = ".";
          format = "%s%v";
        } else {
          thousand = ".";
          decimal = ",";
          format = "%s%v";
        }
        number = number / 100.0;
        return $window.accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
      };
    })(this);
  });

  app.filter('pretty_price', function($filter) {
    return function(price, symbol) {
      return $filter('ipretty_price')(price, symbol);
    };
  });

  app.filter('ipretty_price', function($window, $rootScope) {
    return function(price, symbol) {
      var currency;
      if (!symbol) {
        currency = {
          USD: "$",
          GBP: "£",
          AUD: "$",
          EUR: "€",
          CAD: "$",
          MIXED: "~"
        };
        symbol = currency[$rootScope.bb_currency];
      }
      price /= 100.0;
      if (parseFloat(price) === 0) {
        return 'Free';
      } else if (parseFloat(price) % 1 === 0) {
        return symbol + parseFloat(price);
      } else {
        return symbol + $window.sprintf("%.2f", parseFloat(price));
      }
    };
  });

  app.filter('time_period', function() {
    return function(v, options) {
      var hour_string, hours, min_string, mins, seperator, str, val;
      if (!angular.isNumber(v)) {
        return;
      }
      hour_string = options && options.abbr_units ? "hr" : "hour";
      min_string = options && options.abbr_units ? "min" : "minute";
      seperator = options && angular.isString(options.seperator) ? options.seperator : "and";
      val = parseInt(v);
      if (val < 60) {
        return val + " " + min_string + "s";
      }
      hours = parseInt(val / 60);
      mins = val % 60;
      if (mins === 0) {
        if (hours === 1) {
          return "1 " + hour_string;
        } else {
          return hours + " " + hour_string + "s";
        }
      } else {
        str = hours + " " + hour_string;
        if (hours > 1) {
          str += "s";
        }
        if (mins === 0) {
          return str;
        }
        if (seperator.length > 0) {
          str += " " + seperator;
        }
        str += " " + mins + " " + min_string + "s";
      }
      return str;
    };
  });

  app.filter('twelve_hour_time', function($window) {
    return function(time, options) {
      var h, m, omit_mins_on_hour, seperator, suffix, t;
      if (!angular.isNumber(time)) {
        return;
      }
      omit_mins_on_hour = options && options.omit_mins_on_hour || false;
      seperator = options && options.seperator ? options.seperator : ":";
      t = time;
      h = Math.floor(t / 60);
      m = t % 60;
      suffix = 'am';
      if (h >= 12) {
        suffix = 'pm';
      }
      if (h > 12) {
        h -= 12;
      }
      if (m === 0 && omit_mins_on_hour) {
        time = "" + h;
      } else {
        time = ("" + h + seperator) + $window.sprintf("%02d", m);
      }
      time += suffix;
      return time;
    };
  });

  app.filter('time_period_from_seconds', function() {
    return function(v) {
      var hours, mins, secs, str, val;
      val = parseInt(v);
      if (val < 60) {
        return "" + val + " seconds";
      }
      hours = Math.floor(val / 3600);
      mins = Math.floor(val % 3600 / 60);
      secs = Math.floor(val % 60);
      str = "";
      if (hours > 0) {
        str += hours + " hour";
        if (hours > 1) {
          str += "s";
        }
        if (mins === 0 && secs === 0) {
          return str;
        }
        str += " and ";
      }
      if (mins > 0) {
        str += mins + " minute";
        if (mins > 1) {
          str += "s";
        }
        if (secs === 0) {
          return str;
        }
        str += " and ";
      }
      str += secs + " second";
      if (secs > 0) {
        str += "s";
      }
      return str;
    };
  });

  app.filter('round_up', function() {
    return function(number, interval) {
      var result;
      result = number / interval;
      result = parseInt(result);
      result = result * interval;
      if ((number % interval) > 0) {
        result = result + interval;
      }
      return result;
    };
  });

  app.filter('exclude_days', function() {
    return function(days, excluded) {
      return _.filter(days, function(day) {
        return excluded.indexOf(day.date.format('dddd')) === -1;
      });
    };
  });

  app.filter("us_tel", function() {
    return function(tel) {
      var city, country, number, value;
      if (!tel) {
        return "";
      }
      value = tel.toString().trim().replace(/^\+/, "");
      if (value.match(/[^0-9]/)) {
        return tel;
      }
      country = void 0;
      city = void 0;
      number = void 0;
      switch (value.length) {
        case 10:
          country = 1;
          city = value.slice(0, 3);
          number = value.slice(3);
          break;
        case 11:
          country = value[0];
          city = value.slice(1, 4);
          number = value.slice(4);
          break;
        case 12:
          country = value.slice(0, 3);
          city = value.slice(3, 5);
          number = value.slice(5);
          break;
        default:
          return tel;
      }
      if (country === 1) {
        country = "";
      }
      number = number.slice(0, 3) + "-" + number.slice(3);
      return (country + city + "-" + number).trim();
    };
  });

  app.filter("uk_local_number", function() {
    return function(tel) {
      if (!tel) {
        return "";
      }
      return tel.replace(/\+44 \(0\)/, '0');
    };
  });

  app.filter("datetime", function() {
    return function(datetime, format, show_timezone) {
      var result;
      if (show_timezone == null) {
        show_timezone = true;
      }
      if (!datetime) {
        return;
      }
      datetime = moment(datetime);
      if (!datetime.isValid()) {
        return;
      }
      result = datetime.format(format);
      if (datetime.zone() !== new Date().getTimezoneOffset() && show_timezone) {
        if (datetime._z) {
          result += datetime.format(" z");
        } else {
          result += " UTC" + datetime.format("Z");
        }
      }
      return result;
    };
  });

  app.filter('range', function() {
    return function(input, min, max) {
      var i, j, ref, ref1;
      for (i = j = ref = parseInt(min), ref1 = parseInt(max); ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        input.push(i);
      }
      return input;
    };
  });

  app.filter('international_number', function() {
    return (function(_this) {
      return function(number, prefix) {
        if (number && prefix) {
          return prefix + " " + number;
        } else if (number) {
          return "" + number;
        } else {
          return "";
        }
      };
    })(this);
  });

  app.filter("startFrom", function() {
    return function(input, start) {
      if (input === undefined) {
        return input;
      } else {
        return input.slice(+start);
      }
    };
  });

  app.filter('add', function() {
    return (function(_this) {
      return function(item, value) {
        if (item && value) {
          item = parseInt(item);
          return item + value;
        }
      };
    })(this);
  });

  app.filter('spaces_remaining', function() {
    return function(spaces) {
      if (spaces < 1) {
        return 0;
      } else {
        return spaces;
      }
    };
  });

  app.filter('key_translate', function() {
    return function(input) {
      var add_underscore, remove_punctuations, upper_case;
      upper_case = angular.uppercase(input);
      remove_punctuations = upper_case.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      add_underscore = remove_punctuations.replace(/\ /g, "_");
      return add_underscore;
    };
  });

}).call(this);
