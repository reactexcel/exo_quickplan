'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'Promotion',
  fields: function fields() {
    return {
      type: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});