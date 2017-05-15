import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'UpdateCityTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    countryIndex: { type: GraphQLString },
    cityIndex: { type: GraphQLString },
    durationNights: { type: GraphQLInt }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, countryIndex, cityIndex, durationNights }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      const city = trip.countryBookings[countryIndex].cities[cityIndex];
      city.durationNights = durationNights;
      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
