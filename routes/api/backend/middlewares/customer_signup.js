let mkplaceapi = require('../../../../platform').client();
let moment = require('moment');

module.exports = function (req, res, next) {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let birthday = req.body.birthday;
    let telephone = req.body.telephone.number;
    let state_telephone = req.body.telephone.state_code;

    let cellphone = req.body.cellphone.number;
    let state_cellphone = req.body.cellphone.state_code;
    let mail = req.body.email;
    let cpf = req.body.document.cpf;

    let password = req.body.password;
    let password2 = req.body.password_confirm;

    if (password !== password2) return next(new Error('Senhas invalidas'));

    console.log(birthday);
    let customer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        telephone: {
            number: telephone,
            state_code: state_telephone
        },
        cellphone: {
            number: cellphone,
            state_code: state_cellphone
        },
        email: mail,
        document: req.body.document,
        password: password,
        password_confirm: password2
    }

    mkplaceapi.customer_signup(customer).then(function (data) {
        res.json(data.result);
    }).catch(function (err) {
        console.log(err);
        return next(err);
    });
};
