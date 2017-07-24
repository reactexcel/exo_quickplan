'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _Trip = require('../types/Trip');

var _Trip2 = _interopRequireDefault(_Trip);

var _Trip3 = require('../controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getTripByKey: {
    type: _Trip2.default,
    args: (0, _extends3.default)({
      tripKey: {
        type: _graphql.GraphQLID
      },
      agent: {
        type: _graphql.GraphQLString
      },
      password: {
        type: _graphql.GraphQLString
      }
    }, _graphqlRelay.connectionArgs),
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, _ref2) {
        var tripKey = _ref2.tripKey;
        var trip;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!tripKey) {
                  _context.next = 5;
                  break;
                }

                _context.next = 3;
                return tripCtrl.getTrip({ tripKey: tripKey });

              case 3:
                trip = _context.sent;
                return _context.abrupt('return', trip);

              case 5:
                return _context.abrupt('return', []);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function resolve(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  }
};