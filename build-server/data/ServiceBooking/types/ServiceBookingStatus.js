'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLObjectType({
  name: 'ServiceBookingStatusType',
  fields: function fields() {
    return {
      tpAvailabilityStatus: {
        type: _graphql.GraphQLString
      },
      tpBookingStatus: {
        type: _graphql.GraphQLString
      },
      message: {
        type: _graphql.GraphQLString
      },
      severity: {
        type: _graphql.GraphQLString
      },
      state: {
        type: _graphql.GraphQLString
      }
    };
  }
});