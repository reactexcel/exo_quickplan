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

var _TransferPlacement = require('../types/TransferPlacement');

var _TransferPlacement2 = _interopRequireDefault(_TransferPlacement);

var _TransferPlacement3 = require('../controllers/TransferPlacement');

var _ServiceBookingInput = require('../../ServiceBooking/types/ServiceBookingInput');

var _ServiceBookingInput2 = _interopRequireDefault(_ServiceBookingInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateTransferPlacement',
  description: 'Add, update, delete the given TransferPlacement when clicking save on the transfer picker',
  inputFields: {
    isLocaltransfer: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean)
    },
    proposalKey: {
      type: _graphql.GraphQLString
    },
    n_city_key: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    n_day_id: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    n_remove_local_transferPlacementKey: {
      type: _graphql.GraphQLString
    },
    transferPlacementKey: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
    },
    selectedTransferKeys: {
      type: new _graphql.GraphQLList(_graphql.GraphQLString)
    },
    durationDays: {
      type: _graphql.GraphQLInt
    },
    serviceBookingData: {
      type: new _graphql.GraphQLList(_ServiceBookingInput2.default)
    },
    startDate: {
      type: _graphql.GraphQLString
    }
  },
  outputFields: {
    transferPlacement: {
      type: _TransferPlacement2.default,
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
              if (!inputFields.isLocaltransfer) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return (0, _TransferPlacement3.updateLocalTransferPlacement)(inputFields);

            case 3:
              return _context.abrupt('return', _context.sent);

            case 4:
              _context.next = 6;
              return (0, _TransferPlacement3.updateTransferPlacement)(inputFields);

            case 6:
              return _context.abrupt('return', _context.sent);

            case 7:
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