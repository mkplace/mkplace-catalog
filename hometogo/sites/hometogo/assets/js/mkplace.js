var shoppingcartdeliveryaddress = null;
var mkplace_user_zipcode = null;
var shoppingcartbillingaddress = null;
var shoppingcartpaymenttype = null;
var shoppingcartpaymentquota = null;
var clientaddress = {};

var mkplace = window.mkplace = {
    callback : {}, log : function(objs){ console.info("mkplace log ::", objs); },
};

Number.prototype.formatMoney = function(c, d, t){
var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

mkplace.loading = function(action, text){
    if( action == 'show' ){
        $('body').prepend("<div style='background: rgba(255,255,255,0.8) center center no-repeat; z-index: 19999; width:100%; height:200%; position:absolute;'><h3 style='margin-top:300px;' class='text-muted text-center'>"+text+"</h3></div>");
    }
}

mkplace.urlprefix = '';

mkplace.youtube = (function () {
    'use strict';

    var video, results;

    var getThumb = function (url, size) {
        if (url === null) {
            return '';
        }
        size    = (size === null) ? 'big' : size;
        results = url.match('[\\?&]v=([^&#]*)');
        video   = (results === null) ? url : results[1];

        if (size === 'small') {
            return 'http://img.youtube.com/vi/' + video + '/2.jpg';
        }
        return 'http://img.youtube.com/vi/' + video + '/0.jpg';
    };

    return {
        thumb: getThumb
    };
}());

mkplace.client = {

    getaddress : function(callback){
        $.ajax({
            'url' : mkplace.urlprefix + '/minha-conta/do/entity',
            'data' : {},
            'headers' : {
                'MkPlace-Trigger' : 'addToCart'
            },
            'success' : function(entity){
                //Callback event after
                callback(JSON.parse(entity).client.entityaddress);
            }
        });
    },

    getData : function(callback){
        $.ajax({
            'url' : mkplace.urlprefix + '/minha-conta/do/entity',
            'data' : {},
            'headers' : {
            },
            'success' : function(entity){
                //Callback event after
                callback(JSON.parse(entity).client, JSON.parse(entity).login);
            }
        });
    },

    setZipcode : function(zipcode, callback){
        mkplace_user_zipcode = zipcode;
        mkplace.product.applySellInfo(callback);
    }

}

mkplace.shoppingcart = {

    count : function(){
        mkplace.shoppingcart.countitem(function(count){
            $('[mkplace-shoppingcart-count]').html(count);
            if( parseInt(count) > 0 ){
                $.ajax({
                    'url' : '/shoppingcart/do/mini_shoppingcart',
                    'dataType' : 'JSON',
                    'success' : function( mini_shoppingcart ){
                        $container = $('#mini-cart-items');
                        for( i in mini_shoppingcart.items ){
                            $product = mini_shoppingcart.items[i];
                            $item = $('<div class="cart-item" />');
                            $item.html( '<div class="qty">' + $product.quantity + '</div><div class="price">' + $product.totalprice + '</div><div class="name">' + $product.sku_name + '</div>' );
                            $item.appendTo( $container );
                        }
                        $total = $('<div class="total-cart" />').html('<strong>TOTAL:</stron><br /><h1>' + mini_shoppingcart.totalprice + '</h1>' );
                        $total.appendTo( $container );
                        $('header .shopping-cart .mini-shoppingcart .content .loading').hide();
                        $('header .shopping-cart .mini-shoppingcart .content .thead').show();
                    }
                });
            }
        });
    },

    countitem : function(callback){
        params = {};
        $.ajax({
            'url' : mkplace.urlprefix + '/shoppingcart/do/countitem',
            'data' : params,
            'headers' : {
                'MkPlace-Trigger' : 'addToCart'
            },
            'success' : function(count){
                //Callback event after
                callback(count);
            }
        });
    },

    getInstallments : function(callback){
        params = {};
        idpaymentform = (shoppingcartpaymenttype == 'billet' ? 2 : 1)
        $.ajax({
            'url' : mkplace.urlprefix + '/shoppingcart/do/getinstallments',
            'data' : {'zipcode' : clientaddress[shoppingcartdeliveryaddress].zipcode, 'idpaymentform' : idpaymentform },
            'dataType' : 'JSON',
            'success' : function( installments ){
                //Callback event after
                callback( installments );
            }
        });
    },

    setPaymentForm : function( paymenttype, callback ){
        shoppingcartpaymenttype = paymenttype;
        if( typeof callback == 'function' ){ callback( paymenttype ) }
    },


    setPaymentQuota : function( num_quota, callback ){
        shoppingcartpaymentquota = num_quota;
        console.log(shoppingcartpaymentquota);
        if( typeof callback == 'function' ){ callback( num_quota ) }
    },

    setDeliveryAddress : function( idaddress, callback ){
        shoppingcartdeliveryaddress = idaddress;
        if( typeof callback == 'function' ){ callback( idaddress ) }
    },

    setBillingAddress : function( idaddress, callback ){
        shoppingcartbillingaddress = idaddress;
        if( typeof callback == 'function' ){ callback( idaddress ) }
    },

    /**
     *  Add item to cart
     *  @param element = Any DOMElement with attribute mkplace-cartitem-quantity="{'idsku' : Int, 'idseller' : Int}" String
     *  @param newquantity Int
     *  @param config = {'after' : Function, 'before' : Function} Object
     */
    changequantity : function(element, newquantity, config){

        if($(element).attr('mkplace-cartitem-quantity')){
            params = JSON.parse($(element).attr('mkplace-cartitem-quantity'));
        }else{
            params = JSON.parse($(element).attr('mkplace-cartitem-remove'));
        }

        params.quantity = typeof newquantity != 'undefined' ? newquantity : 1;

        if(!(params.idsku && params.idseller)){
            alert("Internal error: mkplace.product.addToCart need contain idsku, idseller and quantity params.");
            return false;
        }

        //Callback event before
        if(typeof config.before != 'function'){ config.before = function(event){ return true; } }

        //Callback event after
        if(typeof config.after != 'function'){ config.after = function(event){ return true; } }

        if(config.before(params)){
            $.ajax({
                'url' : mkplace.urlprefix + '/shoppingcart/do/changequantity',
                'data' : params,
                'headers' : {
                    'MkPlace-Trigger' : 'addToCart'
                },
                'success' : function(json){
                    //Callback event after
                    config.after({'success' : true});
                }
            });
        }
    },

};

mkplace.product = {
    /**
     *  Add item to cart
     *  @param element = Any DOMElement with attribute mkplace-buy="{'idsku' : Int, 'idseller' : Int}" String
     *  @param quantity Int
     *  @param config = {'after' : Function, 'before' : Function} Object
     */
    addToCart : function(element, quantityitem, config){
        params = JSON.parse($(element).attr('mkplace-buy'));
        params.quantity = typeof quantityitem != 'undefined' ? quantityitem : 1;

        if(!(params.idsku && params.idseller && params.quantity)){
            alert("Internal error: mkplace.product.addToCart need contain idsku, idseller and quantity params.");
            return false;
        }

        //Callback event before
        if(typeof config.before != 'function'){ config.before = function(event){ return true; } }

        //Callback event after
        if(typeof config.after != 'function'){ config.after = function(event){ return true; } }

        if(config.before(params)){
            $.ajax({
                'url' : mkplace.urlprefix + '/product/do/addtocart',
                'data' : params,
                'headers' : {
                    'MkPlace-Trigger' : 'addToCart'
                },
                'success' : function(json){
                    //Callback event after
                    config.after({'success' : true});
                }
            });
        }
    },


    /**
     *  Add item to cart
     *  @param element = Any DOMElement with attribute mkplace-buy="{'idsku' : Int, 'idseller' : Int}" String
     *  @param quantity Int
     *  @param config = {'after' : Function, 'before' : Function} Object
     */
    createCupom : function(element, config){
        params = JSON.parse($(element).attr('mkplace-cupom'));

        if(!(params.idsku && params.idseller)){
            alert("Internal error: mkplace.product.addToCart need contain idsku, idseller and quantity params.");
            return false;
        }

        //Callback event before
        if(typeof config.before != 'function'){ config.before = function(event){ return true; } }

        //Callback event after
        if(typeof config.after != 'function'){ config.after = function(event){ return true; } }

        if(config.before(params)){
            $.ajax({
                'url' : mkplace.urlprefix + '/product/do/createcupom',
                'data' : params,
                'dataType' : 'JSON',
                'headers' : {
                    'MkPlace-Trigger' : 'createCupom'
                },
                'success' : function(json){
                    //Callback event after
                    config.after({'success' : true, 'cupom' : json});
                }
            });
        }
    },

    addToWishlist : function( idsku, callback ){
        $.ajax({
            'url' : mkplace.urlprefix + '/product/do/addtowishlist',
            'data' : {'idsku' : idsku},
            'dataType' : 'JSON',
            'headers' : {
                'MkPlace-Trigger' : 'addToWishlist'
            },
            'success' : function(json){
                //Callback event after
                if( typeof callback == 'function' ){
                    callback( json );
                }
            }
        });
    },

    removeFromWishlist : function( idsku, callback ){
        $.ajax({
            'url' : mkplace.urlprefix + '/product/do/rmfromwishlist',
            'data' : {'idsku' : idsku},
            'dataType' : 'JSON',
            'headers' : {
                'MkPlace-Trigger' : 'addToWishlist'
            },
            'success' : function(json){
                //Callback event after
                if( typeof callback == 'function' ){
                    callback( json );
                }
            }
        });
    },

    addLetMe : function( idsku, callback ){
        $.ajax({
            'url' : mkplace.urlprefix + '/product/do/addletme',
            'data' : {'idsku' : idsku},
            'headers' : {
                'MkPlace-Trigger' : 'addLetMe'
            },
            'success' : function(json){
                //Callback event after
                if( typeof callback == 'function' ){
                    callback( json );
                }
            }
        });
    },

    getSellInfo : function (pricetype, idsku){
        if( typeof window.getprices == 'undefined' ){
            window.getprices = [];
        }
        window.getprices.push(idsku);
        document.write("<span mkplace-show-price='"+idsku+"' mkplace-show-price-type='"+pricetype+"'>...</span>");
    },

    createReview : function( review, callback ){
        if( !review.title ){
            toastr.error('Digite um titulo para seu comentário');
            return;
        }
        if( !review.rating ){
            toastr.error('Escolha uma nota para esse produto');
            return;
        }
        if( !review.comment ){
            toastr.error('Escreva um comentário');
            return;
        }
        $.ajax({
            'url' : mkplace.urlprefix + '/product/do/addreview',
            'type' : 'POST',
            'data' : review,
            'headers' : {
                'MkPlace-Trigger' : 'addLetMe'
            },
            'success' : function(json){
                //Callback event after
                if( typeof callback == 'function' ){
                    callback( json );
                }
            }
        });
        return;
    },

    applySellInfo : function(callback){

        if( !window.getprices ){ return false; }

        window.getprices = (function unique(array){
            return array.filter(function(el, index, arr) {
                return index == arr.indexOf(el);
            });
        })( window.getprices );

        Number.prototype.formatMoney = function(c, d, t){
            var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };

        function formatNumber(int) {
            return Number(int).formatMoney(2, ',', '.');
        }

        $.ajax({
            'url' : mkplace.urlprefix + '/product/do/getprices',
            'data' : {'idsku' : window.getprices.join(','), 'zipcode' : mkplace_user_zipcode},
            'success' : function( response ){
                response = JSON.parse(response);
                for( i in window.getprices ){
                    var price = response[ window.getprices[i] ];
                    $('#product-loading').hide();

                    if(price){

                        $('#product-avaible[data-productid="'+window.getprices[i]+'"]').show();
                        var sellerlink = '<a href="/busca?idseller='+price.idseller+'"><strong class="primary-color underline">'+price.sellername+'</strong></a>';
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="listprice"]').html("R$ " + formatNumber(price.listprice));
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="incashprice"]').html("R$ " + formatNumber(price.incashprice));
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="sellprice"]').html("R$ " + formatNumber(price.discountedprice));
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="stockquantity"]').html(formatNumber(price.stockquantity));
                        if(mkplace_user_zipcode){
                            $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="zipcode"]').html(mkplace_user_zipcode);
                        }
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="sellername"]').html(sellerlink);
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="height"]').html(price.height);
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="width"]').html(price.width);
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="length"]').html(price['length']);
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="weight"]').html(price.weight);

                        if( price.shipping ){
                            $('#product-shipping-price').show();
                            $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="shipping-price"]').html("R$ " + formatNumber(price.shipping.discountedprice));
                            $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="shipping-time"]').html(price.shipping['time']);
                        }

                    }else{
                        $('#product-not-avaible[data-productid="'+window.getprices[i]+'"]').show();
                        $('#product-loading[data-productid="'+window.getprices[i]+'"]').hide();
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="listprice"]').html('indisponivel');
                        $('[mkplace-show-price="'+window.getprices[i]+'"][mkplace-show-price-type="sellprice"]').html('indisponivel');
                    }

                    if(typeof callback == 'function'){
                        callback();
                    }
                }
            }
        });
    }
};

mkplace.onloader = function( initializer ){
    $(document).ready(function(){
        initializer();
    });
}

mkplace.initializer = function( initializer ){
    mkplace.onloader(function(){
        initializer();
        mkplace.shoppingcart.count();
        mkplace.product.applySellInfo();
    });
}
