import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

export default new GraphQLObjectType({
  name: 'PlaceholderOutput',
  description: 'Placeholder type',
  fields: () => ({
    startSlot: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    notes: {
      type: GraphQLString
    },
    durationSlots: {
      type: GraphQLInt
    },
    serviceBookingKey: {
      type: GraphQLString
    },
    refNo: {
      type: GraphQLString
    },
    departureTime: {
      type: GraphQLString
    },
    arrivalTime: {
      type: GraphQLString
    },
    from: {
      type: GraphQLString
    },
    to: {
      type: GraphQLString
    },
    vehicleCategory: {
      type: GraphQLString
    },
    vehicleModel: {
      type: GraphQLString
    },
    class: {
      type: GraphQLString
    }
  })
});
