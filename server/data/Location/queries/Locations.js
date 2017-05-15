import { GraphQLList } from 'graphql';
import LocationType from '../types/Location';
import * as locationCtrl from '../controllers/Location';

export default {
  type: new GraphQLList(LocationType),
  resolve: async () => {
    const locations = await locationCtrl.getAllLocations() || [];
    return locations.map((location) => {
      const combinedLocation = location[0];
      combinedLocation.name = location.map(l => l.name).join(', ');
      return combinedLocation;
    });
  }
};
