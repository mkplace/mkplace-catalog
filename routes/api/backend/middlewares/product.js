let mkplaceapi = require('../../../../platform').client();
module.exports = function (req, res, next) {
    let product = (req.query.product) ? req.query.product : false;
    let sku = (req.query.sku) ? req.query.sku : false;
    mkplaceapi.product(product, sku).then(function (data) {
        res.json(data.result);
    });
};
