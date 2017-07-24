'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CountryOutputType = exports.CountryInputType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

var _City = require('./City');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  countryName: {
    type: _graphql.GraphQLString,
    description: 'CountryBookings name'
  }
};

var CountryInputType = new _graphql.GraphQLInputObjectType({
  name: 'CountryInputTripPlanner',
  description: 'Countrys in a trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      cities: {
        type: new _graphql.GraphQLList(_City.CityInputType),
        description: 'City bookings'
      }
    });
  }
});

var CountryOutputType = new _graphql.GraphQLObjectType({
  name: 'CountryOutputTripPlanner',
  description: 'Countrys in a trip',
  fields: function fields() {
    return (0, _extends3.default)({}, props, {
      cities: {
        type: new _graphql.GraphQLList(_City.CityOutputType),
        description: 'City bookings'
      }
    });
  }
});

exports.CountryInputType = CountryInputType;
exports.CountryOutputType = CountryOutputType;