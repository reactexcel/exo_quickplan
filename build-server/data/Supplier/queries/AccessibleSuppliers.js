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

var _AccessibleSupplier = require('../types/AccessibleSupplier');

var _AccessibleSupplier2 = _interopRequireDefault(_AccessibleSupplier);

var _Supplier = require('../controllers/Supplier');

var accommodationCtrl = _interopRequireWildcard(_Supplier);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  accessibleSuppliers: {
    type: new _graphql.GraphQLList(_AccessibleSupplier2.default),
    description: 'Fetch accessible supplier from TourPlan by passing the given country, city, date, and duration',
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
      duration: {
        type: _graphql.GraphQLInt
      },
      accommodationPlacementKey: {
        type: _graphql.GraphQLString
      },
      useRemoteDataOnly: {
        type: _graphql.GraphQLBoolean
      }
    }, _graphqlRelay.connectionArgs),
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_, _ref2) {
        var country = _ref2.country,
            city = _ref2.city,
            date = _ref2.date,
            duration = _ref2.duration,
            accommodationPlacementKey = _ref2.accommodationPlacementKey,
            useRemoteDataOnly = _ref2.useRemoteDataOnly;
        var result, m_result, addedKeys;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(country && city && date)) {
                  _context.next = 12;
                  break;
                }

                _context.next = 3;
                return accommodationCtrl.getAccessibleSuppliers({ country: country, city: city, date: date, duration: duration, accommodationPlacementKey: accommodationPlacementKey, useRemoteDataOnly: useRemoteDataOnly });

              case 3:
                result = _context.sent;

                if (!(useRemoteDataOnly === false)) {
                  _context.next = 11;
                  break;
                }

                m_result = [];
                addedKeys = [];

                result.forEach(function (v, k) {
                  var key = v._key;
                  if (addedKeys.indexOf(key) >= 0) {
                    addedKeys.push(key);
                  } else {
                    addedKeys.push(key);
                    v.accommodations = v.accommodation; // eslint-disable-line no-param-reassign
                    m_result.push(v);
                  }
                });
                return _context.abrupt('return', m_result);

              case 11:
                return _context.abrupt('return', result);

              case 12:
                return _context.abrupt('return', []);

              case 13:
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