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

var _lodash2 = _interopRequireDefault(_lodash);

var _Trip = require('./../controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip);

var _Trip2 = require('./../types/Trip');

var _Trip3 = _interopRequireDefault(_Trip2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'RemoveDayTripPlanner',
  inputFields: {
    tripId: { type: _graphql.GraphQLString },
    tripKey: { type: _graphql.GraphQLString },
    countryIndex: { type: _graphql.GraphQLString },
    cityIndex: { type: _graphql.GraphQLString },
    startDay: { type: _graphql.GraphQLInt }
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
          startDay = _ref2.startDay;
      var trip, city, services;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return tripCtrl.getTrip({ _key: tripKey });

            case 3:
              trip = _context.sent;
              city = trip.countryBookings[countryIndex].cities[cityIndex];
              services = city.serviceBookings;

              // Reduce the duration nights by one

              city.durationNights -= 1;

              // Remove all the activities and hotels whose startDay equal to the removed day
              _lodash2.default.remove(services, function (service) {
                return service.startDay === startDay;
              });

              // Reduce the startDay of each activities and hotels, which come after the removed day, by one,
              // and also reduce the number of nights of hotels, which has number of nights greater than the new durationNights
              _lodash2.default.each(services, function (service) {
                if (service.startDay > startDay) service.startDay -= 1; // eslint-disable-line no-param-reassign
                if (service.numberOfNights > city.durationNights) service.numberOfNights -= 1; // eslint-disable-line no-param-reassign
              });

              _context.next = 11;
              return tripCtrl.updateTrip(trip._key, trip);

            case 11:
              return _context.abrupt('return', trip);

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](0);

              console.error(_context.t0);
              return _context.abrupt('return', null);

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 14]]);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});