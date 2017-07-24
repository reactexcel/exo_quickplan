'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DietaryOutputType = exports.DietaryInputType = undefined;

var _graphql = require('graphql');

var props = {
  vegetarian: {
    type: _graphql.GraphQLBoolean
  },
  vegan: {
    type: _graphql.GraphQLBoolean
  },
  kosher: {
    type: _graphql.GraphQLBoolean
  },
  halal: {
    type: _graphql.GraphQLBoolean
  }
};

var DietaryInputType = new _graphql.GraphQLInputObjectType({
  name: 'DietaryInputTripPlanner',
  description: 'Dietary preferences',
  fields: function fields() {
    return props;
  }
});

var DietaryOutputType = new _graphql.GraphQLObjectType({
  name: 'DietaryOutputTripPlanner',
  description: 'Dietary preferences',
  fields: function fields() {
    return props;
  }
});

exports.DietaryInputType = DietaryInputType;
exports.DietaryOutputType = DietaryOutputType;