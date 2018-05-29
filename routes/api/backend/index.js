var express = require('express');
var router = express.Router();

// util
var ensureUser = require('../../../utils/ensureLoggedIn');

//  middlewares
var customer_auth = require('./middlewares/customer_auth');
var customer_signup = require('./middlewares/customer_signup');
var customer_address = require('./middlewares/customer_address');
var customer_add_address = require('./middlewares/customer_add_address');
var customer_update_address = require('./middlewares/customer_update_address');
var customer_recovery_token = require('./middlewares/customer_recovery_token');
var customer_recovery_password = require('./middlewares/customer_recovery_password');
var customer_review = require('./middlewares/customer_review');
var customer_wishlist = require('./middlewares/customer_wishlist');
var customer_update = require('./middlewares/customer_update');
var customer_orders = require('./middlewares/customer_orders');
var customer_refresh = require('./middlewares/customer_refresh');

var search = require('./middlewares/search');
var add_to_cart = require('./middlewares/add_to_cart');
var product = require('./middlewares/product');
var manufacturer = require('./middlewares/manufacturer');
var cartridge = require('./middlewares/cartridge');
var simulation_price = require('./middlewares/simulation_pricing');
var banner = require('./middlewares/banners');
var finish_buy = require('./middlewares/finish_buy');

router.post('/customer/auth', customer_auth);
router.post('/customer/signup', customer_signup);
router.get('/customer/address', ensureUser, customer_address);
router.post('/customer/add/address', ensureUser, customer_add_address);
router.put('/customer/update/address', ensureUser, customer_update_address);
router.post('/customer/retrieve_token_recovery', customer_recovery_token);
router.post('/customer/recovery_password', customer_recovery_password);
router.post('/customer/product/review', ensureUser, customer_review);
router.get('/customer/wishlist', ensureUser, customer_wishlist);
router.post('/customer/update', ensureUser, customer_update);
router.get('/customer/orders', ensureUser, customer_orders)
router.get('/customer/refresh', ensureUser, customer_refresh);

router.get('/customer/loggedin', function (req, res) {
    if (req.user) {
        require('../../../platform').client().customer_refresh(req.user.id).then(function(data) {
            return res.send(data.result);
        })
    } else {
        return res.status(401).json('not authorized');
    }
});

router.get('/customer/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/search', search);
router.get('/product', product);
router.post('/cart', add_to_cart);
router.get('/manufacturer', manufacturer);
router.get('/cartridge', cartridge);
router.post('/simulation_price', simulation_price);
router.get('/banners', banner);
router.post('/finish_buy', finish_buy);

module.exports = router;
