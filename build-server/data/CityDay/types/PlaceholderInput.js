'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

exports.default = new _graphql.GraphQLInputObjectType({
  name: 'PlaceholderInput',
  description: 'Placeholder type',
  fields: function fields() {
    return {
      startSlot: {
        type: _graphql.GraphQLInt
      },
      title: {
        type: _graphql.GraphQLString
      },
      type: {
        type: _graphql.GraphQLString
      },
      notes: {
        type: _graphql.GraphQLString
      },
      durationSlots: {
        type: _graphql.GraphQLInt
      },
      serviceBookingKey: {
        type: _graphql.GraphQLString
      },
      refNo: {
        type: _graphql.GraphQLString
      },
      departureTime: {
        type: _graphql.GraphQLString
      },
      arrivalTime: {
        type: _graphql.GraphQLString
      },
      from: {
        type: _graphql.GraphQLString
      },
      to: {
        type: _graphql.GraphQLString
      },
      vehicleCategory: {
        type: _graphql.GraphQLString
      },
      vehicleModel: {
        type: _graphql.GraphQLString
      },
      class: {
        type: _graphql.GraphQLString
      }
    };
  }
});