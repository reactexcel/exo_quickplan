'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PATCH = exports.DELETE = exports.PUT = exports.POST = exports.GET = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// require('superagent-proxy')(superagent);

// npm start -- --proxy

// Proxy ip
// const ENABLE_PROXY = _.includes(process.argv, '--proxy') || false;
// const proxy = 'http://localhost:8080';

// HTTP Methods
var GET = exports.GET = 'get';
var POST = exports.POST = 'post';
var PUT = exports.PUT = 'put';
var DELETE = exports.DELETE = 'del';
var PATCH = exports.PATCH = 'patch';

exports.default = function (url, method, data) {
  var initConnection = _superagent2.default[method](url);
  // if (ENABLE_PROXY) {
  //   initConnection.proxy(proxy);
  // }

  return new _promise2.default(function (resolve, reject) {
    initConnection.send(data).set('Accept', 'application/json').end(function (err, res) {
      if (err || !res.ok || !res.body) return reject(err);
      return resolve(res.body);
    });
  });
};