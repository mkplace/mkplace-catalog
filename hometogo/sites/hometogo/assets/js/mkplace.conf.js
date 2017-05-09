catalog.config = {
    callbacks : {

        product_added_to_cart : function(){
            toastr.success('Produto adicionado no carrinho com sucesso!');
            $('html, body').animate({'scrollTop':'0px'});
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
                $('body').prepend("<div id=main-loader style='background: rgba(255,255,255,0.8) center center no-repeat; z-index: 19999; width:100%; height:200%; position:absolute;'><h3 style='margin-top:300px;' class='text-muted text-center'>Carregando...</h3></div>");
            }else{
                $('#main-loader').fadeOut('fast');
            }
        }
    }
};


catalog.ang.controller('custom', function($scope, $http) {

    $scope.forms = {};

    $scope.customer.login = function(){
        $('#loginRequestModal').modal('show');
        $scope.customer.login_callback = function( response ){
            if(response.result != false){
                location.reload();
            }else{
                toastr.error('Usuario ou senha incorretos!');
            }
        };
    };



});
