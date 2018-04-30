let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let customer_id = req.session.customer.id;
    let sku_id = req.sku;
    mkplaceapi.customer_add_wishlist(customer_id, sku_id).then(function (data) {
        res.json(data.result);
    }).catch(function (err) {
        return next(err);
    });
};
