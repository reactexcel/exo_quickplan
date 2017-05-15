import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'TransferStatuses',
  fields: () => ({
    severity: {
      type: GraphQLInt
    },
    message: {
      type: GraphQLString
    }
  })
});

