let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {

    let hash_customer = req.body.hash_customer;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let step = req.body.step;

    mkplaceapi.customer_change_password({hash_customer, password, confirm_password, step}).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err);
    });
};
