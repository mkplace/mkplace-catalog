$('#carousel-example-generic').carousel({
  interval: false
});

var megamenu_opened = false;
/* Dropdown do megamenu */
$('ul.nav li.dropdown.drophover').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn();
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut();
});

/* MEGAMENU com as listas */
$('.drophover .dropdown-menu li').hover(function(){
  $('.megamenu').show();
}, function(){
  $('.megamenu').hide();
});

//verificar se ao sair do menu, ele foi pro megamenu. Se sim, deixar dropdown aberto, se nao, fechar.
$('.megamenu').hover(function(){
  $('.megamenu').show();
  $('ul.nav li.dropdown.drophover').find('.dropdown-menu').stop(true, true).delay(100).fadeIn();
}, function(){
  $('ul.nav li.dropdown.drophover').find('.dropdown-menu').stop(true, true).delay(100).fadeOut();
  $('.megamenu').hide();
});

//Hover do filtro (colocar background vermelho e cor do texto branco)
$('.filter-dropdown ul.menu li.item-menu').hover(function(){
  $(this).css({'background-color': '#ae1323'});
  $('a.a-menu', this).css({'color': 'white'});
}, function(){
  $(this).css({'background-color': 'transparent'});
  $('a.a-menu', this).css({'color': 'black'});
});

//Dropdown do Filtro
$('.filter-dropdown ul.menu li.item-menu').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn();
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut();
});

$(document).ready(function(){

    $('#galerythumb').perfectScrollbar();
    // $('html').perfectScrollbar();
    $('.mini-shoppingcart-container .wrap').perfectScrollbar();
    $('#galerythumb div a').on('click', function(){
        var zoomsrc = $(this).find('img').data('src-zoom');
        $('#imagezoom img').attr('src', zoomsrc);
        $('#imagezoom').zoom();
    });
    $('#imagezoom').zoom();

  // $('.starrr').starrr({
  //   rating: 4,
  //   readOnly: true
  // });

  homeslider = $('.slider.top').bxSlider({
      controls : false,
      pause : 5000,
      auto : $('.slider.top a:not(.bx-clone) .slide').length > 1 ? true : false,
      pager: $('.slider.top a:not(.bx-clone) .slide').length > 1 ? true : false
  });

  $('.homeslider-nav-prev').on('click', function(){
      homeslider.goToPrevSlide();
  });

  $('.homeslider-nav-next').on('click', function(){
      homeslider.goToNextSlide();
  });

  $('.slider:not(.top)').each(function(){
      // Sliders & Carousels
      $(this).bxSlider({
          mode : $(this).hasClass('slider-fade') ? 'fade' : 'horizontal',
          auto : $(this).find('a:not(.bx-clone) .slide').length > 1 ? true : false,
          controls : false,
          pager: $(this).find('a:not(.bx-clone) .slide').length > 1 ? true : false,
          pause : 6000,
      });
  });

  $('.full-cartridge-4').bxSlider({
      slideWidth: 1000,
      minSlides: 4,
      auto: true,
      pause : 8000,
      speed:1000,
      maxSlides: 7,
      pager:false,
      slideMargin: 20,
      onSlideAfter : function(){
          $('html, body').trigger("scroll");
          $(window).trigger("scroll");
      }
  });

  $('.full-cartridge-5').bxSlider({
      slideWidth: 1561,
      minSlides: 5,
      auto: true,
      pause : 8000,
      speed:1000,
      maxSlides: 7,
      pager:false,
      slideMargin: 20,
      onSlideAfter : function(){
          $('html, body').trigger("scroll");
          $(window).trigger("scroll");
      }
  });

});
