var homeslider = null;

var idcupomcurrent = null;

mkplaceApp = angular.module('mkplaceApp', []).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

mkplaceApp.controller('shoppingcartController', function($scope, $http) {

    $scope.currentAddress = {};

    $scope.$watch('currentAddress.zipcode', function( zipcode ){
        if( !zipcode ) return;
        if( zipcode.length >= 8 ){
            $http({
                method: 'GET', url: 'https://api.postmon.com.br/v1/cep/'+zipcode.replace('-','')
            }).success(function(response){
                console.log(response);
                $scope.currentAddress.street = response.logradouro;
                $scope.currentAddress.neighborhood = response.bairro;
                $scope.currentAddress.city = response.cidade;
                $scope.currentAddress.state = response.estado;
            });
        }
    });

    $scope.openAddress = function( idaddress ){
        if( typeof idaddress != 'undefined' ){
            $http({
                method: 'GET', url: '/minha-conta/do/getaddress/'
            }).success(function(response){
                $scope.currentAddress = response;
            });
        }else{
            $scope.currentAddress = {};
        }
        $('#AddressModal').modal('show');
        $('.cep').mask('00000-000');
    };

    $scope.saveAddress = function(){
        if(!$scope.currentAddress.street){
            toastr.error("Digite o CEP para buscar o endereço");
            return false;
        }
        if(!$scope.currentAddress.number){
            toastr.error("Digite o numero do endereço");
            return false;
        }
        $http({
            method: 'POST', url: '/minha-conta/do/addaddress',
            data: $.param({'address' : [$scope.currentAddress]}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(response){
            $scope.currentAddress = {};
            toastr.success('Endereço salvo com sucesso!');
            window.location.reload();
            $('#AddressModal').modal('hide');
        });
    };

});

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

    mkplace.initializer(function(){

        $('.show-more-attribute').on('click', function(){
            var $div = $(this).parent();
            var ul = $div.find('ul.attribute-tree');
          if(  $(this).hasClass('active') ){
              ul.css('max-height', '140px');
              $(this).removeClass('active');
          }else{
              ul.css('max-height', '1200px');
              $(this).addClass('active');
          }
        });

        $(".custom-select.manufacturer").each(function() {
            var classes = $(this).attr("class"),
                id      = $(this).attr("id"),
                name    = $(this).attr("name");

            var template =  '<div class="' + classes + '">';
                template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
                template += '<div class="custom-options">';
                $(this).find("option").each(function() {
                    template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
                });

            template += '</div></div>';

            $(this).wrap('<div class="custom-select-wrapper"></div>');
            $(this).hide();
            $(this).after(template);
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

        $('.input-qty-left').on('click', function(){
            $val = parseInt( $(this).parent().find('.input-qty input').val() ) - 1;
            $(this).parent().find('.input-qty input').val( $val );
            $(this).parent().find('.input-qty input').trigger('change');
        });

        $('.input-qty-right').on('click', function(){
            $val = parseInt( $(this).parent().find('.input-qty input').val() ) + 1;
            $(this).parent().find('.input-qty input').val( $val );
            $(this).parent().find('.input-qty input').trigger('change');
        });

        $('[name="zipcode[0]"]').on('keyup keydown', function(event){
            if( $(this).val().length == 5 && event.which != 8 ){
                $('[name="zipcode[1]"]').focus();
            }
        });

        $('.productZipcode:not(.cep_b)').on('keyup keydown', function(event){
            if( $(this).val().length == 5 && event.which != 8 ){
                $('.productZipcode.cep_b').focus();
            }
        });

        $('.set-zipcode-shoppingcart').on('click', function(){
            var first = $('[name="zipcode[0]"]').val();
            var last = $('[name="zipcode[1]"]').val();
            if(!first || !last){
                toastr.error("Digite um CEP valido");
            }else{
                window.location.href = '/carrinho?zipcode=' + (first + last);
            }
        });

        $('.link-action.email').on('click', function(){
            $('#myaccount-changeemail').show();
            $('#myaccount-email').hide();
            $(this).hide();
        });

        $('.link-action.password').on('click', function(){
            $('#myaccount-changepassword').show();
            $('#myaccount-password').hide();
            $(this).hide();
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
        console.log($('.slider.top'));
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


        mkplace.client.getData(function(user, login){
            client_name = user.firstname + " " + user.lastname.split(' ')[0];

            $('[mkplace-client-name]').html(client_name);
            $('[mkplace-user-email]').html(user.useraccount.email);

            if( user.useraccount.ventureinfo != null ){
                try {
                    $('[mkplace-venture-name]').html(user.useraccount.ventureinfo.name);
                    $('[mkplace-store-name]').html(user.useraccount.storeinfo.name);
                } catch (e) {}
            }

            operator_name = '';

            if( login.permissiontype == 'telemarketing' ){
                $('.well.sell-operator').show();
                operator_name = login.entity.firstname + " " + login.entity.lastname;
                $('[mkplace-operator-name]').html(operator_name);
                $('[mkplace-operator-logged-as-name]').html(client_name);
            }

            if( login.permissiontype == 'telemarketing' && user.identity == login.entity.identity ){
                $('.well.sell-operator .message').html('Olá ' + operator_name + ', você está acessando como um Operador de televendas, para escolher um cliente <a href="javascript:;" class="telemarketing-openswitch">clique aqui</a>.');
            }else if ( login.permissiontype == 'telemarketing' ){
                $('.well.sell-operator').addClass('active');
            }

            $('.telemarketing-openswitch').on('click', function(){
                $('.well.sell-operator .switch').toggle();
            });

        });

        $('#manufacturer-filter').on('change', function(){
            window.location.href = '' + $('#manufacturer-filter').val();
        });

        $('.attribute-switch').on('change', function(){
            window.location.href = $(this).val();
        });

        // Events
        $('[mkplace-buy]').on('click', function(event){
            var element = $(this);

            //buy product event
            var quantityitem = 1;

            mkplace.product.addToCart(this, quantityitem, {
                after : function(response){
                    if(response.success){
                        toastr.info('Produto adicionado com sucesso');
                        if( !element.hasClass('no-follow') ){
                            window.location.href = '/carrinho?added=';
                        }else{
                            mkplace.shoppingcart.count();
                            $('html, body').animate({'scrollTop':'0px'});
                        }
                    }else{
                        toastr.error(response.error);
                    }
                }
            });


        });

        // Events
        $('[mkplace-cupom]').on('click', function(event){
            //buy product event
            mkplace.product.createCupom(this, {
                after : function(response){
                    $('[mkplace-cupom-date]').html(response.cupom.data.createdat);
                    $('[mkplace-cupom-code]').html(response.cupom.data.code);
                    $('[mkplace-client-document]').html(response.cupom.data.entitydocument.document);
                    if( typeof response.cupom.data.entityfone != 'undefined' ){
                        $('[mkplace-client-fone]').html("("+response.cupom.data.entityfone.ddd+") " + response.cupom.data.entityfone.fone);
                    }else{
                        $('[mkplace-client-fone]').html("Não informado");
                    }
                    $('[mkplace-cupom-percent]').html(response.cupom.data.storeinfo.percent);
                    $('[mkplace-cupom-address]').html(response.cupom.data.storeinfo.address);
                    $('[mkplace-cupom-legalinfo]').html(response.cupom.data.storeinfo.legalinfo);
                    $('#ProductCupom').modal('show');
                    if( response.cupom.data.already ){
                        toastr.warning( 'Já existe um cupom não utilizado para esse item'  );
                    }else{
                        toastr.info( 'Cupom ' + response.cupom.data.code + ' gerado com sucesso!'  );
                    }
                    idcupomcurrent = response.cupom.data.idcupom;
                }
            });
        });

        $('[mkplace-cartitem-quantity]').on('change', function(){
            newQuantity = $(this).val();
            mkplace.shoppingcart.changequantity(this, newQuantity, {
                after : function(response){
                    if(response.success){
                        window.location.href = '/carrinho?updated=true';
                    }else{
                        toastr.error(response.error);
                    }
                }
            });
        });

        $('[mkplace-cartitem-remove]').on('click', function(){
            newQuantity = 0;
            mkplace.shoppingcart.changequantity(this, newQuantity, {
                after : function(response){
                    if(response.success){
                        window.location.href = '/carrinho?removed=true';
                    }
                }
            });
        });

        $('.show-all-attributes').on('click',function(){
            if($(this).hasClass('active')){
                $('div.hidden-attributes').css('height','80px');
                $('.show-all-attributes').removeClass('active');
            }else{
                $('div.hidden-attributes').css('height',$('div.hidden-attributes div').css('height'));
                $('.show-all-attributes').addClass('active');
            }
        });

        $('.goto-shipping-method').on('click',function(){
            mkplace.client.getaddress(function(address){
                for(a in address){
                    clientaddress[address[a].identityaddress] = address[a];
                    var $option_shipping = $('<option />').html(address[a].identifier).attr('value', address[a].identityaddress);
                    var $option_billing = $('<option />').html(address[a].identifier).attr('value', address[a].identityaddress);
                    if( $('#shipping-address option[value='+address[a].identityaddress+']').length == 0 ){
                        $('#shipping-address').append( $option_shipping );
                    }
                    $('#billing-address').append( $option_billing );
                }
                //$('#billing-address').val( $('#billing-address :nth-child(2)').val() ).trigger('change');
                //$('#shipping-address').val( $('#shipping-address :nth-child(2)').val() ).trigger('change');
            });
            $('.shopping-cart-resume-title, .shopping-cart-resume').show();
            $(".shopping-cart-wizard").css('height', '0px');
            $("#shipping-method").css('height', $("#shipping-method").find('.content').height()+50+'px');
            $(".shopping-cart-wizard").removeClass('active');
            $("#shipping-method").addClass('active');
        });

        $('.goto-payment-method').on('click',function(){
            $(".shopping-cart-wizard").css('height', '0px');
            $("#payment-method").css('height', $("#payment-method").find('.content').height()+50+'px');
            $(".shopping-cart-wizard").removeClass('active');
            $("#payment-method").addClass('active');
            $('.payment-creditcard').trigger('click');
        });

        $("#cart-method").css('height', $("#cart-method").find('.content').height()+50+'px');

        $('#finishbuy').on('click', function(){
            $.ajax({
                'url' : mkplace.urlprefix + '/shoppingcart/do/finishbuy',
                'data' : {},
                'headers' : {
                    'MkPlace-Trigger' : 'addToCart'
                },
                'success' : function(entity){
                    //Callback event after
                    //callback(JSON.parse(entity).entityaddress);
                    alert('Compra realizada com sucesso.')
                }
            });
        });

        // Product galery
        $('#galerythumb').perfectScrollbar();
        $('#galerythumb ul li').on('click', function(){
            var zoomsrc = $(this).find('img').data('src-zoom');
            $('#imagezoom img').attr('src', zoomsrc);
            $('#imagezoom').zoom();
        });
        $('#galerythumb ul li:first').trigger('click');

        $('.setZipcode').on('click', function(){
            mkplace.client.setZipcode( $('.productZipcode:not(.cep_b)').val() + '' + $('.productZipcode.cep_b').val() , function(){
                $('html, body').animate({'scrollTop':'0px'});
            });
        });

        //Add to wishlist
        $('[mkplace-add-wishlist]:not(.wishlist)').on('click', function(){
            mkplace.product.addToWishlist( $(this).attr('mkplace-add-wishlist'), function(){
                toastr.success('Produto adicionado com sucesso!');
            });
        });

        //Add to wishlist
        $('[mkplace-add-wishlist].wishlist').on('click', function(){
            var btn = $(this);
            mkplace.product.removeFromWishlist( $(this).attr('mkplace-add-wishlist'), function(){
                btn.parent().parent().parent().parent().remove();
                toastr.success('Produto removido com sucesso!');
            });
        });

        //Add to letme
        $('[mkplace-add-letme]').on('click', function(){
            mkplace.product.addLetMe( $(this).attr('mkplace-add-letme'), function(){
                toastr.success('Solicitação recebida com sucesso!');
                $('div.letme').slideUp();
                $('.letme-btn').show();
            });
        });

        $('.letme-btn').on('click', function(){
            $('div.letme').slideDown();
            $('.letme-btn').hide();
        });

        $('#card_number').on('keyup keydown', function(){
            var number = $('#card_number').val();

            var re = {
                electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
                maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
                dankort: /^(5019)\d+$/,
                interpayment: /^(636)\d+$/,
                unionpay: /^(62|88)\d+$/,
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/,
                amex: /^3[47][0-9]{13}$/,
                diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            };

            $('.brand-amex, .brand-visa, .brand-mastercard').removeClass('active');

            if (re.visa.test(number)) {
                $('.brand-visa').addClass('active');
            } else if (re.mastercard.test(number)) {
                $('.brand-mastercard').addClass('active');
            } else if (re.amex.test(number)) {
                $('.brand-amex').addClass('active');
            }
        });

        // Social integration
        $.ajax({
            'url' : '/social/do/getfeed',
            'dataType' : 'JSON',
            'success' : function( social ){
                $('#social-instagram a').attr('href', 'javascript:;');
                $('#social-instagram a div.img').css('background-image','url("'+social.instagram.image+'")').css('background-size','290px 290px');

                if( social.instagram.type == 'video' ){
                    $('#social-instagram a').on('click', function(){
                        $('#InstagramVideo').modal('show');
                        document.getElementById("instagram-video").play();
                    });
                    $('#instagram-video').attr('src', social.instagram.video).attr('poster', social.instagram.image);
                }else{
                    $('#social-instagram a').attr('href', social.instagram.link);
                }

                $('#social-facebook a').attr('href', social.facebook.link);
                $('#social-facebook a div.img').css('background-image','url("'+social.facebook.image+'")').css('background-size','290px 290px');

            }
        });

    });

});
