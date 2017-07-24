'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _Pax = require('../../Pax/types/Pax');

var _Pax2 = _interopRequireDefault(_Pax);

var _UserType = require('../../User/UserType');

var _UserType2 = _interopRequireDefault(_UserType);

var _Trip = require('../../Trip/types/Trip');

var _Trip2 = _interopRequireDefault(_Trip);

var _Location = require('../../Location/types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _Proposal = require('../controllers/Proposal');

var _Pax3 = require('../../Pax/controllers/Pax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'Proposal',
  description: 'The proposal object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Proposal', function (proposal) {
        return proposal._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      startTravelInCity: {
        type: _graphql.GraphQLString
      },
      startTravelIn: {
        type: _Location2.default,
        resolve: function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
            var _key = _ref2._key;
            var location, combinedLocation;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _Proposal.getLocation)(_key);

                  case 2:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                      _context.next = 5;
                      break;
                    }

                    _context.t0 = [];

                  case 5:
                    location = _context.t0[0];

                    if (location) {
                      _context.next = 8;
                      break;
                    }

                    return _context.abrupt('return', {});

                  case 8:
                    combinedLocation = location[0];

                    combinedLocation.name = location.map(function (l) {
                      return l.name;
                    }).join(', ');
                    return _context.abrupt('return', combinedLocation);

                  case 11:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x) {
            return _ref.apply(this, arguments);
          };
        }()
      },
      startTravelOnDate: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref3) {
          var startTravelOnDate = _ref3.startTravelOnDate;
          return startTravelOnDate || '';
        }
      },
      travelDuration: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref4) {
          var travelDuration = _ref4.travelDuration;
          return travelDuration || 0;
        }
      },
      nrAdult: {
        type: _graphql.GraphQLInt
      },
      nrChildren: {
        type: _graphql.GraphQLInt
      },
      nrInfant: {
        type: _graphql.GraphQLInt
      },
      notes: {
        type: _graphql.GraphQLString
      },
      class: {
        type: new _graphql.GraphQLList(_graphql.GraphQLInt)
      },
      style: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      occasion: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString)
      },
      preferredLanguage: {
        type: _graphql.GraphQLString
      },
      createOnDate: {
        type: _graphql.GraphQLString
      },
      updatedOn: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref5) {
          var updatedOn = _ref5.updatedOn;
          return updatedOn || '';
        }
      },
      status: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref6) {
          var status = _ref6.status;
          return status || '';
        }
      },
      mainPax: {
        type: _Pax2.default,
        resolve: function () {
          var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref8) {
            var _key = _ref8._key;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _Proposal.getMainPax)(_key);

                  case 2:
                    _context2.t0 = _context2.sent;

                    if (_context2.t0) {
                      _context2.next = 5;
                      break;
                    }

                    _context2.t0 = {};

                  case 5:
                    return _context2.abrupt('return', _context2.t0);

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x2) {
            return _ref7.apply(this, arguments);
          };
        }()
      },
      tripsCount: {
        type: _graphql.GraphQLInt,
        resolve: function resolve(_ref9) {
          var _key = _ref9._key;
          return (0, _Proposal.getTripsCount)(_key);
        }
      },
      name: {
        type: _graphql.GraphQLString
      },
      private: {
        type: _graphql.GraphQLBoolean,
        resolve: function resolve(proposal) {
          return proposal.private || false;
        }
      },
      TA: {
        type: _UserType2.default,
        resolve: function () {
          var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref11) {
            var proposalKey = _ref11._key;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _Proposal.getUser)(proposalKey, 'TA');

                  case 2:
                    _context3.t0 = _context3.sent;

                    if (_context3.t0) {
                      _context3.next = 5;
                      break;
                    }

                    _context3.t0 = {};

                  case 5:
                    return _context3.abrupt('return', _context3.t0);

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, undefined);
          }));

          return function resolve(_x3) {
            return _ref10.apply(this, arguments);
          };
        }()
      },
      TC: {
        type: _UserType2.default,
        resolve: function () {
          var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref13) {
            var proposalKey = _ref13._key;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return (0, _Proposal.getUser)(proposalKey, 'TC');

                  case 2:
                    _context4.t0 = _context4.sent;

                    if (_context4.t0) {
                      _context4.next = 5;
                      break;
                    }

                    _context4.t0 = {};

                  case 5:
                    return _context4.abrupt('return', _context4.t0);

                  case 6:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, undefined);
          }));

          return function resolve(_x4) {
            return _ref12.apply(this, arguments);
          };
        }()
      },
      bookedTrip: {
        type: _Trip2.default,
        resolve: function () {
          var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref15) {
            var _key = _ref15._key;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return (0, _Proposal.getBookedTrip)(_key);

                  case 2:
                    _context5.t0 = _context5.sent;

                    if (_context5.t0) {
                      _context5.next = 5;
                      break;
                    }

                    _context5.t0 = {};

                  case 5:
                    return _context5.abrupt('return', _context5.t0);

                  case 6:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, undefined);
          }));

          return function resolve(_x5) {
            return _ref14.apply(this, arguments);
          };
        }()
      },
      trips: {
        type: new _graphql.GraphQLList(_Trip2.default),
        resolve: function () {
          var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref17) {
            var _key = _ref17._key;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return (0, _Proposal.getTrips)(_key);

                  case 2:
                    _context6.t0 = _context6.sent;

                    if (_context6.t0) {
                      _context6.next = 5;
                      break;
                    }

                    _context6.t0 = [];

                  case 5:
                    return _context6.abrupt('return', _context6.t0);

                  case 6:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, undefined);
          }));

          return function resolve(_x6) {
            return _ref16.apply(this, arguments);
          };
        }()
      },
      paxs: {
        type: new _graphql.GraphQLList(_Pax2.default),
        resolve: function () {
          var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref19) {
            var _key = _ref19._key;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _Pax3.getProposalPaxs)(_key);

                  case 2:
                    _context7.t0 = _context7.sent;

                    if (_context7.t0) {
                      _context7.next = 5;
                      break;
                    }

                    _context7.t0 = [];

                  case 5:
                    return _context7.abrupt('return', _context7.t0);

                  case 6:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, undefined);
          }));

          return function resolve(_x7) {
            return _ref18.apply(this, arguments);
          };
        }()
      }
    };
  }
});