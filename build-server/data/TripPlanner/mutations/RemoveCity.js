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

var _Trip = require('./../controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip);

var _Trip2 = require('./../types/Trip');

var _Trip3 = _interopRequireDefault(_Trip2);

var _CityBooking = require('../../CityBooking/controllers/CityBooking');

var cityBookingController = _interopRequireWildcard(_CityBooking);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'RemoveCityTripPlanner',
  inputFields: {
    tripId: { type: _graphql.GraphQLString },
    tripKey: { type: _graphql.GraphQLString },
    countryIndex: { type: _graphql.GraphQLString },
    cityIndex: { type: _graphql.GraphQLInt },
    countryBookingKey: { type: _graphql.GraphQLString }, // changes to string gettin error "Int cannot represent non 32-bit signed integer value: "
    cityBookingKey: { type: _graphql.GraphQLString } // changes to string gettin error "Int cannot represent non 32-bit signed integer value: "
  },
  outputFields: {
    trips: {
      type: _Trip3.default,
      resolve: function resolve(updatedTrip) {
        return updatedTrip;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var tripKey = _ref2.tripKey,
          countryIndex = _ref2.countryIndex,
          cityIndex = _ref2.cityIndex,
          countryBookingKey = _ref2.countryBookingKey,
          cityBookingKey = _ref2.cityBookingKey;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return cityBookingController.removeCityBooking({ tripKey: tripKey, countryIndex: countryIndex, cityIndex: cityIndex, countryBookingKey: countryBookingKey, cityBookingKey: cityBookingKey });

            case 3:
              return _context.abrupt('return', _context.sent);

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](0);

              console.error(_context.t0);
              return _context.abrupt('return', null);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 6]]);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});