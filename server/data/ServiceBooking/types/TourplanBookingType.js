import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'TourplanBooking',
  description: 'The tourplan booking result object in Quickplan',
  fields: () => ({
    status: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    }
  })
});
