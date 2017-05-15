import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as transferPlacementCtrl from './../controllers/TransferPlacement';

const props = {
  serviceBookingKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'RemoveLocalTransfer',
  inputFields: {
    ...props
  },
  outputFields: {
    serviceBookingKey: {
      type: GraphQLString
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await transferPlacementCtrl.removeLocalTransfer(inputFields);
    return saveDoc;
  }
});
