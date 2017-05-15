import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'LocationAirports',
  fields: () => ({
    code: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  })
});
