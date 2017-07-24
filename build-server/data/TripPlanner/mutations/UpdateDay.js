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

var _CityDay = require('../../CityDay/controllers/CityDay');

var dayCtrl = _interopRequireWildcard(_CityDay);

var _cityDays = require('./../types/cityDays');

var _cityDays2 = _interopRequireDefault(_cityDays);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateDayTripPlanner',
  inputFields: {
    dayKey: { type: _graphql.GraphQLString },
    unavailableSlots: { type: new _graphql.GraphQLList(_graphql.GraphQLString) }
  },
  outputFields: {
    cityDays: {
      type: _cityDays2.default,
      resolve: function resolve(updatedDays) {
        return updatedDays;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var dayKey = _ref2.dayKey,
          unavailableSlots = _ref2.unavailableSlots;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return dayCtrl.updateCityDays(dayKey, unavailableSlots);

            case 3:
              return _context.abrupt('return', _context.sent);

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](0);
              return _context.abrupt('return', null);

            case 9:
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