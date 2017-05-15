import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'LocationTimeZone',
  fields: () => ({
    timeZoneCode: {
      type: GraphQLString
    },
    timeOffset: {
      type: GraphQLInt
    }
  })
});
