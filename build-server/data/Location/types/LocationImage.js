'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'LocationImage',
  fields: function fields() {
    return {
      imageTitle: {
        type: _graphql.GraphQLString
      },
      imageDescription: {
        type: _graphql.GraphQLString
      },
      imageFile: {
        type: _graphql.GraphQLString
      }
    };
  }
});