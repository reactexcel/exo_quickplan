import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export default new GraphQLInputObjectType({
  name: 'PAXListMutationType',
  fields: () => ({
    title: {
      type: GraphQLString
    },
    forename: {
      type: GraphQLString
    },
    surename: {
      type: GraphQLString
    },
    paxtype: {
      type: GraphQLString
    }
  })
});
