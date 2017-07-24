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

var _lodash = require('lodash');

var _interface = require('../../interface');

var _Tour = require('../../Tour/types/Tour');

var _Tour2 = _interopRequireDefault(_Tour);

var _Transfer = require('../../TransferPlacement/types/Transfer');

var _Transfer2 = _interopRequireDefault(_Transfer);

var _Accommodation = require('../../Supplier/types/Accommodation');

var _Accommodation2 = _interopRequireDefault(_Accommodation);

var _Pax = require('../../Pax/types/Pax');

var _Pax2 = _interopRequireDefault(_Pax);

var _PlaceholderOutput = require('../../CityDay/types/PlaceholderOutput');

var _PlaceholderOutput2 = _interopRequireDefault(_PlaceholderOutput);

var _RoomConfig = require('../../Supplier/types/RoomConfig');

var _RoomConfig2 = _interopRequireDefault(_RoomConfig);

var _ServiceBookingStatus = require('./ServiceBookingStatus');

var _ServiceBookingStatus2 = _interopRequireDefault(_ServiceBookingStatus);

var _Supplier = require('../../Supplier/controllers/Supplier');

var _Pax3 = require('../../Pax/controllers/Pax');

var _TransferPlacement = require('../../TransferPlacement/controllers/TransferPlacement');

var _ServiceBooking = require('../../ServiceBooking/controllers/ServiceBooking');

var _PaxStatuses = require('../../Pax/types/PaxStatuses');

var _PaxStatuses2 = _interopRequireDefault(_PaxStatuses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PriceType = new _graphql.GraphQLObjectType({
  name: 'ServicePrice',
  fields: function fields() {
    return {
      currency: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var currency = _ref.currency;
          return currency || 'THB';
        } // TODO: change stub data
      },
      amount: {
        type: _graphql.GraphQLFloat
      },
      usdAmount: { // TODO: change stub data
        type: _graphql.GraphQLFloat,
        resolve: function resolve(_ref2) {
          var usdAmount = _ref2.usdAmount,
              amount = _ref2.amount;
          return usdAmount || amount * 0.0278009;
        }
      }
    };
  }
});

var RateType = new _graphql.GraphQLObjectType({
  name: 'ServiceRate',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLString
      },
      name: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var RouteType = new _graphql.GraphQLObjectType({
  name: 'TransferRoute',
  fields: function fields() {
    return {
      from: {
        type: _graphql.GraphQLString
      },
      to: {
        type: _graphql.GraphQLString
      },
      departureTime: {
        type: _graphql.GraphQLString
      },
      arrivalTime: {
        type: _graphql.GraphQLString
      },
      refNo: {
        type: _graphql.GraphQLString
      },
      withGuide: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var PickUpType = new _graphql.GraphQLObjectType({
  name: 'PickUp',
  fields: function fields() {
    return {
      time: {
        type: _graphql.GraphQLString
      },
      location: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var DropOffType = new _graphql.GraphQLObjectType({
  name: 'DropOff',
  fields: function fields() {
    return {
      time: {
        type: _graphql.GraphQLString
      },
      location: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      }
    };
  }
});

var Extras = new _graphql.GraphQLObjectType({
  name: 'ServiceExtras',
  fields: function fields() {
    return {
      quantity: {
        type: _graphql.GraphQLInt
      }
    };
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'ServiceBooking',
  description: 'The service booking object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('ServiceBooking', function (service) {
        return service._key;
      }),
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique service booking ID.'
      },
      productId: {
        type: _graphql.GraphQLString
      },
      serviceSequenceNumber: {
        type: _graphql.GraphQLInt
      },
      serviceLineId: {
        type: _graphql.GraphQLInt
      },
      status: {
        type: _ServiceBookingStatus2.default
      },
      price: {
        type: PriceType,
        resolve: function resolve(_ref3) {
          var price = _ref3.price;

          var amount = (0, _lodash.random)(1000, 100000) / 100;
          if (typeof price !== 'undefined' && price && price.amount) {
            amount = price.amount;
          } else {
            amount = '';
          }
          return {
            currency: 'THB',
            amount: amount,
            usdAmount: ''
            // usdAmount: amount * 0.0278009
          };
        }
      },
      route: {
        type: RouteType
      },
      rate: {
        type: RateType
      },
      dateFrom: {
        type: _graphql.GraphQLString
      },
      dateTo: {
        type: _graphql.GraphQLString
      },
      numberOfNights: {
        type: _graphql.GraphQLInt
      },
      startDay: {
        type: _graphql.GraphQLInt
      },
      startSlot: {
        type: _graphql.GraphQLInt
      },
      period: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref4) {
          var tour = _ref4.tour,
              _ref4$startSlot = _ref4.startSlot,
              startSlot = _ref4$startSlot === undefined ? 0 : _ref4$startSlot,
              _ref4$durationSlots = _ref4.durationSlots,
              durationSlots = _ref4$durationSlots === undefined ? 0 : _ref4$durationSlots,
              placeholder = _ref4.placeholder;
          return tour || placeholder ? ['', 'Morning', 'Afternoon', 'Evening'].slice(startSlot, startSlot + durationSlots).join(', ') : '';
        }
      },
      durationSlots: {
        type: _graphql.GraphQLInt
      },
      cancelHours: {
        type: _graphql.GraphQLInt
      },
      pickUp: {
        type: PickUpType
      },
      dropOff: {
        type: DropOffType
      },
      longDistanceOption: {
        type: _graphql.GraphQLBoolean
      },
      isEarlyCheckin: {
        type: _graphql.GraphQLBoolean
      },
      isLateCheckout: {
        type: _graphql.GraphQLBoolean
      },
      isPlaceholder: {
        type: _graphql.GraphQLBoolean
      },
      comment: {
        type: _graphql.GraphQLString
      },
      remarks: {
        type: _graphql.GraphQLString
      },
      notes: {
        type: _graphql.GraphQLString
      },
      roomConfigs: {
        type: new _graphql.GraphQLList(_RoomConfig2.default),
        resolve: function () {
          var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(parent) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _Supplier.getRoomConfigs)(parent._key);

                  case 2:
                    return _context.abrupt('return', _context.sent);

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function resolve(_x) {
            return _ref5.apply(this, arguments);
          };
        }()
      },
      extras: {
        type: new _graphql.GraphQLList(Extras)
      },
      tour: {
        type: _Tour2.default
      },
      serviceBookingType: {
        type: _graphql.GraphQLString
      },
      localtransfer: { // added on 19th oct for local transfer
        type: _Transfer2.default
      },
      accommodation: {
        type: _Accommodation2.default
      },
      transfer: {
        type: _Transfer2.default,
        resolve: function () {
          var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(serviceBooking) {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _TransferPlacement.getTransferByServiceBookingKey)({ serviceBookingKey: serviceBooking._key });

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
            return _ref6.apply(this, arguments);
          };
        }()
      },
      placeholder: {
        type: _PlaceholderOutput2.default
      },
      paxs: {
        type: new _graphql.GraphQLList(_Pax2.default),
        resolve: function () {
          var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(serviceBooking) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _Pax3.getPaxsByServiceBookingKey)({ serviceBookingKey: serviceBooking._key });

                  case 2:
                    _context3.t0 = _context3.sent;

                    if (_context3.t0) {
                      _context3.next = 5;
                      break;
                    }

                    _context3.t0 = [];

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
            return _ref7.apply(this, arguments);
          };
        }()
      },
      paxStatuses: {
        type: new _graphql.GraphQLList(_PaxStatuses2.default),
        resolve: function () {
          var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(serviceBooking) {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return (0, _ServiceBooking.getTransferPaxStatuses)(serviceBooking._key);

                  case 2:
                    return _context4.abrupt('return', _context4.sent);

                  case 3:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, undefined);
          }));

          return function resolve(_x4) {
            return _ref8.apply(this, arguments);
          };
        }()
      },
      afterHoursTransferOption: {
        type: _graphql.GraphQLString
      },
      inactive: {
        type: _graphql.GraphQLBoolean
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});