import { GraphQLObjectType, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'LocationMap',
  fields: () => ({
    latitude: {
      type: GraphQLInt
    },
    longitude: {
      type: GraphQLInt
    },
    zoomLevel: {
      type: GraphQLInt
    }
  })
});
