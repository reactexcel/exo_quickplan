'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'LocationAirports',
  fields: function fields() {
    return {
      code: {
        type: _graphql.GraphQLString
      },
      name: {
        type: _graphql.GraphQLString
      }
    };
  }
});