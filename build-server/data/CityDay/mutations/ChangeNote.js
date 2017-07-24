'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _CityDay = require('./../controllers/CityDay');

var _CityDay2 = require('../types/CityDay');

var _CityDay3 = _interopRequireDefault(_CityDay2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _graphqlRelay.mutationWithClientMutationId)({
  name: 'ChangeNote',
  inputFields: {
    cityDayKey: { type: _graphql.GraphQLString },
    note: { type: _graphql.GraphQLString }
  },
  outputFields: {
    cityDay: {
      type: _CityDay3.default,
      resolve: function resolve(cityDay) {
        return cityDay;
      }
    }
  },
  mutateAndGetPayload: function mutateAndGetPayload(input) {
    return (0, _CityDay.changeNote)(input);
  }
});