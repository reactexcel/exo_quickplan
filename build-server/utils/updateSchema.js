'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var updateSchema = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var json;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _graphql.graphql)(_schema2.default, _utilities.introspectionQuery);

          case 3:
            json = _context.sent;

            _fs2.default.writeFileSync(jsonFile, (0, _stringify2.default)(json, null, 2));
            _fs2.default.writeFileSync(graphQLFile, (0, _utilities.printSchema)(_schema2.default));
            console.log('Schema has been regenerated');
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function updateSchema() {
    return _ref.apply(this, arguments);
  };
}();

// Run the function directly, if it's called from the command line


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var _utilities = require('graphql/utilities');

var _schema = require('../data/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonFile = _path2.default.join(__dirname, '../data/schema.json'); /* eslint-disable no-console */

var graphQLFile = _path2.default.join(__dirname, '../data/schema.graphql');

if (!module.parent) updateSchema();

exports.default = updateSchema;