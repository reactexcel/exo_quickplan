'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'Coordinates',
  fields: function fields() {
    return {
      latitude: {
        type: _graphql.GraphQLString
      },
      longitude: {
        type: _graphql.GraphQLString
      }
    };
  }
});