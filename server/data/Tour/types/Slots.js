import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'SlotsType',
  fields: () => ({
    available: {
      type: GraphQLBoolean
    },
    pickupTime: {
      type: GraphQLString
    },
    dropoffTime: {
      type: GraphQLString
    }
  })
});
