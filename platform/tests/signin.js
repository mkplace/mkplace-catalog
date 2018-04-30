
var test = require('tape');
var cli = require('../index.js');

test('signin', function (t) {
    cli.customer_auth('bagcnop@gmail.com', '123456').then(function (data) {
        console.log(data.result);
        t.true(data.result.constructor == Object, 'Result is object');
        t.end();
    });
});