import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as PaxCtrl from '../controllers/Pax';

const props = {
  paxKey: { type: GraphQLString },
  proposalKey: { type: GraphQLString },
};

export default mutationWithClientMutationId({
  name: 'DeletePax',
  inputFields: {
    ...props
  },
  outputFields: {
    paxKey: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const pax = await PaxCtrl.deletePax(inputFields);
    return pax;
  }
});
