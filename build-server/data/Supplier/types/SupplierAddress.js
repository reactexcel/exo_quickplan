'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Coordinates = require('./Coordinates');

var _Coordinates2 = _interopRequireDefault(_Coordinates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'SupplierAddress',
  fields: function fields() {
    return {
      postCode: {
        type: _graphql.GraphQLString
      },
      coordinates: {
        type: _Coordinates2.default
      },
      streetAddress: {
        type: _graphql.GraphQLString,
        description: 'Street address.'
      },
      city: {
        type: _graphql.GraphQLString,
        description: 'City.'
      },
      country: {
        type: _graphql.GraphQLString,
        description: 'Country of supplier.'
      }
    };
  }
});