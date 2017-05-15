import { GraphQLString } from 'graphql';
import * as cityBookingController from '../controllers/CityBooking';
import CityBooking from '../types/CityBooking';

export default {
  cityBooking: {
    type: CityBooking,
    args: {
      cityBookingKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await cityBookingController.getCityBooking(args) || []
  }
};
