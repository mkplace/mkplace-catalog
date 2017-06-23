;(function($) {
    "use strict";	
    
	/*Bootstrap Multilevel Dropdown*/
    $('.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
	
	/*Instafeed*/
	function instafeedRun(){
		if ( $('#instafeed').length ){
			var feed = new Instafeed({
				get: 'user',
                userId: '2089351484',
                resolution: 'standard_resolution',
                accessToken: '2089351484.1677ed0.329c0349df414f7da21318dbb5b98795',
                limit: 6,
				template: '<div class="insta-img"><a href="{{link}}"><img src="{{image}}" /></a></div>'
			});
			feed.run()
		}
	}	
    
    function featuredProducts(){
        if ( $('.featued-products-carousel').length ){
            $('.featued-products-carousel').each(function(){
                $('.featued-products-carousel').owlCarousel({
                    loop: true,
                    margin: 0,
                    nav: true,
					navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                    items: 1,
					center: true,
					autoplay: true,
					responsive:{
						992:{
							items:3
						}
					}
                })
            })            
        }
    }
    
    function mapBox() {
        if ( $('#mapBox').length ){
            var $lat = $('#mapBox').data('lat');
            var $lon = $('#mapBox').data('lon');
            var $zoom = $('#mapBox').data('zoom');
            var $marker = $('#mapBox').data('marker');
            var $info = $('#mapBox').data('info');
            var map = new GMaps({
                el: '#mapBox',
                lat: $lat,
                lng: $lon,
                scrollwheel: false,
                scaleControl: true,
                streetViewControl: false,
                panControl: true,
                disableDoubleClickZoom: true,
                mapTypeControl: false,
                zoom: $zoom,
				styles: [
					{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},          
					{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},
					{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},
					{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},
					{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},
					{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},
					{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},
					{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},
					{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},
					{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},
					{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}
				]
            });
        
            map.addMarker({
                lat: $lat,
                lng: $lon,
                icon: $marker,				
				infoWindow: {
				 	content: $info
				}
            })
        }
    }	
    
    function filterableGallery(){
        if ( $('.isotope-gallery').length ){
			
			$(".isotope-gallery").isotope({
				itemSelector: ".gallery-item",
				layoutMode: 'masonry',
				masonry: {
					columnWidth: '.grid-sizer'
				}
			});

			// Add isotope click function
			$(".gallery-filter li").on('click',function(){
				$(".gallery-filter li").removeClass("active");
				$(this).addClass("active");

				var selector = $(this).attr("data-filter");
				$(".filterable-gallery").isotope({
					filter: selector
				})
			})                
        }
    }    
	
    
    function singleProduct(){
        if ( $('.single-product-imgs.has-carousel').length ){
            $('.single-product-imgs.has-carousel').imagesLoaded( function() {
                
				$('#proImg-carousel').flexslider({
					animation: "slide",
					controlNav: false,
					animationLoop: true,
					slideshow: false,
					directionNav: true,
					itemWidth: 100,
					itemMargin: 8,
					asNavFor: '#proImg-slider'
				});

				$('#proImg-slider').flexslider({
					animation: "slide",
					controlNav: false,
					directionNav: false,
					animationLoop: false,
					slideshow: false,
					sync: "#proImg-carousel"
				})
                
            })
        }
    }    
    
    function mainSliders(){
        if ( $('.mainSlider').length ){
            $('.mainSlider').each(function(){
                $('.mainSlider').owlCarousel({
                    loop: true,
                    margin: 0,
                    nav: true,
					navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
					dots: true,
                    items: 1,
					autoplay: true
                })
            })            
        }
    }
    
    function counterUpActivator(){
        if ( $('.counter').length ){
            $('.counter').counterUp()
        }
    }
    
    function countDownActive(){
        if ( $('#promote-countdown').length ){
             $('#promote-countdown').countdown('2016/7/05', function(event) { 
                 $(this).html(event.strftime(
                     '<div class="block days"><span class="number">%-D</span><span class="string">%!D:Day,Days;</span></div>'+
                     '<div class="block hours"><span class="number">%H</span><span class="string">%!H:Hour,Hours;</span></div>'+
                     '<div class="block minutes"><span class="number">%M</span><span class="string">%!M:Minute,Minutes;</span></div>'+
                     '<div class="block seconds"><span class="number">%S</span><span class="string">%!S:Second,Seconds;</span></div>'
                ))
            })
        }
    }
    
    function spinner(){
        if ( $('#product-quantity').length ){
             $( "#product-quantity" ).spinner()
        }
    }
    
    
    function uiSlider(){
        if ( $('.slider-range').length ) {
            $( ".slider-range" ).slider({
                range: true,
                min: 0,
                max: 250,
                values: [ 16, 200 ],
                slide: function( event, ui ) {
                    $( "span.range-amount" ).html( "$" + ui.values[ 0 ] + " &nbsp;&nbsp;-&nbsp;&nbsp; $" + ui.values[ 1 ] );
                    $( "input.range-amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] )
                }
            });
            $( "span.range-amount" ).html( "$" + $( ".slider-range" ).slider( "values", 0 ) + " &nbsp;&nbsp;-&nbsp;&nbsp; $" + $( ".slider-range" ).slider( "values", 1 ) );
            $( "input.range-amount" ).val( "$" + $( ".slider-range" ).slider( "values", 0 ) + " - $" + $( ".slider-range" ).slider( "values", 1 ) )
        }
    }
	
	function shopSidebar(){
		if ( $('.shop-sidebar').length ){
			$('.shop-sidear-btn').on('click',function(){
				$(this).toggleClass('open');
				$('.shop-sidebar .widget').toggleClass('open')
			})
		}
	}
     
    $(document).ready(function(){
		
		$('.isotope-gallery').imagesLoaded( function() {
			
			$('.mini-loader-content').fadeOut('slow');
			
			instafeedRun();					// Instafeed
			featuredProducts();				// Featured Products
			mapBox();						// Google Map 
			filterableGallery();			// Isotope Gallery
			singleProduct();				// Single Product
			mainSliders();					// Main Slider
			counterUpActivator();			// Counter Up (Fun Facts)
			countDownActive();				// Countdown Timer
			spinner();						// Spinner (Form count Input)
			uiSlider();						// Range Slider
			shopSidebar();					// Shop Sidebar
			
			//	Newsletter on Loading
			if ( $('.newsletter-popup.alert').length ){
				window.setTimeout(function(){
					$('.newsletter-popup').addClass('popped-up');
				},5000)
			}
			
		})        
        
    })
    
})(jQuery)