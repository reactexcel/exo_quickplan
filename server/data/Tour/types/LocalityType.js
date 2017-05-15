import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Locality',
  fields: () => ({
    localityCode: {
      type: GraphQLString
    },
    localityName: {
      type: GraphQLString
    }
  })
});
