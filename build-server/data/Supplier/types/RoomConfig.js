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

var _Pax = require('../../Pax/types/Pax');

var _Pax2 = _interopRequireDefault(_Pax);

var _Pax3 = require('../../Pax/controllers/Pax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'RoomConfig',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('RoomConfigs', function (roomConfig) {
        return roomConfig._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      roomType: {
        type: _graphql.GraphQLString
      },
      paxs: {
        type: new _graphql.GraphQLList(_Pax2.default),
        resolve: function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(roomConfig) {
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _Pax3.getPaxsByRoomConfigKey)({ roomConfigKey: roomConfig._key });

                  case 2:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                      _context.next = 5;
                      break;
                    }

                    _context.t0 = [];

                  case 5:
                    return _context.abrupt('return', _context.t0);

                  case 6:
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
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});