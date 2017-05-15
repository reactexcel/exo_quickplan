import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccommodationClass',
  fields: () => ({
    code: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    stars: {
      type: GraphQLInt,
    }
  })
});

