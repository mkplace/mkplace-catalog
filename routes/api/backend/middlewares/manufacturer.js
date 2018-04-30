let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    mkplaceapi.manufacturer().then(function(data) {
        res.json(data.result);
    });
};
