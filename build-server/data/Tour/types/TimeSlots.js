'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _Slots = require('./Slots');

var _Slots2 = _interopRequireDefault(_Slots);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _graphql.GraphQLObjectType({
  name: 'TimeSlotsType',
  fields: function fields() {
    return {
      Morning: {
        type: _Slots2.default
      },
      Afternoon: {
        type: _Slots2.default
      },
      Evening: {
        type: _Slots2.default
      }
    };
  }
});