'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutateTree = exports.getTree = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getTree = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/get-trip-country-city-tree', _request.POST, args);

          case 2:
            result = _context.sent;
            return _context.abrupt('return', result);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getTree(_x) {
    return _ref.apply(this, arguments);
  };
}();

var mutateTree = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(args) {
    var _args, result;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _args = { tree: JSON.parse(args.Tree), tripKey: args.tripKey, clientMutationId: args.clientMutationId };
            _context2.next = 3;
            return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/trips/mutate-trip-country-city-tree', _request.POST, _args);

          case 3:
            result = _context2.sent;
            return _context2.abrupt('return', result);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function mutateTree(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getTree = getTree;
exports.mutateTree = mutateTree;