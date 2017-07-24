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

var _CityBooking = require('../../CityBooking/types/CityBooking');

var _CityBooking2 = _interopRequireDefault(_CityBooking);

var _Supplier = require('../controllers/Supplier');

var _PlaceholderInput = require('../../CityDay/types/PlaceholderInput');

var _PlaceholderInput2 = _interopRequireDefault(_PlaceholderInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateAccommodationPlacement',
  description: 'Add, update, delete the given AccommodationPlacement when clicking save on the hotel picker',
  inputFields: {
    cityBookingKey: {
      type: _graphql.GraphQLString
    },
    accommodationPlacementKey: {
      type: _graphql.GraphQLString
    },
    selectedAccommodationKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    preselectedAccommodationKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    durationNights: {
      type: _graphql.GraphQLInt
    },
    startDay: {
      type: _graphql.GraphQLInt
    },
    action: {
      type: _graphql.GraphQLString
    },
    placeholders: {
      type: new _graphql.GraphQLList(_PlaceholderInput2.default)
    },
    startDate: {
      type: _graphql.GraphQLString
    }
  },
  outputFields: {
    cityBooking: {
      type: _CityBooking2.default,
      resolve: function resolve(savedDoc) {
        return savedDoc;
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
              return (0, _Supplier.updateAccommodationPlacement)(inputFields);

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