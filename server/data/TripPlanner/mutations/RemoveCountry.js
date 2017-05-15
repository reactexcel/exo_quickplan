import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'RemoveCountryTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    removedIndex: { type: GraphQLInt }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, removedIndex }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      // trip.countryBookings.splice(removedIndex, 1);
      trip.countryOrder.splice(removedIndex, 1);  // countryBookings is replaced with countryOrder since no countryOrder in in trip.
      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
