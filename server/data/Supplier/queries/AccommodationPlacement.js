import { GraphQLString } from 'graphql';
import * as supplierController from '../controllers/Supplier';
import AccommodationPlacementType from '../types/AccommodationPlacement';

export default {
  accommodationPlacement: {
    type: AccommodationPlacementType,
    args: {
      accommodationPlacementKey: {
        type: GraphQLString
      }
    },
    resolve: async (_, args) => await supplierController.getAccommodationPlacement(args) || []
  }
};
