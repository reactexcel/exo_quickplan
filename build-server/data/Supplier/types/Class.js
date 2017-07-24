'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationClass',
  fields: function fields() {
    return {
      code: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      },
      stars: {
        type: _graphql.GraphQLInt
      }
    };
  }
});