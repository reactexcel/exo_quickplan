'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('auth0');

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _auth.AuthenticationClient(_environment2.default.auth);