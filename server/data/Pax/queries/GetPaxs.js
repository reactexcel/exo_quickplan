import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import * as ctrl from '../controllers/Pax';
import PaxType from '../types/Pax';

export default {
  getPaxs: {
    type: new GraphQLList(PaxType),
    args: {
      proposalKey: {
        type: new GraphQLNonNull(GraphQLString)
      },
      tripKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await ctrl.getPaxsByProposalKeyTripKey(args) || []
  }
};
