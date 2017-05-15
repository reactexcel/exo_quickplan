import { GraphQLString } from 'graphql';
import * as transferPlacementCtrl from '../controllers/TransferPlacement';
import TransferPlacement from '../types/TransferPlacement';

export default {
  transferPlacement: {
    type: TransferPlacement,
    args: {
      transferPlacementKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await transferPlacementCtrl.getTransferPlacement(args) || []
  }
};
