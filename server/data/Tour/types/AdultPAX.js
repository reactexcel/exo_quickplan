import { GraphQLObjectType, GraphQLInt, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'AdultPAX',
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
