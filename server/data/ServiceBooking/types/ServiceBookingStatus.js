import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'ServiceBookingStatusType',
  fields: () => ({
    tpAvailabilityStatus: {
      type: GraphQLString
    },
    tpBookingStatus: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    },
    severity: {
      type: GraphQLString
    },
    state: {
      type: GraphQLString
    }
  })
});
