'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphqlRelay = require('graphql-relay');

var _graphql = require('graphql');

var _interface = require('../../interface');

var _CityBooking = require('../../CityBooking/types/CityBooking');

var _CityBooking2 = _interopRequireDefault(_CityBooking);

var _Location = require('../../Location/types/Location');

var _Location2 = _interopRequireDefault(_Location);

var _TransferPlacement = require('../../TransferPlacement/types/TransferPlacement');

var _TransferPlacement2 = _interopRequireDefault(_TransferPlacement);

var _TransferPlacement3 = require('../../TransferPlacement/controllers/TransferPlacement');

var _CountryBooking = require('../controllers/CountryBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'CountryBooking',
  description: 'The country booking object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('CountryBooking', function (country) {
        return country._key;
      }),
      _key: {
        type: _graphql.GraphQLString,
        description: 'Unique country booking ID.'
      },
      countryCode: {
        type: _graphql.GraphQLString
      },
      qpBookingId: {
        type: _graphql.GraphQLInt
      },
      tpBookingId: {
        type: _graphql.GraphQLInt
      },
      tpBookingRef: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var tpBookingRef = _ref.tpBookingRef;
          return tpBookingRef || '';
        }
      },
      cities: {
        type: new _graphql.GraphQLList(_graphql.GraphQLInt)
      },
      createdBy: {
        type: _graphql.GraphQLString
      },
      createdOn: {
        type: _graphql.GraphQLString
      },
      dateFrom: {
        type: _graphql.GraphQLString
      },
      totalPrice: {
        type: _graphql.GraphQLInt
      },
      currency: {
        type: _graphql.GraphQLString
      },
      notes: {
        type: _graphql.GraphQLString
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      durationDays: {
        type: _graphql.GraphQLString
      },
      durationNights: {
        type: _graphql.GraphQLString
      },
      cityBookings: {
        type: new _graphql.GraphQLList(_CityBooking2.default)
      },
      transferPlacements: {
        type: _TransferPlacement2.default,
        resolve: function () {
          var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(countryBooking) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _TransferPlacement3.getTransferPlacementByCountryBookingKey)({ countryBookingKey: countryBooking._key });

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
            return _ref2.apply(this, arguments);
          };
        }()
      },
      location: {
        type: _Location2.default,
        resolve: function () {
          var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(countryBooking) {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _CountryBooking.getCountryLocation)(countryBooking._key);

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
            return _ref3.apply(this, arguments);
          };
        }()
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});