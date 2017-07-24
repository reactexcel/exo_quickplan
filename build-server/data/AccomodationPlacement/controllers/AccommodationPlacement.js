'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccommodationPlacements = exports.remove = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getAccommodationPlacements = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 OUTBOUND @vertexId \n    GRAPH \'exo-dev\'\n    FILTER \n      IS_SAME_COLLECTION(\'accommodationPlacements\', vertex) AND\n      IS_SAME_COLLECTION(\'bookIn\', edge)\n    RETURN vertex\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context2.sent;
            return _context2.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getAccommodationPlacements(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _database = require('../../database');

var _ServiceBooking = require('../../ServiceBooking/controllers/ServiceBooking');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var accommodationPlacements = graph.vertexCollection('accommodationPlacements');

var remove = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(accommodationPlacementKey) {
    var serviceBookings;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _ServiceBooking.getServiceBookings)('accommodationPlacements/' + accommodationPlacementKey);

          case 2:
            serviceBookings = _context.sent;
            _context.next = 5;
            return _promise2.default.all(serviceBookings.map(function (_ref2) {
              var _key = _ref2._key;
              return (0, _ServiceBooking.remove)(_key);
            }));

          case 5:
            return _context.abrupt('return', accommodationPlacements.remove(accommodationPlacementKey));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function remove(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.remove = remove;
exports.getAccommodationPlacements = getAccommodationPlacements;