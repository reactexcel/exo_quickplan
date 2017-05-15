import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as transferPlacementCtrl from './../controllers/TransferPlacement';
import TransferPlacementType from './../types/TransferPlacement';

const props = {
  transferPlacementKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'ClearTransferPlacement',
  inputFields: {
    ...props
  },
  outputFields: {
    transferPlacement: {
      type: TransferPlacementType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await transferPlacementCtrl.clearTransferPlacement(inputFields.transferPlacementKey);
    return saveDoc;
  }
});
