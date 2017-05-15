import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import TourAvailability from '../types/TourAvailability';
import * as availabilityCtrl from '../controllers/Availability';

export default {
  tourAvailability: {
    type: TourAvailability,
    args: {
      serviceBookingKey: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (_, args) => {
      const { serviceBookingKey } = args;
      return await availabilityCtrl.getTourAvailability({ serviceBookingKey });
    }
  }
};
