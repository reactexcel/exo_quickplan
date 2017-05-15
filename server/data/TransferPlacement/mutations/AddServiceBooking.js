import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as transferPlacementCtrl from './../controllers/TransferPlacement';
import TransferPlacementType from './../types/TransferPlacement';

const props = {
  transferPlacementKey: { type: GraphQLString }
};

export default mutationWithClientMutationId({
  name: 'AddServiceBooking',
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
    const saveDoc = await transferPlacementCtrl.addServiceBooking(inputFields);
    return saveDoc;
  }
});
