import { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import TransferAvailabilityType from '../types/TransferAvailability';
import * as availabilityCtrl from '../controllers/Availability';

export default {
  transferAvailability: {
    type: new GraphQLList(TransferAvailabilityType),
    args: {
      transferPlacementId: {
        type: new GraphQLNonNull(GraphQLString)
      },
      country: {
        type: new GraphQLNonNull(GraphQLString)
      },
      productIds: {
        type: new GraphQLList(GraphQLString)
      },
      serviceBookingKeys: {
        type: new GraphQLList(GraphQLString)
      },
      date: {
        type: new GraphQLNonNull(GraphQLString)
      },
      nrOfAdults: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      nrOfChildren: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      nrOfInfants: {
        type: new GraphQLNonNull(GraphQLInt)
      },
      agent: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => {
      const { transferPlacementId, country, productIds, date, serviceBookingKeys, nrOfAdults, nrOfChildren, nrOfInfants } = args;
      return await availabilityCtrl.getTransferAvailability({ transferPlacementId, country, productIds, serviceBookingKeys, date, nrOfAdults, nrOfChildren, nrOfInfants });
    }
  }
};
