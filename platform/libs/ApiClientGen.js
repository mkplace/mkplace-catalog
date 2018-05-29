'use strict';

var request = require('request'),
    _ = require('underscore'),
    queryString = require('query-string'),
    util = require('util');

request.debug = false;

var publicMethods = {};

var ApiGenerator = function (base_url, token) {
    let _TOKEN = token;
    var BASE_URL = base_url;

    var UrlFactory = function () {
        var methods_allowed = ['GET', 'POST', 'PUT'];
        return {
            _get: function (action, options, method) {
                method = method || 'GET';
                if (!_.contains(methods_allowed, method)) Error('Method not allowed');
                if (Array.isArray(action)) {

                    var VERBS = '/%s'.repeat(action.length);
                    var args = [VERBS];
                    args = args.concat(action);

                    return BASE_URL + util.format.apply(null, args);
                }
            }
        };
    };

    var _register = function (func_name, arrUrl) {
        publicMethods[func_name] = function (params = {}, urlParams = {}) {

            var url = new UrlFactory();

            return {
                post: function (headers = {}) {
                    var o = _.extend({}, params);
                    headers = _.extend({
                        AccessKey: _TOKEN
                    }, headers);

                    var promise = new Promise(function (resolve, reject) {

                        let options = {
                            url: url._get(arrUrl),
                            method: 'POST',
                            body: o,
                            qs: { 'format': 'json' },
                            json: true,
                            headers: headers
                        };

                        request.post(options, function (err, resp, data) {
                            // console.log(err, data, "POST DATA RESPONSE")
                            if (!err) {
                                return resolve(data);
                            } else {
                                return reject(err.message);
                            }
                        });
                    });
                    return promise;
                },
                put: function (headers = {}) {
                    var o = _.extend({}, params);
                    headers = _.extend({
                        AccessKey: _TOKEN
                    }, headers);

                    var promise = new Promise(function (resolve, reject) {
                        let str_url = url._get(arrUrl);
                        let url_params = str_url.match(/(?!:\/\/)(?:[:][a-zA-Z_]+)/g);

                        //  @todo make function to parse str param
                        Object.keys(urlParams).forEach(function (key) {
                            console.log(key, 'aaaaaaaaaaaaaaaaaaaa')
                            let regex_str = new RegExp(`(?:[:]${key})`, 'g');
                            str_url = str_url.replace(regex_str, urlParams[key]);
                        });



                        // str_url += arr_url_params.join('/');
                        console.log(str_url);

                        let options = {
                            url: str_url,
                            method: 'PUT',
                            body: o,
                            qs: { 'format': 'json' },
                            json: true,
                            headers: headers
                        };

                        request.put(options, function (err, resp, data) {
                            // console.log(err, data, "POST DATA RESPONSE")
                            if (!err) {
                                return resolve(data);
                            } else {
                                return reject(err.message);
                            }
                        });
                    });
                    return promise;
                },
                get: function (headers = {}) {
                    headers = _.extend({
                        AccessKey: _TOKEN
                    }, headers);

                    var promise = new Promise(function (resolve, reject) {
                        params['format'] = 'json';
                        let options = {
                            url: url._get(arrUrl),
                            method: 'GET',
                            qs: params,
                            headers: headers
                        };
                        console.log(options, 'OPTIONS')
                        request.get(options, function (err, resp, data) {
                            // console.log(err, data, "GET DATA RESPONSE")
                            if (!err) {
                                if (resp.headers['content-type'].indexOf('application/json') >= 0) {
                                    return resolve(JSON.parse(data));
                                } else {
                                    return resolve(data);
                                }
                            } else {
                                return reject(err.message);
                            }
                        });
                    });
                    return promise;
                },
                delete: function (headers = {}) {
                    var promise = new Promise(function (resolve, reject) {
                        let options = {
                            url: url._get(arrUrl),
                            method: 'DELETE',
                            qs: params,
                            headers: headers
                        };
                        request.delete(options, function (err, resp, data) {
                            // console.log(err, data, "GET DATA RESPONSE")
                            if (!err) {
                                if (resp.headers['content-type'].indexOf('application/json') >= 0) {
                                    return resolve(JSON.parse(data));
                                } else {
                                    return resolve(data);
                                }
                            } else {
                                return reject(err.message);
                            }
                        });
                    });
                    return promise;
                }
            };
        };
    };


    var _getPublicMethods = function () {
        return publicMethods;
    };

    var _createMock = function (method, cb) {
        publicMethods[method] = function () {
            return new Promise(function (resolve) {
                cb = (typeof cb == 'function') ? cb : function () { };
                let mock = cb();
                resolve(mock);
            });
        };
    };


    var ret = {
        register: _register,
        createMock: _createMock,
        getPublic: _getPublicMethods
    };

    return ret;
};

var getError = function (error) {
    if (!error && isNaN(error)) return 'Código não informado';
    var errors = {
    };

    var msgErr = errors[error];
    if (typeof msgErr === 'undefined') {
        msgErr = 'Ocorreu um erro. Favor entrar em contato com os desenvolvedores.';
    }

    return {
        code: error,
        err: msgErr
    };
};

module.exports = exports = ApiGenerator;
