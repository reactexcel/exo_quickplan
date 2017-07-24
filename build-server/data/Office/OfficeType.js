'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _UserType = require('../User/UserType');

var _UserType2 = _interopRequireDefault(_UserType);

var _CurrencyType = require('../User/CurrencyType');

var _CurrencyType2 = _interopRequireDefault(_CurrencyType);

var _OfficeController = require('./OfficeController');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'OfficeType',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      companyName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var companyName = _ref.companyName;
          return companyName || '';
        }
      },
      workInCountries: {
        type: new _graphql.GraphQLList(_CurrencyType2.default)
      },
      officeName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref2) {
          var officeName = _ref2.officeName;
          return officeName || '';
        }
      },
      users: {
        type: new _graphql.GraphQLList(_UserType2.default),
        resolve: function () {
          var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref4) {
            var _key = _ref4._key;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _OfficeController.getUsers)(_key);

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
            return _ref3.apply(this, arguments);
          };
        }()
      }
    };
  }
});