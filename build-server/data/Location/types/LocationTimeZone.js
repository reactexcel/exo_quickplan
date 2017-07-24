'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'LocationTimeZone',
  fields: function fields() {
    return {
      timeZoneCode: {
        type: _graphql.GraphQLString
      },
      timeOffset: {
        type: _graphql.GraphQLInt
      }
    };
  }
});