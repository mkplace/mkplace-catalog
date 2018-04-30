let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let email = (req.body.email) ? req.body.email : false;
    let password = (req.body.password) ? req.body.password : false;
    let password_confirm = (req.body.password_confirm) ? req.body.password_confirm : false;
    let phone = (req.body.telephone) ? req.body.telephone : [];
    let phone_id = (req.body.telephone_id) ? req.body.telephone_id : [];
    let customer = {};

    if (email) {
        customer.email = email;
    }
    if (password) {
        if (password !== password_confirm) return res.status(500).json({ error: 'A senha não confere!' });
        customer.password = req.body.password;
    }
    if (phone) {
        customer.phones = []
        customer.phones.push({
            "id": phone_id,
            "number": phone,
            "state_code": "11"
        })
    }
    mkplaceapi.customer_update(req.user.id, customer).then(function (data) {
        res.json(data.result);
    }).catch(function (err) {
        return next(err);
    })
};
