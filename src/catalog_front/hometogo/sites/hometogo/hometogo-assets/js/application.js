var homeslider = null;

var idcupomcurrent = null;

$(document).ready(function(){

    $('.banner-sku .toggle').on('click', function(){
        if( $(this).hasClass('active') ){
            $('.banner-sku').addClass("ignored");
            $(this).removeClass('active');
            $('.banner-sku').css('right', '-285px')
        }else{
            $(this).addClass('active');
            $('.banner-sku').css('right', '0px')
        }
    });

    $('.banner-sku .closebtn').on('click', function(){
        $('.banner-sku').css('right', '-320px')
    });

    $(".custom-option:first-of-type").hover(function() {
        $(this).parents(".custom-options").addClass("option-hover");
    }, function() {
        $(this).parents(".custom-options").removeClass("option-hover");
    });

    $(".custom-select-trigger").on("click", function(event) {
        $('html').one('click',function() {
            $(".custom-select").removeClass("opened");
        });
        $(this).parents(".custom-select").toggleClass("opened");
        event.stopPropagation();
    });

    $(".custom-option").on("click", function() {
        $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
        $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
        $(this).addClass("selection");
        $(this).parents(".custom-select").removeClass("opened");
        $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
    });

    $('.product-thumb').on('mouseover mousehover', function(){
        if($(this).find('.image .sec-image').length > 0){
            $(this).find('.image .sec-image').css('display', 'block');
            $(this).find('.image .first-image').css('display', 'none');
        }
    }).on('mouseleave', function(){
        if($(this).find('.image .sec-image').length > 0){
            $(this).find('.image .sec-image').css('display', 'none');
            $(this).find('.image .first-image').css('display', 'block');
        }
    });

    $('.product-actions a').on('mouseover mousehover', function(){
        if(!$(this).hasClass('addgo-to-cart')){
            var old = $(this).css('background-color');
            $(this).parent().find('.addgo-to-cart').attr('style','background-color:' + old + ' !important');
            $(this).addClass('active');
        }else{
            $(this).parent().find('.addgo-to-cart').addClass('active');
        }
    }).on('mouseleave', function(){
        $(this).removeClass('active');
        $(this).parent().find('.addgo-to-cart').addClass('active');
        $(this).parent().find('.addgo-to-cart').attr('style', '');
    });

    $(".product-thumb .image img").lazyload({
        threshold : 400
    });

    //scrollup
    $(window).on('scroll', function(event){
        $diff = parseInt($('html, body').css('height').replace('px','')) - 2400;

        if( !$('.banner-sku').hasClass('ignored') ){
            if( $(this).scrollTop() > $diff ){
                $('.banner-sku').css('right', '0px');
                $('.banner-sku .toggle').addClass('active');
            }else if( $(this).scrollTop() < $diff ){
                $('.banner-sku').css('right', '-285px');
                $('.banner-sku .toggle').removeClass('active');
            }
        }

        if( $(this).scrollTop() > 100 ){
            $('.page-scrollup').fadeIn();
        } else {
            $('.page-scrollup').fadeOut();
        }

        if( $(this).scrollTop() > 560 ){
            $('#product-tabs').fadeIn();
        }else{
            $('#product-tabs').fadeOut();
        }
    });

    $('#product-tabs .nav.nav-pills li').on('click', function(){
        $('html, body').animate({'scrollTop':'890px'});
    });

    $('.page-scrollup').on('click', function(){
        $('html, body').animate({'scrollTop':'0px'});
    });

    // Toggle resume items cart
    $('.show-items.show-ac').on('click', function(){
        $('.shopping-cart-resume').css('height','360px');
        $('.shopping-cart-resume .items .content').css('height','200px');
        $('.shopping-cart-resume .items .content').css('overflow','scroll').css('overflow-x','hidden');
        $('.show-items.show-ac').hide();
        $('.show-items.hide-ac').show();
    });

    $('.show-items.hide-ac').on('click', function(){
        $('.shopping-cart-resume').css('height','160px');
        $('.shopping-cart-resume .items .content').css('height','0px');
        $('.shopping-cart-resume .items .content').css('overflow','hidden').css('overflow-x','hidden');
        $('.show-items.show-ac').show();
        $('.show-items.hide-ac').hide();
    });

    // Sliders & Carousels
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

    $('.full-cartridge').bxSlider({
        slideWidth: 220,
        minSlides: 3,
        auto: true,
        pause : 8000,
        speed:1000,
        maxSlides: 7,
        pager:false,
        slideMargin: 9,
        onSlideAfter : function(){
            $('html, body').trigger("scroll");
            $(window).trigger("scroll");
        }
    });

    // Banner home expand
    $('.banner-expand .controller a').on('click', function(){
        $banner = $(this).parent().parent();
        if($(this).hasClass('active')){
            $banner.css('height', '200px');
            $(this).parent().css('opacity','1')
            $(this).removeClass('active');
            $(this).html('CLIQUE PARA EXPANDIR');
        }else{
            $banner.css('height', $banner.find('.content').height()+'px');
            $(this).parent().css('opacity','0.3')
            $(this).addClass('active');
            $(this).html('CLIQUE PARA ESCONDER');
        }
    });

    $('.banner-expand').on('mouseover', function(){
        if(!$(this).find('.controller a').hasClass('active')){
            $banner = $(this);
            $banner.css('height', '220px');
        }
    }).on('mouseout', function(){
        if(!$(this).find('.controller a').hasClass('active')){
            $banner = $(this);
            $banner.css('height', '200px');
        }
    });

    // Events

    $("#cart-method").css('height', $("#cart-method").find('.content').height()+50+'px');

    // Product galery
    $('#galerythumb').perfectScrollbar();
    $('#galerythumb ul li').on('click', function(){
        var zoomsrc = $(this).find('img').data('src-zoom');
        $('#imagezoom img').attr('src', zoomsrc);
        $('#imagezoom').zoom();
    });
    $('#galerythumb ul li:first').trigger('click');

});
