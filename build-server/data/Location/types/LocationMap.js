'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'LocationMap',
  fields: function fields() {
    return {
      latitude: {
        type: _graphql.GraphQLInt
      },
      longitude: {
        type: _graphql.GraphQLInt
      },
      zoomLevel: {
        type: _graphql.GraphQLInt
      }
    };
  }
});