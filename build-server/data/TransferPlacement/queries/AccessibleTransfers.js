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

var _Transfer = require('../types/Transfer');

var _Transfer2 = _interopRequireDefault(_Transfer);

var _Transfer3 = require('../controllers/Transfer');

var transferCtrl = _interopRequireWildcard(_Transfer3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  accessibleTransfers: {
    type: new _graphql.GraphQLList(_Transfer2.default),
    description: 'Fetch accessible transfer from TourPlan by passing the origin and destination',
    args: (0, _extends3.default)({
      origin: {
        type: _graphql.GraphQLString
      },
      destination: {
        type: _graphql.GraphQLString
      },
      dateFrom: {
        type: _graphql.GraphQLString
      }
    }, _graphqlRelay.connectionArgs),
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, _ref2) {
        var origin = _ref2.origin,
            destination = _ref2.destination,
            dateFrom = _ref2.dateFrom;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(origin && destination)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return transferCtrl.getAccessibleTransfers({ origin: origin, destination: destination, dateFrom: dateFrom });

              case 3:
                return _context.abrupt('return', _context.sent);

              case 4:
                return _context.abrupt('return', []);

              case 5:
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