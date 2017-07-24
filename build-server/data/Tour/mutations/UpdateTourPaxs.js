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

var _ServiceBooking = require('../../ServiceBooking/types/ServiceBooking');

var _ServiceBooking2 = _interopRequireDefault(_ServiceBooking);

var _Tours = require('../controllers/Tours');

var _ServiceBooking3 = require('../../ServiceBooking/controllers/ServiceBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateTourPaxs',
  inputFields: {
    paxKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    serviceBookingKey: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    }
  },
  outputFields: {
    serviceBooking: {
      type: _ServiceBooking2.default,
      resolve: function resolve(savedDoc) {
        return savedDoc;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var serviceBookingKey = _ref2.serviceBookingKey,
          paxKeys = _ref2.paxKeys;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _Tours.updateTourPaxs)({ serviceBookingKey: serviceBookingKey, paxKeys: paxKeys });

            case 2:
              _context.next = 4;
              return (0, _ServiceBooking3.getServiceBooking)({ serviceBookingKey: serviceBookingKey });

            case 4:
              return _context.abrupt('return', _context.sent);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});