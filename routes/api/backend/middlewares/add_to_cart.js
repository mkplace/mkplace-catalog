let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let customer_id = (req.user) ? req.user.id : false;
    let quantity = (req.body.quantity) ? (req.body.quantity) : 1;
    let seller_offer_id = (req.body.seller_offer) ? (req.body.seller_offer) : false;
    let params = { session_id: req.session.id };

    if (customer_id) params.customer_id = customer_id;

    mkplaceapi.cart_update(quantity, seller_offer_id, params).then(function (data) {
        return res.json(data);
    }).catch(function(err) {
        return next(err);
    });
};
