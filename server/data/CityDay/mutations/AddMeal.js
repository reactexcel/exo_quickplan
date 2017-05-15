import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { addMeal } from './../controllers/CityDay';
import CityDay from '../types/CityDay';

export default mutationWithClientMutationId({
  name: 'AddMeal',
  inputFields: {
    cityDayKey: { type: GraphQLString },
    mealOrder: { type: GraphQLInt },
    mealType: { type: GraphQLString },
    mealNote: { type: GraphQLString }
  },
  outputFields: {
    cityDay: {
      type: CityDay,
      resolve: cityDay => cityDay
    }
  },
  mutateAndGetPayload: input => addMeal(input)
});
