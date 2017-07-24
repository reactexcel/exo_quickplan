'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationPax',
  fields: function fields() {
    return {
      allowed: {
        type: _graphql.GraphQLBoolean
      },
      ageFrom: {
        type: _graphql.GraphQLInt
      },
      ageTo: {
        type: _graphql.GraphQLInt
      }
    };
  }
});