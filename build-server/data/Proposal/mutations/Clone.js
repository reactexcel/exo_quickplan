'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _Proposal = require('../controllers/Proposal');

var proposalCtrl = _interopRequireWildcard(_Proposal);

var _auth = require('../../../utils/auth');

var _auth2 = _interopRequireDefault(_auth);

var _Proposal2 = require('../../Proposal/types/Proposal');

var _Proposal3 = _interopRequireDefault(_Proposal2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'CloneProposal',
  inputFields: {
    proposalKey: { type: _graphql.GraphQLString },
    userToken: { type: _graphql.GraphQLString }
  },
  outputFields: {
    proposal: {
      type: _Proposal3.default,
      resolve: function resolve(proposal) {
        return proposal;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
      var proposalKey = _ref2.proposalKey,
          userToken = _ref2.userToken;
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new _promise2.default(function (resolve, reject) {
                if (!userToken) {
                  reject('Invalid user token');
                } else {
                  _auth2.default.getProfile(userToken, function (err, profile) {
                    if (err) {
                      reject(err);
                    } else {
                      proposalCtrl.cloneProposal({
                        proposalKey: proposalKey,
                        userEmail: JSON.parse(profile).email
                      }).then(resolve, reject);
                    }
                  });
                }
              });

            case 2:
              res = _context.sent;
              return _context.abrupt('return', res);

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