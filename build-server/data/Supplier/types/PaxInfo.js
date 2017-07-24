'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Pax = require('./Pax');

var _Pax2 = _interopRequireDefault(_Pax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'AccommodationPaxInfo',
  fields: function fields() {
    return {
      infants: {
        type: _Pax2.default
      },
      children: {
        type: _Pax2.default
      },
      adults: {
        type: _Pax2.default
      }
    };
  }
});