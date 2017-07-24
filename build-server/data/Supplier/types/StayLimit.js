'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'StayLimit',
  fields: function fields() {
    return {
      minStay: {
        type: _graphql.GraphQLInt
      },
      maxStay: {
        type: _graphql.GraphQLInt
      }
    };
  }
});