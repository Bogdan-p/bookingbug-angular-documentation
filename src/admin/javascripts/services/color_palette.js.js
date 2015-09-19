
/***
* @ngdoc service
* @name  BBAdmin.Services:ColorPalette
*
* @description
* Factory ColorPalette
*
 */

(function() {
  angular.module('BBAdmin.Services').factory('ColorPalette', function() {
    var colors;
    colors = [
      {
        primary: '#001F3F',
        secondary: '#80BFFF'
      }, {
        primary: '#FF4136',
        secondary: '#800600'
      }, {
        primary: '#7FDBFF',
        secondary: '#004966'
      }, {
        primary: '#3D9970',
        secondary: '#163728'
      }, {
        primary: '#85144B',
        secondary: '#EB7AB1'
      }, {
        primary: '#2ECC40',
        secondary: '#0E3E14'
      }, {
        primary: '#FF851B',
        secondary: '#663000'
      }
    ];
    return {

      /***
      * @ngdoc method
      * @name setColors
      * @methodOf BBAdmin.Services:AdminClientService
      *
      * @description
      * Method setColors
      *
      * @param {object} models Info
      *
      * @returns {object} model.textColor
       */
      setColors: function(models) {
        return _.each(models, function(model, i) {
          var color;
          color = colors[i % colors.length];
          model.color = color.primary;
          return model.textColor = color.secondary;
        });
      }
    };
  });

}).call(this);
