import { GraphQLObjectType, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'StayLimit',
  fields: () => ({
    minStay: {
      type: GraphQLInt
    },
    maxStay: {
      type: GraphQLInt
    }
  })
});

