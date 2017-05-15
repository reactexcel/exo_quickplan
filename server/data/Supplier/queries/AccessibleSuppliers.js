import { GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import AccessibleSupplierType from '../types/AccessibleSupplier';
import * as accommodationCtrl from '../controllers/Supplier';

export default {
  accessibleSuppliers: {
    type: new GraphQLList(AccessibleSupplierType),
    description: 'Fetch accessible supplier from TourPlan by passing the given country, city, date, and duration',
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
      duration: {
        type: GraphQLInt
      },
      accommodationPlacementKey: {
        type: GraphQLString
      },
      useRemoteDataOnly: {
        type: GraphQLBoolean
      },
      ...connectionArgs
    },
    resolve: async (_, { country, city, date, duration, accommodationPlacementKey, useRemoteDataOnly }) => {
      if (country && city && date) {
        const result = await accommodationCtrl.getAccessibleSuppliers({ country, city, date, duration, accommodationPlacementKey, useRemoteDataOnly });
        if (useRemoteDataOnly === false) {
          const m_result = [];
          const addedKeys = [];
          result.forEach((v, k) => {
            const key = v._key;
            if (addedKeys.indexOf(key) >= 0) {
              addedKeys.push(key);
            } else {
              addedKeys.push(key);
              v.accommodations = v.accommodation; // eslint-disable-line no-param-reassign
              m_result.push(v);
            }
          });
          return m_result;
        } else { // eslint-disable-line no-else-return
          return result;
        }
      }
      return [];
    }
  }
};
