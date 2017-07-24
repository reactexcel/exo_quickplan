'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _interface = require('../../interface');

var _TripPassenger = require('./TripPassenger');

var _Country = require('./Country');

exports.default = new _graphql.GraphQLObjectType({
  name: 'DayTripTripPlanner',
  description: 'The Trip object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('cityDays'),
      dayKey: {
        type: _graphql.GraphQLInt
      },
      slot: {
        type: _graphql.GraphQLString
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});