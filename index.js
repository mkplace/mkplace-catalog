var http = require('http');
var express = require('express');
var path = require('path');
var platform = require('./platform');
var api_backend = require('./routes/api/backend');

class catalog {

    constructor(config) {
        this.$ = {path: path};
        this.config = config ? typeof config != 'undefined' : {};
        this.app = express();
        this.app.set('view engine', 'pug');
    }

    auth(endpoint, token) {
        this.platform = platform.connect(endpoint, token);
    }

    run(port) {
        // platform api
        this.app.use('/api/backend', api_backend);

        this.app.get('/*', function (req, res, next) {
            res.render('index');
        });

        this.server = http.createServer(this.app);

        return this.server.listen(port);
    }

}

module.exports = {catalog: catalog};
