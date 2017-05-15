import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import * as serviceBookingCtrl from '../controllers/ServiceBooking';
import ServiceAvailabilityType from '../types/Availability';


export default {
  availabilityServices: {
    type: new GraphQLList(ServiceAvailabilityType),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'CountryId or CityId'
      }
    },
    resolve: async (_, args) => await serviceBookingCtrl.checkServicesAvailability(args)
  }
};
