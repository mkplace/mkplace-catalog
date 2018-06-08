let mkplaceapi = require('../../../../platform').client();
module.exports = function (req, res, next) {
    let hash = req.body.hash;

    let shipping_address_id = req.body.shipping_address_id || null;
    let storecondition_id = req.body.storecondition_id || null;
    let customer_id = req.user ? req.user.id : null

    let payment = req.body.payment || false;
    let client_data = req.body.client_data || null;

    mkplaceapi.finish_buy(hash, shipping_address_id, storecondition_id, customer_id, payment, client_data).then(function(data) {
        return res.json(data);
    }).catch(function(err) {
        return res.json
    });
};
