
/***
* @ngdoc service
* @name BB.Services:PaginationService
*
* @description
* Factory PaginationService
*
* @returns {Promise} This service has the following set of methods:
*
* - initialise(options)
* - update(paginator, length)
*
 */

(function() {
  angular.module('BB.Services').factory("PaginationService", function() {
    return {
      initialise: function(options) {
        var paginator;
        if (!options) {
          return;
        }
        paginator = {
          current_page: 1,
          page_size: options.page_size,
          num_pages: null,
          max_size: options.max_size,
          num_items: null
        };
        return paginator;
      },
      update: function(paginator, length) {
        var end, start, total;
        if (!paginator || !length) {
          return;
        }
        paginator.num_items = length;
        start = ((paginator.page_size - 1) * paginator.current_page) - ((paginator.page_size - 1) - paginator.current_page);
        end = paginator.current_page * paginator.page_size;
        total = end < paginator.page_size ? end : length;
        end = end > total ? total : end;
        total = total >= 100 ? "100+" : total;
        return paginator.summary = start + " - " + end + " of " + total;
      }
    };
  });

}).call(this);
