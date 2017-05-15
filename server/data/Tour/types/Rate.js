import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Rate',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  })
});
