let libGenerator;

let PublicMethods = (endpoint, token) => {
    libGenerator = new require('./libs/ApiClientGen.js')(endpoint, token);
    libGenerator.register('Product', ['api', 'front', 'product_detail']);
    libGenerator.register('Search', ['api', 'front', 'search']);
    libGenerator.register('Order', ['api', 'front', 'order']);
    libGenerator.register('CartUpdate', ['api', 'front', 'add_to_cart']);
    libGenerator.register('Manufacturer', ['api', 'front', 'manufacturer_list']);
    libGenerator.register('Cartridge', ['api', 'front', 'cartridge']);
    libGenerator.register('Banner', ['api', 'front', 'banner']);
    libGenerator.register('Customer', ['api', 'front', 'get_customer']);
    libGenerator.register('CustomerRefresh', ['api', 'front', 'get_customer_v2']);
    libGenerator.register('CustomerSignup', ['api', 'front', 'customer_signup']);
    libGenerator.register('CustomerAuth', ['api', 'front', 'customer_auth']);
    libGenerator.register('CustomerGetAddress', ['api', 'front', 'get_customer_address']);
    libGenerator.register('CustomerAddAddress', ['api', 'front', 'add_customer_address']);
    libGenerator.register('CustomerUpdateAddress', ['api', 'v2', 'customeraddress', ':id', ['']]);
    libGenerator.register('ReviewCreate', ['api', 'front', 'create_review']);
    libGenerator.register('CustomerRetrieveRecoveryToken', ['api', 'front', 'create_customerrecovery']);
    libGenerator.register('CustomerRecoveryPassword', ['api', 'front', 'hash_verification_recovery']);
    libGenerator.register('Wishlist', ['api', 'front', 'wishlists']);
    libGenerator.register('WishlistGet', ['api', 'front', 'get_wishlist']);
    libGenerator.register('WishlistAdd', ['api', 'front', 'add_wishlist']);
    libGenerator.register('CustomerUpdate', ['api', 'front', 'update_customer']);
    libGenerator.register('Simulation', ['api', 'pricing', 'simulation']);
    libGenerator.register('FinishBuy', ['api', 'front', 'finish_buy']);
    libGenerator.register('ShoppingCart', ['api', 'v2', 'shoppingcart']);
    libGenerator.register('CustomerOrders', ['api', 'orders'])
    
    var publicMethods = libGenerator.getPublic();
    return publicMethods;
};

module.exports = (endpoint, token) => {
    
    let publicMethods = PublicMethods(endpoint, token);
    
    return {
        'product': publicMethods.Product,
        'search': publicMethods.Search,
        'cartupdate': publicMethods.CartUpdate,
        'manufacturer': publicMethods.Manufacturer,
        'cartridge': publicMethods.Cartridge,
        'banner': publicMethods.Banner,
        'customer': publicMethods.Customer,
        'customersignup': publicMethods.CustomerSignup,
        'customerauth': publicMethods.CustomerAuth,
        'customergetaddress': publicMethods.CustomerGetAddress,
        'customeraddaddress': publicMethods.CustomerAddAddress,
        'customerupdateaddress': publicMethods.CustomerUpdateAddress,
        'customerorders': publicMethods.CustomerOrders,
        'customerRefresh': publicMethods.CustomerRefresh,
        'reviewcreate': publicMethods.ReviewCreate,
        'customer_retrieve_recovery_token': publicMethods.CustomerRetrieveRecoveryToken,
        'customer_recovery_password': publicMethods.CustomerRecoveryPassword,
        'wishlist': publicMethods.Wishlist,
        'wishlist_get': publicMethods.WishlistGet,
        'wishlist_add': publicMethods.WishlistAdd,
        'customer_update': publicMethods.CustomerUpdate,
        'simulation_values': publicMethods.Simulation,
        'shoppingcart': publicMethods.ShoppingCart,
        'finish_buy': publicMethods.FinishBuy
    };
}
