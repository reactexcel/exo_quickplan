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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'RemoveCountryTripPlanner',
  inputFields: {
    tripId: { type: _graphql.GraphQLString },
    tripKey: { type: _graphql.GraphQLString },
    removedIndex: { type: _graphql.GraphQLInt }
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
          removedIndex = _ref2.removedIndex;
      var trip;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return tripCtrl.getTrip({ _key: tripKey });

            case 3:
              trip = _context.sent;

              // trip.countryBookings.splice(removedIndex, 1);
              trip.countryOrder.splice(removedIndex, 1); // countryBookings is replaced with countryOrder since no countryOrder in in trip.
              _context.next = 7;
              return tripCtrl.updateTrip(trip._key, trip);

            case 7:
              return _context.abrupt('return', trip);

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](0);

              console.error(_context.t0);
              return _context.abrupt('return', null);

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 10]]);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});