'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Kid = require('./Kid');

var _Kid2 = _interopRequireDefault(_Kid);

var _AdultPAX = require('./AdultPAX');

var _AdultPAX2 = _interopRequireDefault(_AdultPAX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'PAXType',
  fields: function fields() {
    return {
      maxPax: {
        type: _graphql.GraphQLInt
      },
      infants: {
        type: _Kid2.default
      },
      children: {
        type: _Kid2.default
      },
      adults: {
        type: _AdultPAX2.default
      }
    };
  }
});