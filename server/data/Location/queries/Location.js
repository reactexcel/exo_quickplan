import { GraphQLID, GraphQLList } from 'graphql';
import LocationType from '../types/Location';
import * as locationCtrl from '../controllers/Location';

export default {
  location: {
    type: new GraphQLList(LocationType),
    args: {
      locationKey: {
        type: GraphQLID
      }
    },
    resolve: async (_, { locationKey }) => await locationCtrl.getLocation(locationKey) || []
  }
};
