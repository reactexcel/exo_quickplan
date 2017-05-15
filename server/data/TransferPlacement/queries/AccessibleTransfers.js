import { GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import TransferType from '../types/Transfer';
import * as transferCtrl from '../controllers/Transfer';

export default {
  accessibleTransfers: {
    type: new GraphQLList(TransferType),
    description: 'Fetch accessible transfer from TourPlan by passing the origin and destination',
    args: {
      origin: {
        type: GraphQLString
      },
      destination: {
        type: GraphQLString
      },
      dateFrom: {
        type: GraphQLString
      },
      ...connectionArgs
    },
    resolve: async (_, { origin, destination, dateFrom }) => {
      if (origin && destination) {
        return await transferCtrl.getAccessibleTransfers({ origin, destination, dateFrom });
      }
      return [];
    }
  }
};
