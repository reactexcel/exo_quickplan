import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';
import mealTypes from '../../Meal/types.json';


const TimeSlotMeal = new GraphQLObjectType({
  name: 'TimeSlotMeal',
  fields: {
    type: {
      type: GraphQLString,
      resolve: ({ type }) => type || 'No meal arranged'
    },
    note: {
      type: GraphQLString,
      resolve: ({ note }) => note || ''
    }
  }
});


export default new GraphQLObjectType({
  name: 'TimeSlot',
  fields: () => ({
    slotOrder: {
      type: GraphQLInt
    },
    isDisabled: {
      type: GraphQLBoolean
    },
    meal: {
      type: TimeSlotMeal,
      resolve: ({ meal }) => meal || {}
    }
  })
});
