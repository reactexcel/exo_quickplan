'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationSupplier',
  fields: function fields() {
    return {
      supplierId: {
        type: _graphql.GraphQLString
      },
      supplierName: {
        type: _graphql.GraphQLString
      }
    };
  }
});