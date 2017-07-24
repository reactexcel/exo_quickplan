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

var _RoomConfig = require('../../Supplier/types/RoomConfig');

var _RoomConfig2 = _interopRequireDefault(_RoomConfig);

var _Supplier = require('../controllers/Supplier');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateRoomConfig',
  inputFields: {
    roomType: {
      type: _graphql.GraphQLString
    },
    paxKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    roomConfigId: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    }
  },
  outputFields: {
    roomConfig: {
      type: _RoomConfig2.default,
      resolve: function resolve(savedDoc) {
        return savedDoc;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var roomConfigId = _ref2.roomConfigId,
          roomType = _ref2.roomType,
          paxKeys = _ref2.paxKeys;
      var roomConfigKey, res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              roomConfigKey = (0, _graphqlRelay.fromGlobalId)(roomConfigId).id;
              _context.next = 3;
              return (0, _Supplier.updateRoomConfig)({ roomConfigKey: roomConfigKey, roomType: roomType, paxKeys: paxKeys });

            case 3:
              res = _context.sent;
              _context.prev = 4;
              _context.next = 7;
              return (0, _Supplier.updatePAXStatuses)({ roomConfigKey: roomConfigKey });

            case 7:
              _context.next = 11;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](4);

            case 11:
              return _context.abrupt('return', res);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[4, 9]]);
    }));

    return function mutateAndGetPayload(_x) {
      return _ref.apply(this, arguments);
    };
  }()
});