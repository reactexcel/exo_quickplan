import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as tripCtrl from './../controllers/Trip';
import TripType from './../types/Trip';
import * as cityBookingController from '../../CityBooking/controllers/CityBooking';

export default mutationWithClientMutationId({
  name: 'RemoveCityTripPlanner',
  inputFields: {
    tripId: { type: GraphQLString },
    tripKey: { type: GraphQLString },
    countryIndex: { type: GraphQLString },
    cityIndex: { type: GraphQLInt },
    countryBookingKey: { type: GraphQLString }, // changes to string gettin error "Int cannot represent non 32-bit signed integer value: "
    cityBookingKey: { type: GraphQLString } // changes to string gettin error "Int cannot represent non 32-bit signed integer value: "
  },
  outputFields: {
    trips: {
      type: TripType,
      resolve: updatedTrip => updatedTrip
    }
  },
  mutateAndGetPayload: async ({ tripKey, countryIndex, cityIndex, countryBookingKey, cityBookingKey }) => {
    try {
      return await cityBookingController.removeCityBooking({ tripKey, countryIndex, cityIndex, countryBookingKey, cityBookingKey });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
