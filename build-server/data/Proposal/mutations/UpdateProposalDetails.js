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

var _Proposal = require('../types/Proposal');

var _Proposal2 = _interopRequireDefault(_Proposal);

var _Proposal3 = require('../controllers/Proposal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'UpdateProposalDetails',
  description: 'Update the the give Proposal Details',
  inputFields: {
    proposal: {
      type: new _graphql.GraphQLInputObjectType({
        name: 'ProposalInput',
        fields: {
          startTravelInCity: { type: _graphql.GraphQLString },
          startTravelOnDate: { type: _graphql.GraphQLString },
          travelDuration: { type: _graphql.GraphQLInt },
          class: { type: new _graphql.GraphQLList(_graphql.GraphQLInt) },
          style: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
          notes: { type: _graphql.GraphQLString },
          proposalKey: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
          status: { type: _graphql.GraphQLString },
          name: { type: _graphql.GraphQLString },
          private: { type: _graphql.GraphQLBoolean }
        }
      })
    },
    selectedTC: {
      type: _graphql.GraphQLString
    },
    selectedOffice: {
      type: _graphql.GraphQLString
    },
    selectedTAOffice: {
      type: _graphql.GraphQLString
    },
    selectedTA: {
      type: _graphql.GraphQLString
    },
    selectedLocation: {
      type: _graphql.GraphQLString
    }
  },
  outputFields: {
    proposal: {
      type: _Proposal2.default,
      resolve: function resolve(saveDoc) {
        return saveDoc;
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
              return (0, _Proposal3.updateProposalDetails)(inputFields);

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