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

var _OfficeType = require('./OfficeType');

var _OfficeType2 = _interopRequireDefault(_OfficeType);

var _OfficeController = require('./OfficeController');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  type: new _graphql.GraphQLList(_OfficeType2.default),
  args: (0, _extends3.default)({
    type: {
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
      var type = _ref2.type;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _OfficeController.getAllOffices)(type);

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

    return function resolve(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};