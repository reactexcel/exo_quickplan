'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTrip = exports.addTrip = exports.getTrips = exports.getTrip = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getTrips = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var cursor;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return trips.all();

          case 2:
            cursor = _context.sent;
            return _context.abrupt('return', cursor.all());

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getTrips() {
    return _ref.apply(this, arguments);
  };
}();

var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trips = _database.db.collection('trips');

function getTrip(doc) {
  return trips.firstExample(doc);
}

function addTrip(doc) {
  return trips.save(doc);
}

function updateTrip(_key, doc) {
  return trips.update(_key, doc);
}

exports.getTrip = getTrip;
exports.getTrips = getTrips;
exports.addTrip = addTrip;
exports.updateTrip = updateTrip;