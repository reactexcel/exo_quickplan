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

var _CountryBooking = require('./../controllers/CountryBooking');

var countrybookingCtrl = _interopRequireWildcard(_CountryBooking);

var _CountryBooking2 = require('./../types/CountryBooking');

var _CountryBooking3 = _interopRequireDefault(_CountryBooking2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  tripKey: { type: _graphql.GraphQLID },
  _key: { type: _graphql.GraphQLString },
  countryCode: { type: _graphql.GraphQLString },
  createdBy: { type: _graphql.GraphQLString },
  order: { type: _graphql.GraphQLString },
  addedIndex: { type: _graphql.GraphQLString }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddCountryBooking',
  inputFields: (0, _extends3.default)({}, props),
  outputFields: {
    countryBooking: {
      type: _CountryBooking3.default,
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
              _context.next = 2;
              return countrybookingCtrl.addCountryBooking(inputFields);

            case 2:
              saveDoc = _context.sent;
              return _context.abrupt('return', saveDoc);

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