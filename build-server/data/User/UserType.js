'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _OfficeType = require('../Office/OfficeType');

var _OfficeType2 = _interopRequireDefault(_OfficeType);

var _Proposal = require('../Proposal/types/Proposal');

var _Proposal2 = _interopRequireDefault(_Proposal);

var _UserController = require('./UserController');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserType = new _graphql.GraphQLObjectType({
  name: 'UserType',
  fields: function fields() {
    return {
      _key: {
        type: _graphql.GraphQLString
      },
      email: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var email = _ref.email;
          return email || '';
        }
      },
      role: {
        type: _graphql.GraphQLString
      },
      firstName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref2) {
          var firstName = _ref2.firstName;
          return firstName || '';
        }
      },
      lastName: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref3) {
          var lastName = _ref3.lastName;
          return lastName || '';
        }
      },
      office: {
        type: _OfficeType2.default,
        resolve: function () {
          var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref5) {
            var userKey = _ref5._key;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _UserController.getOffice)(userKey);

                  case 2:
                    _context.t0 = _context.sent;

                    if (_context.t0) {
                      _context.next = 5;
                      break;
                    }

                    _context.t0 = {};

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
            return _ref4.apply(this, arguments);
          };
        }()
      },
      isSupervisor: {
        type: _graphql.GraphQLBoolean
      },
      proposals: {
        type: new _graphql.GraphQLList(_Proposal2.default),
        resolve: function () {
          var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref7) {
            var userKey = _ref7._key,
                role = _ref7.role,
                isSupervisor = _ref7.isSupervisor;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _UserController.getProposals)({ userKey: userKey, role: role, isSupervisor: isSupervisor });

                  case 2:
                    _context2.t0 = _context2.sent;

                    if (_context2.t0) {
                      _context2.next = 5;
                      break;
                    }

                    _context2.t0 = [];

                  case 5:
                    return _context2.abrupt('return', _context2.t0);

                  case 6:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, undefined);
          }));

          return function resolve(_x2) {
            return _ref6.apply(this, arguments);
          };
        }()
      },
      supervisingTCs: {
        type: new _graphql.GraphQLList(UserType),
        resolve: function () {
          var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(user) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return (0, _UserController.getSupervisingTCs)(user);

                  case 2:
                    _context3.t0 = _context3.sent;

                    if (_context3.t0) {
                      _context3.next = 5;
                      break;
                    }

                    _context3.t0 = [user];

                  case 5:
                    return _context3.abrupt('return', _context3.t0);

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, undefined);
          }));

          return function resolve(_x3) {
            return _ref8.apply(this, arguments);
          };
        }()
      },
      created: {
        type: _graphql.GraphQLBoolean
      }
    };
  }
});

exports.default = UserType;