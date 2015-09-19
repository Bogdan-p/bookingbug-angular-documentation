$(document).ready(function() {

    $('li').click(function(e) {
        if( $(this).find('>ul').hasClass('active') ) {
            $(this).children('ul').removeClass('active').children('li').slideDown();
            e.stopPropagation();
        }
        else{
            $(this).children('ul').addClass('active').children('li').slideUp();
            e.stopPropagation();
        }
    });

});
