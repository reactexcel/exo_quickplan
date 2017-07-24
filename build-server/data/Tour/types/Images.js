'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'Images',
  fields: function fields() {
    return {
      title: {
        type: _graphql.GraphQLString
      },
      description: {
        type: _graphql.GraphQLString
      },
      url: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var url = _ref.url;
          return url || '';
        }
      }
    };
  }
});