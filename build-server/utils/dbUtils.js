'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traversWithoutFilter = exports.traversWithFilter = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var traversWithFilter = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fromLevel, toLevel) {
    var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'OUTBOUND';
    var startVertex = arguments[3];
    var usebfs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var filterCollection = arguments[5];
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            aqlQuery = '\n  FOR vertex IN @fromLevel..@toLevel ' + direction + ' @startVertex GRAPH @graph OPTIONS {bfs: @usebfs}\n    FILTER IS_SAME_COllECTION(@filterCollection, vertex)\n    RETURN vertex';
            _context.next = 3;
            return _database.db.query(aqlQuery, {
              fromLevel: fromLevel,
              toLevel: toLevel,
              startVertex: startVertex,
              graph: _environment2.default.arango.databaseName,
              usebfs: usebfs,
              filterCollection: filterCollection });

          case 3:
            result = _context.sent;
            _context.next = 6;
            return result.all();

          case 6:
            return _context.abrupt('return', _context.sent);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function traversWithFilter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var traversWithoutFilter = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fromLevel, toLevel) {
    var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'OUTBOUND';
    var startVertex = arguments[3];
    var usebfs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n  FOR vertex IN @fromLevel..@toLevel ' + direction + ' @startVertex GRAPH @graph OPTIONS {bfs: @usebfs}\n    RETURN vertex';
            _context2.next = 3;
            return _database.db.query(aqlQuery, {
              fromLevel: fromLevel,
              toLevel: toLevel,
              startVertex: startVertex,
              graph: _environment2.default.arango.databaseName,
              usebfs: usebfs });

          case 3:
            result = _context2.sent;
            _context2.next = 6;
            return result.all();

          case 6:
            return _context2.abrupt('return', _context2.sent);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function traversWithoutFilter(_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var _database = require('../data/database');

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.traversWithFilter = traversWithFilter;
exports.traversWithoutFilter = traversWithoutFilter;