import { GraphQLString, GraphQLID } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import QueryTripType from '../types/Trip';
import * as tripCtrl from '../controllers/Trip';

export default {
  type: QueryTripType,
  args: {
    tripKey: {
      type: GraphQLID
    },
    agent: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    ...connectionArgs
  },
  resolve: async (_, { tripKey }) => await tripCtrl.getTrip({ tripKey }) || {}
};
