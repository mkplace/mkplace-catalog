
var test = require('tape');
var cli = require('../index.js');

test('simulation', function (t) {
    cli.simulation_pricing(69, '31006f8c-8589-474e-baa4-88efc60552c5').then(function (data) {
        console.log(data);
        t.true(data.result, 'Result is present');
        t.end();
    });
});