import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'LocationImage',
  fields: () => ({
    imageTitle: {
      type: GraphQLString
    },
    imageDescription: {
      type: GraphQLString
    },
    imageFile: {
      type: GraphQLString
    }
  })
});
