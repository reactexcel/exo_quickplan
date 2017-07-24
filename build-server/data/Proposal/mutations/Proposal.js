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

var _Proposal = require('./../controllers/Proposal');

var proposalCtrl = _interopRequireWildcard(_Proposal);

var _Proposal2 = require('./../types/Proposal');

var _Proposal3 = _interopRequireDefault(_Proposal2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  startTravelInCity: { type: _graphql.GraphQLString },
  startTravelOnDate: { type: _graphql.GraphQLString },
  travelDuration: { type: _graphql.GraphQLInt },
  notes: { type: _graphql.GraphQLString },
  class: { type: new _graphql.GraphQLList(_graphql.GraphQLInt) },
  style: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
  status: { type: _graphql.GraphQLString },
  createOnDate: { type: _graphql.GraphQLString },
  name: { type: _graphql.GraphQLString },
  private: { type: _graphql.GraphQLBoolean }
};

var paxProps = {
  firstName: { type: _graphql.GraphQLString },
  lastName: { type: _graphql.GraphQLString },
  gender: { type: _graphql.GraphQLString },
  dateOfBirth: { type: _graphql.GraphQLString },
  ageOnArrival: { type: _graphql.GraphQLString },
  ageGroup: { type: _graphql.GraphQLString }
};

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'AddProposal',
  inputFields: {
    proposal: {
      type: new _graphql.GraphQLInputObjectType({
        name: 'ProposalAddInput',
        fields: props
      })
    },
    pax: {
      type: new _graphql.GraphQLInputObjectType({
        name: 'ProposalAddPaxInput',
        fields: paxProps
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
    },
    userToken: {
      type: _graphql.GraphQLString
    }
  },
  outputFields: {
    proposal: {
      type: _Proposal3.default,
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
              return proposalCtrl.addProposal(inputFields);

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