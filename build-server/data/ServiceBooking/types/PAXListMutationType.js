'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLInputObjectType({
  name: 'PAXListMutationType',
  fields: function fields() {
    return {
      title: {
        type: _graphql.GraphQLString
      },
      forename: {
        type: _graphql.GraphQLString
      },
      surename: {
        type: _graphql.GraphQLString
      },
      paxtype: {
        type: _graphql.GraphQLString
      }
    };
  }
});