'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'SlotsType',
  fields: function fields() {
    return {
      available: {
        type: _graphql.GraphQLBoolean
      },
      pickupTime: {
        type: _graphql.GraphQLString
      },
      dropoffTime: {
        type: _graphql.GraphQLString
      }
    };
  }
});