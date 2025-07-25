$(window).scroll(function(){
    var height = $(window).scrollTop();
    if( height > 50 ){
       $('html').addClass('sticky')
    }
    else{
        $('html').removeClass('sticky')
    }
});

$(document).ready(function(){
    $('.navbar-toggle').click(function(){
    $(".nav-wrap").toggleClass("active")
})
jQuery(".theme-switch").click(function () {
      jQuery("body").toggleClass("dark-active");
  });
})
$('.header-arrow a').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('sidebar-collapsed');
});


$('.card-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    dots:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})