'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationLocality',
  fields: function fields() {
    return {
      localityCode: {
        type: _graphql.GraphQLString
      },
      localityName: {
        type: _graphql.GraphQLString
      }
    };
  }
});