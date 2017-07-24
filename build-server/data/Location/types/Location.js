'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _LocationImage = require('./LocationImage');

var _LocationImage2 = _interopRequireDefault(_LocationImage);

var _LocationMap = require('./LocationMap');

var _LocationMap2 = _interopRequireDefault(_LocationMap);

var _LocationProvince = require('./LocationProvince');

var _LocationProvince2 = _interopRequireDefault(_LocationProvince);

var _LocationTimeZone = require('./LocationTimeZone');

var _LocationTimeZone2 = _interopRequireDefault(_LocationTimeZone);

var _LocationAirports = require('./LocationAirports');

var _LocationAirports2 = _interopRequireDefault(_LocationAirports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'Location',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('Location', function (location) {
        return location._key;
      }),
      _key: {
        type: _graphql.GraphQLString
      },
      country: { // Not in data model
        type: _graphql.GraphQLString
      },
      type: {
        type: _graphql.GraphQLString
      },
      unCode: {
        type: _graphql.GraphQLString
      },
      tpCode: {
        type: _graphql.GraphQLString
      },
      province: {
        type: _LocationProvince2.default
      },
      name: {
        type: _graphql.GraphQLString,
        resolve: function resolve(_ref) {
          var name = _ref.name;
          return name || '';
        }
      },
      map: {
        type: _LocationMap2.default
      },
      phoneCode: {
        type: _graphql.GraphQLInt
      },
      timeZone: {
        type: _LocationTimeZone2.default
      },
      description: {
        type: _graphql.GraphQLString
      },
      images: {
        type: new _graphql.GraphQLList(_LocationImage2.default)
      },
      isEXODestination: {
        type: _graphql.GraphQLBoolean
      },
      tpServer: {
        type: _graphql.GraphQLString
      },
      airports: {
        type: new _graphql.GraphQLList(_LocationAirports2.default)
      }
    };
  }
});