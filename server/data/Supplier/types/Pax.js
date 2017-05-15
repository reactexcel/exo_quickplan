import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccommodationPax',
  fields: () => ({
    allowed: {
      type: GraphQLBoolean
    },
    ageFrom: {
      type: GraphQLInt
    },
    ageTo: {
      type: GraphQLInt
    }
  })
});
