let mkplaceapi = require('../../../../platform').client();

module.exports = function (req, res, next) {
    let token = req.post.token;
    let password = req.password;
    let password_confirm = req.password_confirm;

    mkplaceapi.customer_change_password(token, password, password_confirm).then(function (data) {
        return res.json(data.result);
    }).catch(function (err) {
        return next(err);
    });
};
