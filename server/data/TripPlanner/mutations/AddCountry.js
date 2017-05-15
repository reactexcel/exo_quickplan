import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'AddCountryTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    countries: { type: new GraphQLList(GraphQLString) },
    order: { type: GraphQLString },
    addedIndex: { type: GraphQLInt }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, countries, order, addedIndex }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      const countryObjects = countries.map(countryName => ({ countryName, cities: [] }));

      // Insert the countries at the specific index
      if (order === 'before') trip.countryBookings.splice(addedIndex, 0, ...countryObjects);
      else if (order === 'after') trip.countryBookings.splice(addedIndex + 1, 0, ...countryObjects);

      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
