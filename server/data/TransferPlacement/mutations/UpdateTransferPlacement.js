import { GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import TransferPlacementType from '../types/TransferPlacement';
import { updateTransferPlacement, updateLocalTransferPlacement } from '../controllers/TransferPlacement';
import ServiceBookingInput from '../../ServiceBooking/types/ServiceBookingInput';

export default mutationWithClientMutationId({
  name: 'UpdateTransferPlacement',
  description: 'Add, update, delete the given TransferPlacement when clicking save on the transfer picker',
  inputFields: {
    isLocaltransfer: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    proposalKey: {
      type: GraphQLString
    },
    n_city_key: {
      type: new GraphQLNonNull(GraphQLString)
    },
    n_day_id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    n_remove_local_transferPlacementKey: {
      type: GraphQLString
    },
    transferPlacementKey: {
      type: new GraphQLNonNull(GraphQLString)
    },
    selectedTransferKeys: {
      type: new GraphQLList(GraphQLString)
    },
    durationDays: {
      type: GraphQLInt
    },
    serviceBookingData: {
      type: new GraphQLList(ServiceBookingInput)
    },
    startDate: {
      type: GraphQLString
    }
  },
  outputFields: {
    transferPlacement: {
      type: TransferPlacementType,
      resolve: savedDoc => savedDoc
    }
  },
  mutateAndGetPayload: async (inputFields) => {
    if (inputFields.isLocaltransfer) {
      return await updateLocalTransferPlacement(inputFields);
    }
    return await updateTransferPlacement(inputFields);
  }
});
