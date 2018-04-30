let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let customer_id = req.user.id;
    let rating = {
        sku_id: req.body.sku_id,
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment
    }
    mkplaceapi.customer_review_create(customer_id, rating).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err);
    });
};
