import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as proposalCtrl from './../controllers/Proposal';

export default mutationWithClientMutationId({
  name: 'assignTC',
  inputFields: {
    userKey: { type: GraphQLString },
    proposalKey: { type: GraphQLString }
  },
  outputFields: {
    edgeId: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async ({ userKey, proposalKey }) => ({
    edgeId: await proposalCtrl.assignTC({ userKey, proposalKey })
  })
});
