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

var _Supplier = require('../controllers/Supplier');

var _ServiceBooking3 = require('../../ServiceBooking/controllers/ServiceBooking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddRoomConfig',
  inputFields: {
    serviceBookingKey: {
      type: _graphql.GraphQLString
    },
    roomType: {
      type: _graphql.GraphQLString
    },
    paxKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
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
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var aa;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _Supplier.addRoomConfig)(inputFields);

            case 2:
              aa = _context.sent;

              if (!(inputFields.paxKeys.length > 0)) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return (0, _Supplier.updateRoomConfig)({
                roomConfigKey: aa._key,
                roomType: inputFields.roomType,
                paxKeys: inputFields.paxKeys
              });

            case 6:
              _context.next = 8;
              return (0, _ServiceBooking3.getServiceBooking)({ serviceBookingKey: inputFields.serviceBookingKey });

            case 8:
              return _context.abrupt('return', _context.sent);

            case 9:
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