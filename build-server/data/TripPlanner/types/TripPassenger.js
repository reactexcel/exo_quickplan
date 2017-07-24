'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PassengerOutputType = exports.PassengerInputType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _TripPassengerDietary = require('./TripPassengerDietary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  title: {
    type: _graphql.GraphQLString,
    description: 'Passenger\'s title'
  },
  firstName: {
    type: _graphql.GraphQLString,
    description: 'Passenger\'s firstName'
  },
  lastName: {
    type: _graphql.GraphQLString,
    description: 'Passenger\'s lastName'
  },
  passportNumber: {
    type: _graphql.GraphQLString,
    description: 'Passenger\'s passport number'
  },
  passportCountry: {
    type: _graphql.GraphQLString,
    description: 'Passenger\'s passport country'
  },
  adult: {
    type: _graphql.GraphQLInt,
    description: 'Number of adult'
  },
  children: {
    type: _graphql.GraphQLInt,
    description: 'Number of children'
  },
  infant: {
    type: _graphql.GraphQLInt,
    description: 'Number of infant'
  },
  allergy: {
    type: _graphql.GraphQLString,
    description: 'Allergies'
  }
};

var PassengerInputType = new _graphql.GraphQLInputObjectType({
  name: 'PassengerInputTripPlanner',
  description: 'Passengers who join a new trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      dietary: { type: _TripPassengerDietary.DietaryInputType }
    });
  }
});

var PassengerOutputType = new _graphql.GraphQLObjectType({
  name: 'PassengerOutputTripPlanner',
  description: 'Passengers who join a trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      dietary: { type: _TripPassengerDietary.DietaryOutputType }
    });
  }
});

exports.PassengerInputType = PassengerInputType;
exports.PassengerOutputType = PassengerOutputType;