'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8530,
  graphql: {
    port: 8000
  }
};

exports.default = _lodash2.default.extend(config, require('./' + config.env).default);