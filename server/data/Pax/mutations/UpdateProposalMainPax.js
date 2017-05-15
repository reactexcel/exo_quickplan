import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as paxCtrl from '../controllers/Pax';

const props = {
  mainPaxKey: { type: GraphQLString },
  proposalKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'UpdateProposalMainPax',
  inputFields: {
    ...props
  },
  outputFields: {
    mainPaxKey: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const mainPaxKey = await paxCtrl.updateProposalMainPax(inputFields);
    return mainPaxKey;
  }
});
