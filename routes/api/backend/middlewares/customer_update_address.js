let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let address_id = req.body.address_id;
    let customer_obj = {
        address: req.body.address,
        complement: req.body.complement,
        reference: req.body.reference,
        number: req.body.number,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode
    };


    mkplaceapi.customer_update_address(address_id, customer_obj).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return res.status(500).json(err.message);
    });
};
