$(document).on('click', '.fa-bars', function(){
    $(this).removeClass('fa-bars').addClass('fa-times');
    $('header nav').stop().slideDown();
});
$(document).on('click', '.fa-times', function(){
    $(this).removeClass('fa-times').addClass('fa-bars');
    $('header nav').stop().slideUp();
});


$(window).resize(function() {
    var winWid = $(window).width();
    if(winWid>990){
        $('header nav').show();
    }
});
