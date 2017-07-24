'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'cityItemType',
  description: 'City tree view item.',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLID,
        description: 'City item id.'
      },
      title: {
        type: _graphql.GraphQLString
      },
      children: {
        type: new _graphql.GraphQLList(_graphql.GraphQLString),
        description: 'Empty array.'
      }
    };
  }
});