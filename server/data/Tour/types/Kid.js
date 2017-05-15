import { GraphQLObjectType, GraphQLInt, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'KidsType',
  fields: () => ({
    allowed: {
      type: GraphQLBoolean
    },
    ageFrom: {
      type: GraphQLInt
    },
    ageTo: {
      type: GraphQLInt
    },
    countInPaxBreak: {
      type: GraphQLBoolean
    }
  })
});
