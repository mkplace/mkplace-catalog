catalog = {};

catalog.ang = angular.module('catalog', []).config(function( $interpolateProvider ){ $interpolateProvider.startSymbol('[[').endSymbol(']]'); });

catalog.ang.controller('main', function($scope, $http) {

    $scope.customer = {};

    $scope.initialize = function(){
        $scope.customer.get_info();
    };

    $scope.customer.get_info = function(){
        $http.post("/pass/front/get_customer", {}).success(function( response ){
            if(response.result.info){
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

    $scope.shoppingcart = {};

    // send ajax request
    $scope.shoppingcart.load = function(){
        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/pricing/simulation", {}).success(function( response ){

            $scope.simulation = response.result;

            $scope.shoppingcart.items = [];

            for( sku_id in $scope.simulation.skus ){
                item = $scope.simulation.skus[sku_id];
                $scope.shoppingcart.items.push({
                    "offer" : item.offers[item.best_offer_index],
                    "sku" : item.info,
                    "quantity" : parseInt(item.quantity),
                    "sla" : {}
                });
            }

            cb = (catalog.config.actions.loading || function(){})(false);
        });
    };

    $scope.shoppingcart.item_quantity_update = function(selleroffer_id, quantity){
        data =  {"quantity" : quantity, "selleroffer_id" : selleroffer_id};

        cb = (catalog.config.actions.loading || function(){})(true);
        $http.post("/pass/front/add_to_cart", data).success(function( response ){
            cb = (catalog.config.actions.loading || function(){})(false);
            $scope.shoppingcart.load();
        });
    }

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
                    "offer" : item.offers[item.best_offer_index],
                    "sku" : item.info,
                    "quantity" : parseInt(item.quantity),
                });
            }
        });
    };

    $scope.mini_shoppingcart.load();

});


catalog.ang.controller('sku', function($scope, $http) {

    $scope.sku = {};


    $scope.sku.shipping_simulation = {
        'best_sla' : {
            'price' : 10,
            'time' : 4
        }
    };


    // add offer to cart
    $scope.sku.add_to_cart = function( quantity, options ){

        options = options || {};

        data =  {"quantity" : quantity || 1, "selleroffer_id" : $scope.selleroffer_id};

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
