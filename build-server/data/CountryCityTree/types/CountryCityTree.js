'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

var _interface = require('../../interface');

var _countryItemType = require('./countryItemType');

var _countryItemType2 = _interopRequireDefault(_countryItemType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'TreeStructureType',
  description: 'A trip country city structure tree.',
  fields: function fields() {
    return {
      id: (0, _graphqlRelay.globalIdField)('TreeStructure'),
      Tree: {
        type: new _graphql.GraphQLList(_countryItemType2.default)
      }
    };
  },
  interfaces: [_interface.nodeInterface]
});