'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'LocationProvince',
  fields: function fields() {
    return {
      isoProvinceCode: {
        type: _graphql.GraphQLString
      },
      provinceName: {
        type: _graphql.GraphQLString
      }
    };
  }
});