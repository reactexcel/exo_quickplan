import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'AddCityTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    cities: { type: new GraphQLList(GraphQLString) },
    countryIndex: { type: GraphQLString },
    cityOrder: { type: GraphQLString },
    cityIndex: { type: GraphQLInt }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, cities, countryIndex, cityOrder, cityIndex }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      const tripCities = trip.countryBookings[countryIndex].cities;
      const cityObjects = cities.map(cityName => ({ cityName, durationNights: 0, serviceBookings: [] }));

      // Insert the cities at the specific index
      if (cityOrder === 'before') tripCities.splice(cityIndex, 0, ...cityObjects);
      else if (cityOrder === 'after') tripCities.splice(cityIndex + 1, 0, ...cityObjects);

      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});

