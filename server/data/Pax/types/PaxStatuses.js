import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'PaxStatuses',
  fields: () => ({
    severity: {
      type: GraphQLInt
    },
    message: {
      type: GraphQLString
    }
  })
});
