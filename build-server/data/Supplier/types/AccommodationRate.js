'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationRate',
  fields: {
    name: {
      type: _graphql.GraphQLString
    },
    description: {
      type: _graphql.GraphQLString
    },
    doubleRoomRate: {
      type: _graphql.GraphQLInt,
      resolve: function resolve(acc) {
        return acc.doubleRoomRate.substring(0, acc.doubleRoomRate.length - 2);
      }
    }
  }
});