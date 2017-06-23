catalog.config = {
    callbacks : {

        product_added_to_cart : function(response, options){
            toastr.success('Produto adicionado no carrinho com sucesso!');
            if(options.redirect_to){ window.location.href = options.redirect_to; }
        },

        review_added : function(){
            toastr.success('Comentário recebido com sucesso!');
            $('html, body').animate({'scrollTop':'0px'});
        },

        // defaults
        error : function(error){ toastr.error(error); }

    },

    actions : {
        loading : function(show){
            if(show){
                $('body').prepend("<div id=main-loader style='background: rgba(255,255,255,0.1) center center no-repeat; z-index: 19999; width:100%; height:100%; position:absolute;'><h3 style='margin-top:300px;' class='text-muted text-center'>Carregando...</h3></div>");
            }else{
                $('#main-loader').hide();
            }
        }
    }
};


catalog.ang.controller('custom', function($scope, $http) {

    $scope.forms = {};

    $scope.customer.login_callback = function( response ){
        if(response.result != false){
            window.location.href = $scope.customer.login_redirect || "/";
        }else{
            toastr.error('Usuario ou senha incorretos!');
        }
    };

});
