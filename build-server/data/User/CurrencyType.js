'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var CurrencyType = new _graphql.GraphQLObjectType({
  name: 'CurrencyType',
  fields: function fields() {
    return {
      countryCode: {
        type: _graphql.GraphQLString
      },
      currency: {
        type: _graphql.GraphQLString
      },
      tpPW: {
        type: _graphql.GraphQLString
      },
      tpUID: {
        type: _graphql.GraphQLString
      }
    };
  }
});

exports.default = CurrencyType;