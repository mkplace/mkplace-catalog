catalog = {};

catalog.ang = angular.module('catalog', []).config(function( $interpolateProvider ){ $interpolateProvider.startSymbol('[[').endSymbol(']]'); });

catalog.ang.filter('real_format', function() {
    return function(number) {
        return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 , style: 'decimal', currency: 'BRL' });
    };
});

catalog.ang.controller('main', function($scope, $http) {

    $scope.customer = {};

    $scope.initialize = function(){
        $scope.customer.get_info();
    };

    $scope.customer.get_info = function(){
        $http.post("/pass/front/get_customer", {}).success(function( response ){
            if(response.result){
                $scope.customer.info = {
                    "firstname" : response.result.info.name,
                    "group_name" : "Gafisa",
                    "id" : response.result.info.id
                };
            }
        });
    };

    // authenticate customer
    $scope.customer.auth = function( login_email, password ){
        data = {"login" : login_email, "password" : password};

        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/front/customer_auth", data).success(function( response ){
            // callback
            $scope.customer.login_callback(response);
            cb = (catalog.config.actions.loading || function(){})(false);
        });
    };


    // signup customer
    $scope.customer.signup = function( customer_data ){

        if(customer_data.birthday.indexOf("/")){
            date = customer_data.birthday.split("/");
            customer_data.birthday = date[2] + "-" + date[1] + "-" + date[0];
        }

        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/front/customer_signup", customer_data).success(function( response ){
            $scope.customer.signup_callback(response);
            cb = (catalog.config.actions.loading || function(){})(false);
        });
    };

    // go to login action
    $scope.customer.login = function(){ window.location.href = "/login"; };

    $scope.customer.login_callback = function(response){
        if(response.result != false){
            window.location.href = "/";
        }else{
            window.location.href = "/login?error=invalid";
        }
    }

    // start main functions
    $scope.initialize();

});


catalog.ang.controller('shoppingcart', function($scope, $http) {

    $scope.shoppingcart = {'checkout' : {'address' : {}, 'simulation_options' : {'slas' : {}}}};

    $scope.shoppingcart.checkout.finish_buy = function(){
        cb = (catalog.config.actions.loading || function(){})(true);

        data = {
            'shipping_address_id' : $scope.shoppingcart.checkout.address.id,
            'storecondition_id' : 8,
            'hash' : $scope.shoppingcart.checkout.simulation_hash,
            'slas' : $scope.shoppingcart.checkout.simulation_options.slas
        };

        $http.post("/pass/front/finish_buy", data).success(function( response ){

            if( response.result.ordergroup_id ){
                window.location.href = "/account/order/view?new=true&order_id=" + response.result.ordergroup_id;
            }else{
                alert("Erro ao processar pedido");
            }

            cb = (catalog.config.actions.loading || function(){})(false);
        });
    };

    // send ajax request
    $scope.shoppingcart.load = function(){
        // cb = (catalog.config.actions.loading || function(){})(true);

        $scope.shoppingcart.summary = {};
        $scope.shoppingcart.simulation = {};

        $scope.shoppingcart.checkout.simulation_options['shipping'] = {
            "zipcode" : $scope.shoppingcart.checkout.address.zipcode || null
        };

        $http.post("/pass/pricing/simulation", $scope.shoppingcart.checkout.simulation_options).success(function( response ){

            $scope.simulation = response.result;

            $scope.shoppingcart.items = [];
            $scope.shoppingcart.summary = $scope.simulation.summary;
            $scope.shoppingcart.simulation = $scope.simulation;

            for( sku_id in $scope.simulation.skus ){
                item = $scope.simulation.skus[sku_id];
                $scope.shoppingcart.items.push({
                    "offer" : item.offers[item.selected_offer_index],
                    "sku" : item.info,
                    "quantity" : parseInt(item.quantity),
                });
            }

            $scope.shoppingcart.checkout.simulation_hash = $scope.simulation.hash;

            cb = (catalog.config.actions.loading || function(){})(false);
        });
    };

    $scope.shoppingcart.change_sla = function(offer, sla){
        $scope.shoppingcart.checkout.simulation_options['slas'][parseInt(offer.id)] = sla.index;
    };

    $scope.shoppingcart.item_quantity_update = function(selleroffer_id, quantity){
        data =  {"quantity" : quantity, "selleroffer_id" : selleroffer_id};

        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/front/add_to_cart", data).success(function( response ){
            cb = (catalog.config.actions.loading || function(){})(false);
            $scope.shoppingcart.load();
        });
    }

    $scope.$watch('shoppingcart.checkout.simulation_options', function(nvalue){
        if(typeof nvalue != 'undefined'){ $scope.shoppingcart.load(); }
    }, true);

    $scope.$watch('shoppingcart.checkout.address.id', function(nvalue){
        if(typeof nvalue != 'undefined'){
            $scope.shoppingcart.checkout.simulation_options['slas'] = {};
            $scope.shoppingcart.load();
        }
    }, true);

    $scope.$watch('shoppingcart.checkout.payment', function(nvalue){
        if(typeof nvalue != 'undefined'){ $scope.shoppingcart.load(); }
    }, true);

    $scope.shoppingcart.load();

});


catalog.ang.controller('mini_shoppingcart', function($scope, $http) {

    $scope.mini_shoppingcart = {};

    // send ajax request
    $scope.mini_shoppingcart.load = function(){
        $http.post("/pass/pricing/simulation", {}).success(function( response ){

            $scope.simulation = response.result;

            $scope.mini_shoppingcart.items = [];

            for( sku_id in $scope.simulation.skus ){
                item = $scope.simulation.skus[sku_id];
                $scope.mini_shoppingcart.items.push({
                    "offer" : item.offers[item.selected_offer_index],
                    "sku" : item.info,
                    "quantity" : parseInt(item.quantity),
                });
            }
        });
    };

    $scope.mini_shoppingcart.load();

});


catalog.ang.controller('address', function($scope, $http) {

    $scope.customer.address = {};
    $scope.customer.address.new = {};

    // send ajax request
    $scope.customer.address.load = function(){
        $scope.customer.address.list = [];
        $http.post("/pass/front/get_customer_address", {}).success(function( response ){
            $scope.customer.address.list = response.result;
        });
    };

    $scope.customer.address.add_modal = function(){
        $('#addAddress').modal('show');
    };

    $scope.customer.address.add = function(){
        $('#addAddress').modal('hide');
        $http.post("/pass/front/add_customer_address", $scope.customer.address.new).success(function( response ){
            $scope.customer.address.load();
            $scope.customer.address.new = {};
        });
    };

    $scope.customer.address.load();

});


catalog.ang.controller('sku', function($scope, $http) {

    $scope.sku = {'simulation_options' : {}};

    $scope.sku.add_to_wishlist = function(){};

    $scope.sku.offer_simulation = function(selleroffer_id, quantity, zipcode){
        cb = (catalog.config.actions.loading || function(){})(true);

        $scope.sku.summary = {};
        $scope.sku.simulation = {};

        $scope.sku.simulation_options = {
            "skus" : [{"selleroffer_id" : selleroffer_id, "quantity" : quantity || 1}],
            "shipping" : {
                "zipcode" : zipcode
            }
        };

        $http.post("/pass/pricing/simulation", $scope.sku.simulation_options).success(function( response ){

            cb = (catalog.config.actions.loading || function(){})(false);

            $scope.simulation = response.result;

            $scope.sku.summary = $scope.simulation.summary;
            $scope.sku.simulation = $scope.simulation;

            for( sku_id in $scope.simulation.skus ){
                item = $scope.simulation.skus[sku_id];
                $scope.sku.offer = item.offers[item.selected_offer_index];
            }

            $scope.sku.offer.selected_sla = $scope.sku.offer.logistic_info.slas[$scope.sku.offer.logistic_info.best_sla_index];

        });
    };


    // add offer to cart
    $scope.sku.add_to_cart = function( quantity, sla_index, options ){

        options = options || {};

        data =  {"quantity" : quantity || 1, "selleroffer_id" : $scope.selleroffer_id, "sla_index" : sla_index || null};

        // send ajax request
        $http.post("/pass/front/add_to_cart", data).success(function( response ){
            cb = (catalog.config.actions.loading || function(){})(false);
            cb = (catalog.config.callbacks.product_added_to_cart || function(response, options){})(response, options);
        });

    };


    // create sku review
    $scope.sku.create_review = function(){

        review = $scope.sku.new_review || {};

        if(!review.title || !review.comment){
            cb = (catalog.config.callbacks.error || function(error){ alert(error) })("Verifique os campos obrigatórios");
            return false;
        }

        data = {"title" : review.title, "comment" : review.comment, "sku_id" : 1940, "rating" : 1};

        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/front/create_review", data).success(function( response ){
            // callback
            cb = (catalog.config.callbacks.review_added || function(){})();
            cb = (catalog.config.actions.loading || function(){})(false);
        })

    };

});

catalog.ang.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
});
