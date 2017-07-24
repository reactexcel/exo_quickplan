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

var _Pax = require('../controllers/Pax');

var paxCtrl = _interopRequireWildcard(_Pax);

var _Pax2 = require('../types/Pax');

var _Pax3 = _interopRequireDefault(_Pax2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  paxKey: { type: _graphql.GraphQLString },
  isMainPax: { type: _graphql.GraphQLBoolean },

  firstName: { type: _graphql.GraphQLString },
  lastName: { type: _graphql.GraphQLString },
  gender: { type: _graphql.GraphQLString },
  dateOfBirth: { type: _graphql.GraphQLString },
  ageOnArrival: { type: _graphql.GraphQLString },
  ageGroup: { type: _graphql.GraphQLString },
  language: { type: _graphql.GraphQLString },
  passportNr: { type: _graphql.GraphQLString },
  // passportImage: { type: GraphQLString },
  nationality: { type: _graphql.GraphQLString },
  passportExpiresOn: { type: _graphql.GraphQLString },
  diet: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
  allergies: { type: new _graphql.GraphQLList(_graphql.GraphQLString) }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdatePax',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    pax: {
      type: _Pax3.default,
      resolve: function resolve(pax) {
        return pax;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var pax;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return paxCtrl.updatePax(inputFields);

            case 2:
              pax = _context.sent;
              return _context.abrupt('return', pax);

            case 4:
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