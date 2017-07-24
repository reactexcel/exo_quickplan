'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSupervisor = exports.getAllLocations = exports.getLocation = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getLocation = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_key) {
    var cursor, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (_key) {
              _context.next = 11;
              break;
            }

            _context.next = 4;
            return collection.all();

          case 4:
            cursor = _context.sent;
            result = cursor._result;

            if (!cursor.hasNext()) {
              _context.next = 10;
              break;
            }

            _context.next = 9;
            return cursor.all();

          case 9:
            result = _context.sent;

          case 10:
            return _context.abrupt('return', result);

          case 11:
            _context.next = 13;
            return collection.firstExample({ _key: _key });

          case 13:
            return _context.abrupt('return', _context.sent);

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);
            return _context.abrupt('return', null);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 16]]);
  }));

  return function getLocation(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getAllLocations = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    RETURN UNIQUE(\n        FOR location IN locations\n              FOR vertex, edge, path  \n              IN 0..1 OUTBOUND location._id\n              GRAPH \'exo-dev\'\n              FILTER \n                  NOT IS_NULL(vertex) AND\n                  IS_SAME_COLLECTION(\'locations\', vertex) AND\n                  ((\n                    LENGTH (path.vertices) == 2 AND \n                    path.vertices[1].type == \'country\'\n                  ) OR (\n                     LENGTH (path.vertices) == 1 AND \n                    path.vertices[0].type == \'country\'\n                  ))\n              RETURN path.vertices\n    )\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery);

          case 3:
            result = _context2.sent;
            return _context2.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getAllLocations() {
    return _ref2.apply(this, arguments);
  };
}();

var getSupervisor = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(locationKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            aqlQuery = '\n      FOR user, edge\n      IN 2..3 INBOUND @locationId GRAPH \'exo-dev\'\n      FILTER edge.isSupervisor == true\n      RETURN user\n  ';
            _context3.next = 3;
            return _database.db.query(aqlQuery, {
              locationId: 'locations/' + locationKey
            });

          case 3:
            result = _context3.sent;
            return _context3.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getSupervisor(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _database = require('../../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collection = _database.db.edgeCollection('locations');

exports.getLocation = getLocation;
exports.getAllLocations = getAllLocations;
exports.getSupervisor = getSupervisor;