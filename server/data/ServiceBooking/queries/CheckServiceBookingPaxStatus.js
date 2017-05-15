import { GraphQLString, GraphQLList } from 'graphql';
import * as serviceBookingController from '../controllers/ServiceBooking';
import PaxStatuses from '../../Pax/types/PaxStatuses';

export default {
  checkServiceBookingPaxStatus: {
    type: new GraphQLList(PaxStatuses),
    args: {
      cityDayKey: {
        type: GraphQLString
      },
      tripKey: {
        type: GraphQLString
      },
      serviceBookingKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await serviceBookingController.checkPaxStatus(args) || []
  }
};
