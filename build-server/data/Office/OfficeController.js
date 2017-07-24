'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSupervisor = exports.getOffice = exports.getUsers = exports.getAllOffices = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getAllOffices = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(type) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            aqlQuery = '\n    FOR office IN offices\n    FILTER\n      office.type == @type\n    Sort office.companyName\n    RETURN office\n  ';
            _context.next = 3;
            return _database.db.query(aqlQuery, {
              type: type
            });

          case 3:
            result = _context.sent;
            return _context.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getAllOffices(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getOffice = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(officeKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    FOR office IN offices\n    FILTER\n      office._id == @officeId\n    RETURN office\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery, {
              officeId: 'offices/' + officeKey
            });

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

  return function getOffice(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getUsers = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(officeKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n    IN 1..1 INBOUND @officeId GRAPH \'exo-dev\'\n    FILTER\n        IS_SAME_COLLECTION(\'users\', vertex) AND\n        IS_SAME_COLLECTION(\'worksFor\', edge)\n    RETURN vertex\n  ';
            _context3.next = 3;
            return _database.db.query(aqlQuery, {
              officeId: 'offices/' + officeKey
            });

          case 3:
            result = _context3.sent;
            return _context3.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getUsers(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getSupervisor = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(officeKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            aqlQuery = '\n    FOR user, edge\n      IN 1..1 INBOUND @officeId GRAPH \'exo-dev\'\n      FILTER edge.isSupervisor == true\n      RETURN user\n  ';
            _context4.next = 3;
            return _database.db.query(aqlQuery, {
              officeId: 'offices/' + officeKey
            });

          case 3:
            result = _context4.sent;
            return _context4.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getSupervisor(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getAllOffices = getAllOffices;
exports.getUsers = getUsers;
exports.getOffice = getOffice;
exports.getSupervisor = getSupervisor;