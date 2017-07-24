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

var _interface = require('../../interface');

var _ServiceBooking = require('../../ServiceBooking/types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _Location = require('../../Location/types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _ServiceBooking3 = require('../../ServiceBooking/controllers/ServiceBooking');

var _TransferPlacement = require('../controllers/TransferPlacement');

var _TransferStatuses = require('../types/TransferStatuses');

var _TransferStatuses2 = _interopRequireDefault(_TransferStatuses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'TransferPlacement',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('TransferPlacement', function (transferPlacement) {
        return transferPlacement._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      durationDays: {
        type: _graphql.GraphQLInt
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      startDay: {
        type: _graphql.GraphQLInt
      },
      serviceBookings: {
        type: new _graphql.GraphQLList(_ServiceBooking2.default),
        resolve: function resolve(transferPlacement) {
          if (!transferPlacement.serviceBookingOrder) return [];
          return transferPlacement.serviceBookingOrder.map(function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(serviceBookingKey) {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return (0, _ServiceBooking3.getServiceBooking)(serviceBookingKey);

                    case 2:
                      return _context.abrupt('return', _context.sent);

                    case 3:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            }));

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        }
      },
      transferStatus: {
        type: _TransferStatuses2.default,
        resolve: function () {
          var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(transferPlacement) {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _TransferPlacement.getTransferStatus)(transferPlacement._key);

                  case 2:
                    return _context2.abrupt('return', _context2.sent);

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x2) {
            return _ref2.apply(this, arguments);
          };
        }()
      },
      fromCity: {
        type: _Location2.default,
        resolve: function () {
          var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(transferPlacement) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!transferPlacement.returnLocalTransferAdded) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt('return', {});

                  case 2:
                    _context3.next = 4;
                    return (0, _TransferPlacement.getCityLocationByTransferPlacementKey)({ transferPlacementKey: transferPlacement._key, type: 'from' });

                  case 4:
                    return _context3.abrupt('return', _context3.sent);

                  case 5:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, undefined);
          }));

          return function resolve(_x3) {
            return _ref3.apply(this, arguments);
          };
        }()
      },
      toCity: {
        type: _Location2.default,
        resolve: function () {
          var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(transferPlacement) {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!transferPlacement.returnLocalTransferAdded) {
                      _context4.next = 2;
                      break;
                    }

                    return _context4.abrupt('return', {});

                  case 2:
                    _context4.next = 4;
                    return (0, _TransferPlacement.getCityLocationByTransferPlacementKey)({ transferPlacementKey: transferPlacement._key, type: 'to' });

                  case 4:
                    return _context4.abrupt('return', _context4.sent);

                  case 5:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, undefined);
          }));

          return function resolve(_x4) {
            return _ref4.apply(this, arguments);
          };
        }()
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});