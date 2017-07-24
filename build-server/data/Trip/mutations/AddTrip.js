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

var _Trip = require('./../controllers/Trip');

var tripCtrl = _interopRequireWildcard(_Trip);

var _MutationTrip = require('../types/MutationTrip');

var _MutationTrip2 = _interopRequireDefault(_MutationTrip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  proposalKey: { type: _graphql.GraphQLID },
  name: { type: _graphql.GraphQLString },
  startDate: { type: _graphql.GraphQLString },
  endDate: { type: _graphql.GraphQLString },
  duration: { type: _graphql.GraphQLInt },
  notes: { type: _graphql.GraphQLString },
  status: { type: _graphql.GraphQLString }
};

function add30DaysToTrip() {
  var todayAdd30 = new Date();
  todayAdd30.setDate(todayAdd30.getDate() + 30);
  var year = todayAdd30.getFullYear();
  var month = todayAdd30.getMonth() + 1 < 10 ? '0' + (todayAdd30.getMonth() + 1) : todayAdd30.getMonth() + 1;
  var day = todayAdd30.getDate() < 10 ? '0' + todayAdd30.getDate() : todayAdd30.getDate();
  return year + '-' + month + '-' + day;
}

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddTrip',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    trip: {
      type: _MutationTrip2.default,
      resolve: function resolve(saveDoc) {
        return saveDoc;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var saveDoc;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!inputFields.startDate) {
                // Add start date 30 days from today to new trip.
                // TODO: Implement correct start date for trips.
                inputFields.startDate = add30DaysToTrip(); // eslint-disable-line no-param-reassign
              }
              // console.log(inputFields);
              _context.next = 3;
              return tripCtrl.addTrip(inputFields);

            case 3:
              saveDoc = _context.sent;
              return _context.abrupt('return', saveDoc);

            case 5:
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