(function() {
  'use strict';

  /***
  * @ngdoc controller
  * @name BBAdmin.Controllers:DashTimeList
  *
  * @description
  * Controller DashTimeList
  *
  * @param {service} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
  * <br>
  * @param {object} $scope Scope is an object that refers to the application mode.
  * <br>
  * {@link https://docs.angularjs.org/guide/scope read more}
  *
  * @param {object} $rootScope Every application has a single root scope.
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$rootScope read more}
  *
  * @param {service} $location The $location service parses the URL in the browser address bar
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location read more}
  *
  *@param {object} $element....
  * <br>
  * {@link https://docs.angularjs.org/api/ng/service/$location read more}
  *
  *
  * @param {service} AdminTimeService Service.
  *
   */
  angular.module('BBAdmin.Controllers').controller('DashTimeList', function($scope, $rootScope, $location, $q, $element, AdminTimeService) {
    var $loaded;
    $loaded = null;
    $scope.init = (function(_this) {
      return function(day) {
        var elem, prms, timeListDef;
        $scope.selected_day = day;
        elem = angular.element($element);
        elem.attr('id', "tl_" + $scope.bb.company_id);
        angular.element($element).show();
        prms = {
          company_id: $scope.bb.company_id,
          day: day
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        timeListDef = $q.defer();
        $scope.slots = timeListDef.promise;
        prms.url = $scope.bb.api_url;
        $scope.aslots = AdminTimeService.query(prms);
        return $scope.aslots.then(function(res) {
          var i, k, len, slot, slots, x, xres;
          $scope.loaded = true;
          slots = {};
          for (i = 0, len = res.length; i < len; i++) {
            x = res[i];
            if (!slots[x.time]) {
              slots[x.time] = x;
            }
          }
          xres = [];
          for (k in slots) {
            slot = slots[k];
            xres.push(slot);
          }
          return timeListDef.resolve(xres);
        });
      };
    })(this);
    if ($scope.selected_day) {
      $scope.init($scope.selected_day);
    }
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.selected_date.format(fmt);
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $location.path(route);
      };
    })(this);
    $scope.highlighSlot = (function(_this) {
      return function(slot) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $scope.setCheckout(true);
      };
    })(this);
    $scope.clear = (function(_this) {
      return function() {
        $scope.loaded = false;
        $scope.slots = null;
        return angular.element($element).hide();
      };
    })(this);
    return $scope.popupCheckout = (function(_this) {
      return function(slot) {
        var dHeight, dWidth, dlg, item, k, src, url, v, wHeight, wWidth;
        item = {
          time: slot.time,
          date: $scope.selected_day.date,
          company_id: $scope.bb.company_id,
          duration: 30,
          service_id: $scope.service_id,
          event_id: slot.id
        };
        url = "/booking/new_checkout?";
        for (k in item) {
          v = item[k];
          url += k + "=" + v + "&";
        }
        wWidth = $(window).width();
        dWidth = wWidth * 0.8;
        wHeight = $(window).height();
        dHeight = wHeight * 0.8;
        dlg = $("#dialog-modal");
        src = dlg.html("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=100% height=99% src='" + url + "'></iframe>");
        dlg.attr("title", "Checkout");
        return dlg.dialog({
          my: "top",
          at: "top",
          height: dHeight,
          width: dWidth,
          modal: true,
          overlay: {
            opacity: 0.1,
            background: "black"
          }
        });
      };
    })(this);
  });


  /*
    var sprice = "&price=" + price;
    var slen = "&len=" + len
    var sid = "&event_id=" + id
    var str = pop_click_str + sid + slen + sprice + "&width=800"; // + "&style=wide";
  = "/booking/new_checkout?" + siarray + sjd + sitime ;
  
  function show_IFrame(myUrl, options, width, height){
    if (!height) height = 500;
    if (!width) width = 790;
    opts = Object.extend({className: "white", pctHeight:1, width:width+20,top:'5%', height:'90%',closable:true, recenterAuto:false}, options || {});
    x = Dialog.info("", opts);
      x.setHTMLContent("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=" + width + " height=96%" + " src='" + myUrl + "'></iframe>");
    x.element.setStyle({top:'5%'});
    x.element.setStyle({height:'90%'});
  }
   */

}).call(this);
