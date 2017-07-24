'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _UserType = require('./UserType');

var _UserType2 = _interopRequireDefault(_UserType);

var _UserController = require('./UserController');

var _auth = require('../../utils/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  type: _UserType2.default,
  args: (0, _extends3.default)({
    userKey: {
      type: _graphql.GraphQLID
    },
    userToken: {
      type: _graphql.GraphQLString
    },
    agent: {
      type: _graphql.GraphQLString
    },
    password: {
      type: _graphql.GraphQLString
    }
  }, _graphqlRelay.connectionArgs),
  resolve: function resolve(_, user) {
    return new _promise2.default(function (resolve) {
      if (user.userToken) {
        _auth2.default.getProfile(user.userToken, function (err, profile) {
          if (err) {
            console.error(err);
            resolve({});
          } else {
            (0, _UserController.getUser)((0, _extends3.default)({}, user, {
              userEmail: JSON.parse(profile).email
            })).then(resolve, function (err) {
              console.error(err);
              resolve({});
            });
          }
        });
      } else {
        (0, _UserController.getUser)(user).then(resolve, function (err) {
          console.error(err);
          resolve({});
        });
      }
    });
  }
};