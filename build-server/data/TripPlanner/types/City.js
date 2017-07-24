'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CityOutputType = exports.CityInputType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _Service = require('./Service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  cityName: {
    type: _graphql.GraphQLString,
    description: 'City name'
  },
  tpCode: {
    type: _graphql.GraphQLString,
    description: 'City code'
  },
  durationNights: {
    type: _graphql.GraphQLInt,
    description: 'City duration nights'
  }
};

var CityInputType = new _graphql.GraphQLInputObjectType({
  name: 'CityInputTripPlanner',
  description: 'Cities in a trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      serviceBookings: {
        type: new _graphql.GraphQLList(_Service.ServiceInputType),
        description: 'Service Bookings'
      }
    });
  }
});

var CityOutputType = new _graphql.GraphQLObjectType({
  name: 'CityOutputTripPlanner',
  description: 'Cities in a trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      serviceBookings: {
        type: new _graphql.GraphQLList(_Service.ServiceOutputType),
        description: 'Service Bookings'
      }
    });
  }
});

exports.CityInputType = CityInputType;
exports.CityOutputType = CityOutputType;