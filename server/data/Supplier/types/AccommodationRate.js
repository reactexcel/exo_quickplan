import { GraphQLString, GraphQLObjectType, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'AccommodationRate',
  fields: ({
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    doubleRoomRate: {
      type: GraphQLInt,
      resolve: acc => acc.doubleRoomRate.substring(0, acc.doubleRoomRate.length - 2)
    }
  })
});
