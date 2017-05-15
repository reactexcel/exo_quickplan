import { GraphQLString } from 'graphql';
import * as serviceBookingController from '../controllers/ServiceBooking';
import ServiceBooking from '../types/ServiceBooking';

export default {
  serviceBooking: {
    type: ServiceBooking,
    args: {
      serviceBookingKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await serviceBookingController.getServiceBooking(args) || []
  }
};
