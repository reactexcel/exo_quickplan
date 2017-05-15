import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import * as transferPlacementCtrl from './../controllers/TransferPlacement';
import TransferPlacementType from './../types/TransferPlacement';

const props = {
  originCityBookingKey: { type: GraphQLString },
  destinationCityBookingKey: { type: GraphQLString },
  durationDays: { type: GraphQLInt }
};

export default mutationWithClientMutationId({
  name: 'AddTransferPlacement',
  inputFields: {
    ...props
  },
  outputFields: {
    proposal: {
      type: TransferPlacementType,
      resolve: saveDoc => saveDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    const saveDoc = await transferPlacementCtrl.addTransferPlacement(inputFields);
    return saveDoc;
  }
});
