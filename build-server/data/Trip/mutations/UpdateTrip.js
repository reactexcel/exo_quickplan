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

var _Trip = require('./../controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip);

var _MutationTrip = require('../types/MutationTrip');

var _MutationTrip2 = _interopRequireDefault(_MutationTrip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateTrip',
  description: 'Update the basic information of trip,',
  inputFields: {
    _key: { type: _graphql.GraphQLID },
    name: { type: _graphql.GraphQLString },
    status: { type: _graphql.GraphQLString },
    startDate: { type: _graphql.GraphQLString },
    endDate: { type: _graphql.GraphQLString },
    duration: { type: _graphql.GraphQLInt },
    notes: { type: _graphql.GraphQLString }
  },
  outputFields: {
    trip: {
      type: _MutationTrip2.default,
      resolve: function resolve(updatedTrip) {
        return updatedTrip;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return tripCtrl.updateTrip(inputFields);

            case 2:
              return _context.abrupt('return', _context.sent);

            case 3:
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