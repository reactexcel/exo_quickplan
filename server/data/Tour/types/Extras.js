import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'Extras',
  fields: () => ({
    chargeBase: {
      type: GraphQLBoolean
    },
    isCompulsory: {
      type: GraphQLBoolean
    },
    sequenceNumber: {
      type: GraphQLInt
    },
    description: {
      type: GraphQLString
    }
  })
});
