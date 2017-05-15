import { GraphQLString, GraphQLID, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import OfficeType from './OfficeType';
import { getAllOffices } from './OfficeController';


export default {
  type: new GraphQLList(OfficeType),
  args: {
    type: {
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
  resolve: async (_, { type }) => await getAllOffices(type) || []
};

