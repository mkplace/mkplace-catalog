let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    mkplaceapi.customer_retrieve_recovery_token({email: req.body.email}).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err);
    });
};
