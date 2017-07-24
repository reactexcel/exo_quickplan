'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccessibleTourPromotion',
  fields: function fields() {
    return {
      promotionStatus: {
        type: _graphql.GraphQLBoolean
      },
      promotionsDetails: {
        type: _graphql.GraphQLString
      }
    };
  }
});