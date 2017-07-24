'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSupplierByTransferId = exports.getAccessibleTransfers = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getSupplierByTransferId = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(transferId) {
    var supplierCollection, supplyEdgeCollection, transferEdge;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            supplierCollection = _database.db.collection('suppliers');
            supplyEdgeCollection = _database.db.edgeCollection('supply');
            _context.next = 5;
            return supplyEdgeCollection.firstExample({ _to: transferId });

          case 5:
            transferEdge = _context.sent;
            _context.next = 8;
            return supplierCollection.firstExample({ _id: transferEdge._from });

          case 8:
            return _context.abrupt('return', _context.sent);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0.stack);
            return _context.abrupt('return', null);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function getSupplierByTransferId(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAccessibleTransfers(args) {
  return (0, _request2.default)(_environment2.default.foxx.url + '/accessibletransfers', _request.POST, args);
} /* eslint-disable no-console */
exports.getAccessibleTransfers = getAccessibleTransfers;
exports.getSupplierByTransferId = getSupplierByTransferId;