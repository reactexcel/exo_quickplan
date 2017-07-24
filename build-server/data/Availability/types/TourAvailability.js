'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Promotion = require('./Promotion');

var _Promotion2 = _interopRequireDefault(_Promotion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'TourAvailability',
  description: 'Check tour for availability',
  fields: function fields() {
    return {
      productId: {
        type: _graphql.GraphQLString,
        description: 'Tour ID from Tourplan'
      },
      productOptCode: {
        type: _graphql.GraphQLString
      },
      availability: {
        type: _graphql.GraphQLString
      },
      currency: {
        type: _graphql.GraphQLString
      },
      totalPrice: {
        type: _graphql.GraphQLInt
      },
      commisionPersent: {
        type: _graphql.GraphQLInt
      },
      agentPrice: {
        type: _graphql.GraphQLInt
      },
      rateId: {
        type: _graphql.GraphQLString
      },
      rateName: {
        type: _graphql.GraphQLString
      },
      rateText: {
        type: _graphql.GraphQLString
      },
      cancelHours: {
        type: _graphql.GraphQLInt
      },
      dateFrom: {
        type: _graphql.GraphQLString
      },
      dateTo: {
        type: _graphql.GraphQLString
      },
      promotions: {
        type: new _graphql.GraphQLList(_Promotion2.default)
      },
      hasPromotions: {
        type: _graphql.GraphQLBoolean
      }
    };
  }
});