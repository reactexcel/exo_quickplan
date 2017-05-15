import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Promotion',
  fields: () => ({
    type: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  })
});
