import { GraphQLString } from 'graphql';
import Proposal from '../types/Proposal';
import { getProposal } from '../controllers/Proposal';

export default {
  type: Proposal,
  args: {
    proposalKey: {
      type: GraphQLString
    }
  },
  resolve: async (_, { proposalKey }) => await getProposal({ proposalKey }) || {}
};
