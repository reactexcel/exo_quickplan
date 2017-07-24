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

var _WordFileURL = require('../controllers/WordFileURL');

var wordFileURLCtrl = _interopRequireWildcard(_WordFileURL);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'TripToWordURL',
  inputFields: {
    id: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
    },
    tripKey: {
      type: _graphql.GraphQLString
    },
    userToken: {
      type: _graphql.GraphQLString
    },
    firstName: {
      type: _graphql.GraphQLString
    },
    lastName: {
      type: _graphql.GraphQLString
    },
    showLineAmounts: {
      type: _graphql.GraphQLBoolean
    },
    showCategoryAmounts: {
      type: _graphql.GraphQLBoolean
    },
    showImages: {
      type: _graphql.GraphQLBoolean
    },
    showDescriptions: {
      type: _graphql.GraphQLBoolean
    },
    showDayNotes: {
      type: _graphql.GraphQLBoolean
    }
  },
  outputFields: {
    wordFileURL: {
      type: _graphql.GraphQLString,
      resolve: function resolve(newURL) {
        return newURL.url;
      }
    }
  },
  mutateAndGetPayload: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(inputFields) {
      var newURL;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return wordFileURLCtrl.getWordURL(inputFields);

            case 2:
              newURL = _context.sent;

              console.log(newURL);
              return _context.abrupt('return', newURL);

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