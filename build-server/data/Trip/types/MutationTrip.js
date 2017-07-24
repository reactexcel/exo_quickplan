'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _interface = require('../../interface');

exports.default = new _graphql.GraphQLObjectType({
  name: 'MutationTripType',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('trips'),
      _key: {
        type: _graphql.GraphQLString
      },
      name: {
        type: _graphql.GraphQLString
      },
      startDate: {
        type: _graphql.GraphQLString
      },
      endDate: {
        type: _graphql.GraphQLString
      },
      duration: {
        type: _graphql.GraphQLInt
      },
      durationDays: {
        type: _graphql.GraphQLInt
      },
      notes: {
        type: _graphql.GraphQLString
      },
      status: {
        type: _graphql.GraphQLString
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});