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
  name: 'TripTripPlanner',
  description: 'The Trip object in Quickplan',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Trip'),
      _key: {
        type: _graphql.GraphQLString
      },
      travelCompany: {
        type: _graphql.GraphQLString,
        description: 'The Travel Company of the trip'
      },
      travelAgent: {
        type: _graphql.GraphQLString,
        description: 'The Travel Agent (TA) of the trip'
      },
      mainPAX: {
        type: _TripPassenger.PassengerOutputType,
        description: 'Passenger of a trip'
      },
      startDate: {
        type: _graphql.GraphQLString,
        description: 'The start date of the trip'
      },
      tripDuration: {
        type: _graphql.GraphQLInt,
        description: 'The duration of the trip. Counted as nights.'
      },
      country: {
        type: _graphql.GraphQLString,
        description: 'Origin country of the trip.'
      },
      city: {
        type: _graphql.GraphQLString,
        description: 'Origin city of the trip.'
      },
      countryBookings: {
        type: new _graphql.GraphQLList(_Country.CountryOutputType),
        description: 'Countries in the trip'
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});