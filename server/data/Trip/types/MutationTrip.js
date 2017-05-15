import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';

export default new GraphQLObjectType({
  name: 'MutationTripType',
  fields: () => ({
    id: globalIdField('trips'),
    _key: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    startDate: {
      type: GraphQLString
    },
    endDate: {
      type: GraphQLString
    },
    duration: {
      type: GraphQLInt
    },
    durationDays: {
      type: GraphQLInt
    },
    notes: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    }
  }),
  interfaces: [nodeInterface]
});
