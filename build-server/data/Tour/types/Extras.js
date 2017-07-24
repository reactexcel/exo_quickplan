'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'Extras',
  fields: function fields() {
    return {
      chargeBase: {
        type: _graphql.GraphQLBoolean
      },
      isCompulsory: {
        type: _graphql.GraphQLBoolean
      },
      sequenceNumber: {
        type: _graphql.GraphQLInt
      },
      description: {
        type: _graphql.GraphQLString
      }
    };
  }
});