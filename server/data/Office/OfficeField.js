import { GraphQLString } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import OfficeType from './OfficeType';
import { getOffice } from './OfficeController';


export default {
  type: OfficeType,
  args: {
    officeKey: {
      type: GraphQLString
    },
    agent: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    ...connectionArgs
  },
  resolve: async (_, { officeKey }) => await getOffice(officeKey) || {}
};

