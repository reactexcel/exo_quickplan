import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Coordinates',
  fields: () => ({
    latitude: {
      type: GraphQLString
    },
    longitude: {
      type: GraphQLString
    }
  })
});

