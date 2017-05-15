import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { remove as removeProposal } from '../controllers/Proposal';


export default mutationWithClientMutationId({
  name: 'RemoveProposal',
  inputFields: {
    proposalKey: { type: GraphQLString }
  },
  outputFields: {
    proposalKey: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async ({ proposalKey }) => {
    const removeDoc = await removeProposal(proposalKey);
    return removeDoc;
  }
});
