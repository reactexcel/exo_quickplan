'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _types = require('../../Meal/types.json');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeSlotMeal = new _graphql.GraphQLObjectType({
  name: 'TimeSlotMeal',
  fields: {
    type: {
      type: _graphql.GraphQLString,
      resolve: function resolve(_ref) {
        var type = _ref.type;
        return type || 'No meal arranged';
      }
    },
    note: {
      type: _graphql.GraphQLString,
      resolve: function resolve(_ref2) {
        var note = _ref2.note;
        return note || '';
      }
    }
  }
});

exports.default = new _graphql.GraphQLObjectType({
  name: 'TimeSlot',
  fields: function fields() {
    return {
      slotOrder: {
        type: _graphql.GraphQLInt
      },
      isDisabled: {
        type: _graphql.GraphQLBoolean
      },
      meal: {
        type: TimeSlotMeal,
        resolve: function resolve(_ref3) {
          var meal = _ref3.meal;
          return meal || {};
        }
      }
    };
  }
});