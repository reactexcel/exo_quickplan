import { GraphQLList, GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import AccessibleTourType from '../types/AccessibleTour';
import * as tourCtrl from '../controllers/Tours';

export default {
  accessibleTours: {
    type: new GraphQLList(AccessibleTourType),
    args: {
      country: {
        type: GraphQLString
      },
      city: {
        type: GraphQLString
      },
      date: {
        type: GraphQLString
      },
      cityDayKey: {
        type: GraphQLString
      },
      officeKey: {
        type: GraphQLString
      },
      ...connectionArgs
    },
    resolve: async (_, { country, city, date, cityDayKey, officeKey }) => {
      if (country && city && date) {
        return await tourCtrl.getAccessibleTours({ country, city, date, cityDayKey, officeKey });
      }
      return [];
    }
  }
};

