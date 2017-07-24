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

var _AccessibleTour = require('../types/AccessibleTour');

var _AccessibleTour2 = _interopRequireDefault(_AccessibleTour);

var _Tours = require('../controllers/Tours');

var tourCtrl = _interopRequireWildcard(_Tours);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  accessibleTours: {
    type: new _graphql.GraphQLList(_AccessibleTour2.default),
    args: (0, _extends3.default)({
      country: {
        type: _graphql.GraphQLString
      },
      city: {
        type: _graphql.GraphQLString
      },
      date: {
        type: _graphql.GraphQLString
      },
      cityDayKey: {
        type: _graphql.GraphQLString
      },
      officeKey: {
        type: _graphql.GraphQLString
      }
    }, _graphqlRelay.connectionArgs),
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, _ref2) {
        var country = _ref2.country,
            city = _ref2.city,
            date = _ref2.date,
            cityDayKey = _ref2.cityDayKey,
            officeKey = _ref2.officeKey;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(country && city && date)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return tourCtrl.getAccessibleTours({ country: country, city: city, date: date, cityDayKey: cityDayKey, officeKey: officeKey });

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