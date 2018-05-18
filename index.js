var http = require('http');
var express = require('express');
var session = require('express-session')
var path = require('path');
var mongoose = require('mongoose');
var platform = require('./platform');
var api_backend = require('./routes/api/backend');
var bodyParser = require('body-parser');
var passport = require('passport');

const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost/session', { useMongoClient: true });

class catalog {

    constructor(config) {
        this.$ = {path: path};
        this.config = config ? typeof config != 'undefined' : {};
        this.app = express();
        this.app.set('view engine', 'pug');
        this.app.use(session({
            store: new MongoStore({ mongooseConnection: mongoose.connection }),
            secret: 'se3cr3t',
            resave: false,
            saveUninitialized: true,
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        require('./strategies');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
    }

    auth(endpoint, token) {
        this.platform = platform.connect(endpoint, token);
    }

    run(port) {
        this.app.use('/api/backend', api_backend);

        this.app.get('/store/cart', function (req, res, next) {
            res.render('checkout');
        });

        this.app.get('/store/checkout', function (req, res, next) {
            res.render('checkout');
        });

        this.app.get('/*', function (req, res, next) {
            res.render('index');
        });

        this.server = http.createServer(this.app);

        return this.server.listen(port);
    }

}

module.exports = {catalog: catalog};
