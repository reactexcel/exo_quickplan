import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'UpdateServiceTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    countryIndex: { type: GraphQLString },
    cityIndex: { type: GraphQLString },
    serviceIndex: { type: GraphQLString },
    remark: { type: GraphQLString }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, countryIndex, cityIndex, serviceIndex, remark }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      const service = trip.countryBookings[countryIndex].cities[cityIndex].serviceBookings[serviceIndex];
      service.remark = remark;
      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
