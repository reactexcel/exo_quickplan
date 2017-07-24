'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserByEmail = exports.getSupervisingTCs = exports.getUser = exports.getProposals = exports.getOffice = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getOffice = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(userKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            aqlQuery = '\n    FOR office\n        IN 1..1 OUTBOUND @userId GRAPH \'exo-dev\'\n        FILTER\n            IS_SAME_COLLECTION(\'offices\', office)\n        RETURN office\n  ';
            _context.next = 3;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
            });

          case 3:
            result = _context.sent;
            return _context.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getOffice(_x) {
    return _ref4.apply(this, arguments);
  };
}();

var getSuperAdminProposals = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            aqlQuery = '\n    FOR proposal IN proposals\n      RETURN proposal\n  ';
            _context2.next = 3;
            return _database.db.query(aqlQuery);

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

  return function getSuperAdminProposals() {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * 1) Find countryId by userId
 *    The only possible path:
 *      worksFor (isSupervisor: true)
 *      -> office (type: 'EXO')
 *      optional [
 *      -> locatedIn
 *      -> location (type: 'city')
 *      ]
 *      -> locatedIn
 *      -> location ('type: 'country')
 * 2) Having countryId find all proposals
 *  a) Find all proposals located in the found country
 *    or any city of the found country.
 *  b) Find all proposals assigned to the TCs and TAUs
 *    from the offices of the found country or country cities
 *  c) Find all proposals created by the user
 *    which might not belong to the found country
 * 3) Union all found in step 2 proposals
 *    and return distinct ones
 * @param {string} userKey
 * @returns {Promise.<object[], Error>}
 */


var getCountrySupervisorProposals = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(userKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            aqlQuery = '\n    FOR v, e, p\n      IN 2..3 OUTBOUND @userId GRAPH \'exo-dev\'\n      FILTER\n          p.edges[0].isSupervisor == true AND\n          p.vertices[1].type == \'EXO\' AND\n          p.vertices[2].type == \'city\' AND\n          v.type == \'country\' AND\n          IS_SAME_COLLECTION(\'locations\', v)\n      LET countryId =  v._id\n\n      LET countryProposals = (\n          FOR proposal IN\n              1..2 INBOUND countryId GRAPH \'exo-dev\'\n              FILTER\n                  IS_SAME_COLLECTION (\'proposals\', proposal)\n              RETURN proposal\n      )\n\n      LET countryUserProposals = (\n          FOR proposal IN\n              3..4 INBOUND countryId GRAPH \'exo-dev\'\n              FILTER\n                  IS_SAME_COLLECTION(\'proposals\', proposal)\n              RETURN proposal\n      )\n\n      LET userCreatedProposals = (\n          FOR proposal, edge IN\n              1..1 INBOUND @userId GRAPH \'exo-dev\'\n              FILTER\n                  IS_SAME_COLLECTION(\'proposals\', proposal) AND\n                  edge.created == true\n              RETURN proposal\n      )\n\n      RETURN UNION_DISTINCT(\n          countryProposals,\n          countryUserProposals,\n          userCreatedProposals\n      )\n  ';
            _context3.next = 3;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
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

  return function getCountrySupervisorProposals(_x2) {
    return _ref6.apply(this, arguments);
  };
}();

var getOfficeSupervisorProposals = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(userKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            aqlQuery = '\n    LET officeId = FIRST(\n        FOR v, e, p\n        IN 0..1 OUTBOUND @userId GRAPH \'exo-dev\'\n        FILTER\n            p.edges[0].isSupervisor == true AND\n            IS_SAME_COLLECTION(\'offices\', v)\n        RETURN v._id\n    )\n\n    LET officeProposals = (\n        FOR proposal, edge, p\n        IN 2..2 INBOUND officeId GRAPH \'exo-dev\'\n        FILTER\n            IS_SAME_COLLECTION(\'users\', p.vertices[1]) AND\n            p.vertices[1].role == "TA" AND\n            IS_SAME_COLLECTION(\'proposals\', proposal)\n        RETURN proposal\n    )\n\n    LET userCreatedProposals = (\n        FOR proposal, edge\n        IN 1..1 INBOUND @userId GRAPH \'exo-dev\'\n        FILTER\n            IS_SAME_COLLECTION(\'proposals\', proposal) AND\n            edge.created == true\n        RETURN proposal\n    )\n\n    RETURN UNION_DISTINCT(officeProposals, userCreatedProposals)\n  ';
            _context4.next = 3;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
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

  return function getOfficeSupervisorProposals(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

var getProposals = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref9) {
    var userKey = _ref9.userKey,
        role = _ref9.role,
        isSupervisor = _ref9.isSupervisor;
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!isSuperAdmin({ role: role })) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return', getSuperAdminProposals());

          case 2:
            if (!isCountrySupervisor({ role: role, isSupervisor: isSupervisor })) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt('return', getCountrySupervisorProposals(userKey));

          case 4:
            if (!isOfficeSupervisor({ role: role, isSupervisor: isSupervisor })) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt('return', getOfficeSupervisorProposals(userKey));

          case 6:
            aqlQuery = '\n    FOR vertex, edge\n      IN 1..1 INBOUND @userId GRAPH \'exo-dev\'\n      FILTER IS_SAME_COLLECTION(\'proposals\', vertex)\n      RETURN distinct vertex\n  ';
            _context5.next = 9;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
            });

          case 9:
            result = _context5.sent;
            return _context5.abrupt('return', result.all());

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getProposals(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

var getUserByKey = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(userKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            aqlQuery = '\n    FOR user IN users\n      FILTER user._id == @userId\n\n      LET isSupervisor = ( (\n          FOR edge IN worksFor\n              FILTER edge._from == @userId\n              RETURN edge.isSupervisor\n      ) ANY == true )\n\n      RETURN MERGE (user, { isSupervisor })\n  ';
            _context6.next = 3;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
            });

          case 3:
            result = _context6.sent;
            return _context6.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getUserByKey(_x5) {
    return _ref10.apply(this, arguments);
  };
}();

var getUserByEmail = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(userEmail) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            aqlQuery = '\n     FOR user IN users\n        FILTER user.email == @userEmail\n\n        LET isSupervisor = ( (\n            FOR edge IN worksFor\n                FILTER edge._from == user._id\n                RETURN edge.isSupervisor\n        ) ANY == true )\n\n        RETURN MERGE (user, { isSupervisor })\n  ';
            _context7.next = 3;
            return _database.db.query(aqlQuery, { userEmail: userEmail });

          case 3:
            result = _context7.sent;
            return _context7.abrupt('return', result.next());

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getUserByEmail(_x6) {
    return _ref11.apply(this, arguments);
  };
}();

var getAllTCs = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            aqlQuery = '\n    FOR user IN users\n    FILTER\n        user.role == \'TC\' OR\n        user.role == \'superadmin\'\n    RETURN user\n  ';
            _context8.next = 3;
            return _database.db.query(aqlQuery);

          case 3:
            result = _context8.sent;
            return _context8.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function getAllTCs() {
    return _ref13.apply(this, arguments);
  };
}();

var getSameOfficeTCs = function () {
  var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(userKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            aqlQuery = '\n    LET officeId = FIRST(\n        FOR vertex, edge\n        IN 1..1 OUTBOUND @userId GRAPH \'exo-dev\'\n        FILTER\n            IS_SAME_COLLECTION(\'offices\', vertex) AND\n            edge.isSupervisor == true AND\n            vertex.type == \'EXO\'\n        RETURN vertex._id\n    )\n\n    FOR vertex\n    IN 1..1 INBOUND officeId GRAPH \'exo-dev\'\n    RETURN vertex\n  ';
            _context9.next = 3;
            return _database.db.query(aqlQuery, {
              userId: 'users/' + userKey
            });

          case 3:
            result = _context9.sent;
            return _context9.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function getSameOfficeTCs(_x7) {
    return _ref14.apply(this, arguments);
  };
}();

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSuperAdmin = function isSuperAdmin(_ref) {
  var role = _ref.role;
  return role === 'superadmin';
};

var isCountrySupervisor = function isCountrySupervisor(_ref2) {
  var role = _ref2.role,
      isSupervisor = _ref2.isSupervisor;
  return role === 'TC' && isSupervisor;
};

var isOfficeSupervisor = function isOfficeSupervisor(_ref3) {
  var role = _ref3.role,
      isSupervisor = _ref3.isSupervisor;
  return role === 'TA' && isSupervisor;
};

function getUser(_ref12) {
  var userKey = _ref12.userKey,
      userEmail = _ref12.userEmail;

  if (userKey) {
    return getUserByKey(userKey);
  } else if (userEmail) {
    return getUserByEmail(userEmail);
  }

  return _promise2.default.resolve({});
}

function getSupervisingTCs(_ref15) {
  var userKey = _ref15._key,
      role = _ref15.role,
      isSupervisor = _ref15.isSupervisor;

  if (isSuperAdmin({ role: role })) {
    return getAllTCs();
  }

  if (isCountrySupervisor({ role: role, isSupervisor: isSupervisor })) {
    return getSameOfficeTCs(userKey);
  }

  return null;
}

exports.getOffice = getOffice;
exports.getProposals = getProposals;
exports.getUser = getUser;
exports.getSupervisingTCs = getSupervisingTCs;
exports.getUserByEmail = getUserByEmail;