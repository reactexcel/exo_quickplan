import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Images',
  fields: () => ({
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString,
      resolve: ({ url }) => url || ''
    }
  })
});
