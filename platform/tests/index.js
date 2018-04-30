var test = require('tape');
var cli = require('../index.js');

test('search', function (t) {
    cli.search('tenis', 1, {
        attributes: { Cor: 'marrom_escuro_e_marrom' }
    }).then(function (data) {
        t.true(data.result[0].length > 0, 'results');
        t.end();
    });

});

test('cartupdate', function (t) {
    cli.cart_update(1, 165, {
        session_id: '31006f8c-8589-474e-baa4-88efc60552c5'
    }).then(function (data) {
        t.true(data.result.constructor == Object, 'Result is object');
        t.end();
    });
});

test('product', function (t) {
    cli.product(812).then(function (data) {
        t.true(data.result.constructor == Object, 'Result is object');
        t.end();
    });
});

test('manufacturer', function (t) {
    cli.manufacturer().then(function (data) {
        t.true(data.result.constructor == Array, 'Result is Array');
        t.end();
    });
});

test('signup_success', function (t) {

    cli.customer_signup({
        first_name: 'Bruno',
        last_name: 'Casado',
        birthday: '1990-04-28',
        telephone: {
            number: '992590656',
            state_code: '11'
        },
        cellphone: {
            number: '992590656',
            state_code: '11'
        },
        email: 'bagcnop@gmail.com',
        document: {
            cpf: '39873608877'
        },
        password: '12345',
        password_confirm: '12345'
    }).then(function (data) {
        console.log(data);
        t.true(data.result.constructor == Object, 'Result is object');
        t.end();
    });
});

test('signin', function (t) {
    cli.customer_auth('bagcnop@gmail.com', '123456').then(function (data) {
        t.true(data.result.constructor == Object, 'Result is object');
        t.end();
    });
});

test('get_customer_address', function (t) {
    cli.customer_address(69).then(function (data) {
        console.log(data);
        t.true(data.result.constructor == Array, 'Result is array');
        t.end();
    });
});

test('add_customer_address', function (t) {
    let customer = {
        address: 'Rua 1234',
        complement: 'compl',
        reference: '123',
        number: '12',
        neighborhood: 'Vl Bairro',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '04313000',
    }
    cli.customer_add_address(69, customer).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('add_customer_review', function (t) {
    let params = {
        sku_id: 2376,
        rating: 4,
        title: 'um produto legalzaozao',
        comment: 'testando um comentario maroto vindo de uma lib linda'
    };

    cli.customer_review_create(69, params).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('retrieve_recovery_token', function (t) {

    let email = 'bagcnop@gmail.com';

    cli.customer_retrieve_recovery_token(email).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('change_password', function (t) {
    cli.customer_change_password('FZUNSRSAXTZUJGYPSDLTCOBGCHKVUR', '123456', '123456').then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('add_wishlist', function (t) {
    cli.customer_add_wishlist(69, 23).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('wishlist', function (t) {
    cli.customer_wishlist(69).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('customer_update', function (t) {
    cli.customer_update(69, {
        phones: [
            { id: 167, number: '992590655', state_code: '11' }
        ]
    }).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});


test('customer', function (t) {
    cli.customer(69).then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});

test('simulation', function (t) {
    cli.simulation_pricing(69, '31006f8c-8589-474e-baa4-88efc60552c5').then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});