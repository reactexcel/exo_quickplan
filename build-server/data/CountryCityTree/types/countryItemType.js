'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _cityItemType = require('./cityItemType');

var _cityItemType2 = _interopRequireDefault(_cityItemType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'countryItemType',
  description: 'Country tree view item.',
  fields: function fields() {
    return {
      id: {
        type: _graphql.GraphQLID,
        description: 'Country item id.'
      },
      title: {
        type: _graphql.GraphQLString,
        description: 'Item title.'
      },
      children: {
        type: new _graphql.GraphQLList(_cityItemType2.default),
        description: 'Cities of a country'
      }
    };
  }
});