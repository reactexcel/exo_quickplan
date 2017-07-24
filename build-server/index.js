'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _webpack3 = require('../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

var _environment = require('./config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _schema = require('./data/schema');

var _schema2 = _interopRequireDefault(_schema);

var _database = require('./data/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var WebpackDevServer, graphql, authenticate, app, _graphql, _app;

  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _database.connect)();

        case 2:

          // Populate databases with mock up data
          if (_environment2.default.seed) {
            require('./config/seed/' + _environment2.default.env);
          }

          if (_environment2.default.env === 'development') {
            WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line

            // Launch GraphQL

            graphql = (0, _express2.default)();
            authenticate = (0, _expressJwt2.default)({
              secret: new Buffer(_environment2.default.auth.secret, 'base64'),
              audience: _environment2.default.auth.clientId
            });

            if (_environment2.default.auth.requireAuth) {
              graphql.use('/', authenticate, (0, _expressGraphql2.default)({
                graphiql: true,
                pretty: true,
                schema: _schema2.default
              }));
            } else {
              graphql.use('/', (0, _expressGraphql2.default)({
                graphiql: true,
                pretty: true,
                schema: _schema2.default
              }));
            }
            graphql.listen(_environment2.default.graphql.port, function () {
              return console.log('GraphQL is listening on port ' + _environment2.default.graphql.port);
            });

            // Launch Relay by using webpack.config.js
            app = new WebpackDevServer((0, _webpack2.default)(_webpack4.default), {
              contentBase: '/build/',
              proxy: {
                '/graphql': 'http://localhost:' + _environment2.default.graphql.port
              },
              stats: {
                colors: true
              },
              hot: true,
              historyApiFallback: true,
              disableHostCheck: true
            });

            // Serve static resources

            app.use('/assets/docs', _express2.default.static('../../docs/'));
            app.use('/', _express2.default.static(_path2.default.join(__dirname, '../build')));
            app.listen(_environment2.default.port, function () {
              return console.log('Relay is listening on port ' + _environment2.default.port);
            });
          } else if (_environment2.default.env === 'production') {
            _graphql = (0, _express2.default)();

            _graphql.use('/', (0, _expressGraphql2.default)({
              graphiql: true,
              pretty: true,
              schema: _schema2.default
            }));

            _graphql.listen(_environment2.default.graphql.port, function () {
              return console.log('GraphQL is listening on port ' + _environment2.default.graphql.port);
            });

            // Launch Relay by creating a normal express server
            _app = (0, _express2.default)();

            _app.use('/assets/docs', _express2.default.static('../../docs/'));
            _app.use('/', _express2.default.static(_path2.default.join(__dirname, '../build')));
            _app.use('/graphql', (0, _expressHttpProxy2.default)('localhost:8000'));
            _app.listen(_environment2.default.port, function () {
              return console.log('App is listening on port ' + _environment2.default.port);
            });
          }

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();