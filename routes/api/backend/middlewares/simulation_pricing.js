let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let session = {
        id: req.session.id
    };

    if (req.user) session.customer_id = req.user.id;

    let simulation = {};

    if (req.body.skus)
        simulation.skus = req.body.skus;

    if (req.body.coupon)
        simulation.coupon = req.body.coupon;

    if (req.body.zipcode)
        simulation.zipcode = req.body.zipcode
    
    mkplaceapi.simulation_pricing({ session, simulation }).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err);
    })
};
