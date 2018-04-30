let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    mkplaceapi.banner(req.query.slot).then(function (data) {
        res.json(data.result);
    });
};
