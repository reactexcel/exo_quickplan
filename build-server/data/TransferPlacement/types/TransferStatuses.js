'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'TransferStatuses',
  fields: function fields() {
    return {
      severity: {
        type: _graphql.GraphQLInt
      },
      message: {
        type: _graphql.GraphQLString
      }
    };
  }
});