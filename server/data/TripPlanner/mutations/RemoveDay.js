import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import _ from 'lodash';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';

export default mutationWithClientMutationId({
  name: 'RemoveDayTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    countryIndex: { type: GraphQLString },
    cityIndex: { type: GraphQLString },
    startDay: { type: GraphQLInt }
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, countryIndex, cityIndex, startDay }) => {
    try {
      const trip = await tripCtrl.getTrip({ _key: tripKey });
      const city = trip.countryBookings[countryIndex].cities[cityIndex];
      const services = city.serviceBookings;

      // Reduce the duration nights by one
      city.durationNights -= 1;

      // Remove all the activities and hotels whose startDay equal to the removed day
      _.remove(services, service => service.startDay === startDay);

      // Reduce the startDay of each activities and hotels, which come after the removed day, by one,
      // and also reduce the number of nights of hotels, which has number of nights greater than the new durationNights
      _.each(services, (service) => {
        if (service.startDay > startDay) service.startDay -= 1; // eslint-disable-line no-param-reassign
        if (service.numberOfNights > city.durationNights) service.numberOfNights -= 1; // eslint-disable-line no-param-reassign
      });

      await tripCtrl.updateTrip(trip._key, trip);
      return trip;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
