import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccommodationLocality',
  fields: () => ({
    localityCode: {
      type: GraphQLString
    },
    localityName: {
      type: GraphQLString
    }
  })
});

