import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as dayCtrl from '../../CityDay/controllers/CityDay';
import cityDaysType from './../types/cityDays';

export default mutationWithClientMutationId({
  name: 'UpdateDayTripPlanner',
  inputFields: {
    dayKey: { type: GraphQLString },
    unavailableSlots: { type: new GraphQLList(GraphQLString) }
  },
  outputFields: {
    cityDays: {
      type: cityDaysType,
      resolve: updatedDays => updatedDays
    }
  },
  mutateAndGetPayload: async ({ dayKey, unavailableSlots }) => {
    try {
      return await dayCtrl.updateCityDays(dayKey, unavailableSlots);
    } catch (err) {
      return null;
    }
  }
});
