let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let customer_id = req.session.customer.id;
    
    mkplaceapi.customer_address(customer_id).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err.message);
    });
};
