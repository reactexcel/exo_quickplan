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

var _CityDay = require('../../CityDay/types/CityDay');

var _CityDay2 = _interopRequireDefault(_CityDay);

var _AccommodationPlacement = require('../../Supplier/types/AccommodationPlacement');

var _AccommodationPlacement2 = _interopRequireDefault(_AccommodationPlacement);

var _TransferPlacement = require('../../TransferPlacement/types/TransferPlacement');

var _TransferPlacement2 = _interopRequireDefault(_TransferPlacement);

var _TransferPlacement3 = require('../../TransferPlacement/controllers/TransferPlacement');

var _Location = require('../../Location/types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _CityBooking = require('../controllers/CityBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'CityBooking',
  description: 'The city booking object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('CityBooking', function (city) {
        return city._key;
      }),
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique city booking ID.'
      },
      cityCode: {
        type: _graphql.GraphQLString
      },
      startDay: {
        type: _graphql.GraphQLInt
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      durationDays: {
        type: _graphql.GraphQLInt
      },
      durationNights: {
        type: _graphql.GraphQLInt
      },
      cityOrder: {
        type: _graphql.GraphQLInt
      },
      cityDays: {
        type: new _graphql.GraphQLList(_CityDay2.default)
      },
      accommodationPlacements: {
        type: new _graphql.GraphQLList(_AccommodationPlacement2.default)

      },
      transferPlacements: {
        type: _TransferPlacement2.default,
        resolve: function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(cityBooking) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _TransferPlacement3.getTransferPlacementByCityBookingKey)({ cityBookingKey: cityBooking._key });

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
            return _ref.apply(this, arguments);
          };
        }()
      },
      location: {
        type: _Location2.default,
        resolve: function () {
          var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(cityBooking) {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _CityBooking.getCityLocation)(cityBooking._key);

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
      defaultTours: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        resolve: function () {
          var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(cityBooking) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _CityBooking.getDefaultToursForCity)(cityBooking._key);

                  case 2:
                    return _context3.abrupt('return', _context3.sent);

                  case 3:
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
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});