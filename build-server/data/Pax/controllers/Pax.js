'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaxs = exports.remove = exports.getProposalPaxs = exports.updateProposalMainPax = exports.deletePax = exports.updatePax = exports.addPax = exports.getPaxsByRoomConfigKey = exports.getPaxsByServiceBookingKey = exports.getPaxsByProposalKeyTripKey = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var addPax = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(args) {
    var proposalKey, firstName, lastName, gender, dateOfBirth, ageOnArrival, ageGroup, language, passportNr, nationality, passportExpiresOn, diet, allergies, isMainPax, handle, saveDoc, proposalPaxs, proposalBookInTripsEdges, tripsParticipatePaxsEdges;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            proposalKey = args.proposalKey, firstName = args.firstName, lastName = args.lastName, gender = args.gender, dateOfBirth = args.dateOfBirth, ageOnArrival = args.ageOnArrival, ageGroup = args.ageGroup, language = args.language, passportNr = args.passportNr, nationality = args.nationality, passportExpiresOn = args.passportExpiresOn, diet = args.diet, allergies = args.allergies;
            isMainPax = args.isMainPax || false;
            _context.next = 5;
            return paxsCollection.save({
              firstName: firstName,
              lastName: lastName,
              gender: gender,
              dateOfBirth: dateOfBirth,
              ageOnArrival: ageOnArrival,
              ageGroup: ageGroup,
              language: language,
              passportNr: passportNr,
              nationality: nationality,
              passportExpiresOn: passportExpiresOn,
              diet: diet,
              allergies: allergies
            });

          case 5:
            handle = _context.sent;
            _context.next = 8;
            return paxsCollection.document(handle);

          case 8:
            saveDoc = _context.sent;

            if (!proposalKey) {
              _context.next = 22;
              break;
            }

            _context.next = 12;
            return getProposalPaxs(proposalKey);

          case 12:
            proposalPaxs = _context.sent;

            if (!proposalPaxs || !proposalPaxs.length) {
              isMainPax = true;
            }
            _context.next = 16;
            return participateEdgeCollection.save({ isMainPax: isMainPax }, 'proposals/' + proposalKey, saveDoc._id);

          case 16:
            _context.next = 18;
            return bookInEdgeCollection.outEdges('proposals/' + proposalKey);

          case 18:
            proposalBookInTripsEdges = _context.sent;
            tripsParticipatePaxsEdges = proposalBookInTripsEdges.map(function (edge) {
              return { _from: edge._to, _to: saveDoc._id };
            });
            _context.next = 22;
            return participateEdgeCollection.import(tripsParticipatePaxsEdges);

          case 22:
            return _context.abrupt('return', saveDoc);

          case 25:
            _context.prev = 25;
            _context.t0 = _context['catch'](0);

            console.log('[Pax Controller], addPax error', _context.t0);
            return _context.abrupt('return', null);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 25]]);
  }));

  return function addPax(_x) {
    return _ref.apply(this, arguments);
  };
}();

var updatePax = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(args) {
    var paxKey, newPax;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            paxKey = args.paxKey;
            _context2.next = 4;
            return paxsCollection.updateByExample({ _key: paxKey }, args);

          case 4:
            _context2.next = 6;
            return paxsCollection.firstExample({ _key: paxKey });

          case 6:
            newPax = _context2.sent;
            return _context2.abrupt('return', newPax);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](0);

            console.log('[Pax Controllers] update Pax error', _context2.t0);
            return _context2.abrupt('return', null);

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 10]]);
  }));

  return function updatePax(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var deletePax = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(args) {
    var paxKey, proposalKey, edges;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            paxKey = args.paxKey, proposalKey = args.proposalKey;
            _context3.prev = 1;
            _context3.next = 4;
            return paxsCollection.remove({ _key: paxKey });

          case 4:
            _context3.next = 6;
            return participateEdgeCollection.inEdges('paxs/' + paxKey);

          case 6:
            edges = _context3.sent;
            _context3.next = 9;
            return participateEdgeCollection.removeByKeys(edges.map(function (edge) {
              return edge._key;
            }));

          case 9:
            return _context3.abrupt('return', { paxKey: paxKey });

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](1);

            console.log('[Pax Controllers] delete pax error,', _context3.t0);
            return _context3.abrupt('return', {});

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 12]]);
  }));

  return function deletePax(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var updateProposalMainPax = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(args) {
    var mainPaxKey, proposalKey, edges, newMainPaxId, oldMainPaxRelaKey, newMainPaxRelaKey, i;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            mainPaxKey = args.mainPaxKey, proposalKey = args.proposalKey;
            _context5.next = 4;
            return participateEdgeCollection.outEdges('proposals/' + proposalKey);

          case 4:
            edges = _context5.sent;
            newMainPaxId = 'paxs/' + mainPaxKey;
            oldMainPaxRelaKey = void 0;
            newMainPaxRelaKey = void 0;

            for (i = 0; i < edges.length; i++) {
              if (edges[i].isMainPax) {
                oldMainPaxRelaKey = edges[i]._key;
              } else if (edges[i]._to === newMainPaxId) {
                newMainPaxRelaKey = edges[i]._key;
              }
            }

            if (!oldMainPaxRelaKey) {
              _context5.next = 12;
              break;
            }

            _context5.next = 12;
            return participateEdgeCollection.updateByExample({ _key: oldMainPaxRelaKey }, { isMainPax: false });

          case 12:
            if (!newMainPaxRelaKey) {
              _context5.next = 15;
              break;
            }

            _context5.next = 15;
            return participateEdgeCollection.updateByExample({ _key: newMainPaxRelaKey }, { isMainPax: true });

          case 15:
            return _context5.abrupt('return', { mainPaxKey: mainPaxKey });

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5['catch'](0);

            console.log('[Pax Controllers] Change Proposal Main Pax error,', _context5.t0);
            return _context5.abrupt('return', null);

          case 22:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 18]]);
  }));

  return function updateProposalMainPax(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

var getProposalPaxs = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(proposalKey) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            aqlQuery = '\n    FOR vertex, edge\n      IN 1..1 OUTBOUND @proposalId GRAPH \'exo-dev\'\n      FILTER\n        IS_SAME_COLLECTION(\'paxs\', vertex)\n      SORT vertex.firstName, vertex.lastName\n      RETURN MERGE({\n        isMainPax: edge.isMainPax\n      }, vertex)\n  ';
            _context6.next = 3;
            return _database.db.query(aqlQuery, {
              proposalId: 'proposals/' + proposalKey
            });

          case 3:
            result = _context6.sent;
            return _context6.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getProposalPaxs(_x6) {
    return _ref7.apply(this, arguments);
  };
}();

var getPaxs = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(vertexId) {
    var aqlQuery, result;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            aqlQuery = '\n    FOR pax, edge\n    IN 1..1 OUTBOUND @vertexId\n    GRAPH \'exo-dev\'\n    FILTER\n      IS_SAME_COLLECTION(\'paxs\', pax) AND\n      IS_SAME_COLLECTION(\'participate\', edge)\n    RETURN pax\n  ';
            _context7.next = 3;
            return _database.db.query(aqlQuery, { vertexId: vertexId });

          case 3:
            result = _context7.sent;
            return _context7.abrupt('return', result.all());

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getPaxs(_x7) {
    return _ref8.apply(this, arguments);
  };
}();

var _request = require('../../../utils/request');

var _request2 = _interopRequireDefault(_request);

var _database = require('../../database');

var _Activity = require('../../Activity/controllers/Activity');

var _environment = require('../../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graph = _database.db.graph(_environment2.default.arango.databaseName);
var paxs = graph.vertexCollection('paxs');

// import config from '../../../config/environment';
// const graph = db.graph(config.arango.databaseName);
var paxsCollection = _database.db.collection('paxs');
var participateEdgeCollection = _database.db.edgeCollection('participate');
var bookInEdgeCollection = _database.db.edgeCollection('bookIn');

function getPaxsByProposalKeyTripKey(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-proposalkey-tripkey', _request.POST, args);
}

function getPaxsByServiceBookingKey(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-servicebookingkey', _request.POST, args);
}

function getPaxsByRoomConfigKey(args) {
  return (0, _request2.default)('http://localhost:8529/_db/exo-dev/bbt/paxs/get-paxs-by-roomconfigkey', _request.POST, args);
}

var remove = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(paxKey) {
    var activities;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _Activity.getActivities)(paxKey);

          case 2:
            activities = _context4.sent;
            _context4.next = 5;
            return _promise2.default.all(activities.map(function (_ref5) {
              var _key = _ref5._key;
              return (0, _Activity.remove)(_key);
            }));

          case 5:
            return _context4.abrupt('return', paxs.remove(paxKey));

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function remove(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getPaxsByProposalKeyTripKey = getPaxsByProposalKeyTripKey;
exports.getPaxsByServiceBookingKey = getPaxsByServiceBookingKey;
exports.getPaxsByRoomConfigKey = getPaxsByRoomConfigKey;
exports.addPax = addPax;
exports.updatePax = updatePax;
exports.deletePax = deletePax;
exports.updateProposalMainPax = updateProposalMainPax;
exports.getProposalPaxs = getProposalPaxs;
exports.remove = remove;
exports.getPaxs = getPaxs;