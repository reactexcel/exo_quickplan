'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceOutputType = exports.ServiceInputType = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  id: {
    type: _graphql.GraphQLString,
    description: 'Service id'
  },
  type: {
    type: _graphql.GraphQLString,
    description: 'Type of a service (Activity, Hotel, and Transfer)'
  },
  name: {
    type: _graphql.GraphQLString,
    description: 'Service name'
  },
  startDay: {
    type: _graphql.GraphQLInt,
    description: 'Start day of a service'
  },
  startSlot: {
    type: _graphql.GraphQLInt,
    description: 'Start slot of a service (Only activity)'
  },
  durationSlots: {
    type: _graphql.GraphQLInt,
    description: 'Duration of a service (1-3 slots, only activity)'
  },
  numberOfNights: {
    type: _graphql.GraphQLInt,
    description: 'Number of nights (Only hotel)'
  }
};

var ServiceInputType = new _graphql.GraphQLInputObjectType({
  name: 'ServiceInputTripPlanner',
  description: 'Services (Activity, Hotel, and Transfer)',
  fields: function fields() {
    return (0, _extends3.default)({}, props);
  }
});

var ServiceOutputType = new _graphql.GraphQLObjectType({
  name: 'ServiceOutputTripPlanner',
  description: 'Services (Activity, Hotel, and Transfer)',
  fields: function fields() {
    return (0, _extends3.default)({}, props);
  }
});

exports.ServiceInputType = ServiceInputType;
exports.ServiceOutputType = ServiceOutputType;