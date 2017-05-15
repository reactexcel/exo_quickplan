import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLInputObjectType } from 'graphql';

const props = {
  id: {
    type: GraphQLString,
    description: 'Service id'
  },
  type: {
    type: GraphQLString,
    description: 'Type of a service (Activity, Hotel, and Transfer)'
  },
  name: {
    type: GraphQLString,
    description: 'Service name'
  },
  startDay: {
    type: GraphQLInt,
    description: 'Start day of a service'
  },
  startSlot: {
    type: GraphQLInt,
    description: 'Start slot of a service (Only activity)'
  },
  durationSlots: {
    type: GraphQLInt,
    description: 'Duration of a service (1-3 slots, only activity)'
  },
  numberOfNights: {
    type: GraphQLInt,
    description: 'Number of nights (Only hotel)'
  }
};


const ServiceInputType = new GraphQLInputObjectType({
  name: 'ServiceInputTripPlanner',
  description: 'Services (Activity, Hotel, and Transfer)',
  fields: () => ({
    ...props
  })
});

const ServiceOutputType = new GraphQLObjectType({
  name: 'ServiceOutputTripPlanner',
  description: 'Services (Activity, Hotel, and Transfer)',
  fields: () => ({
    ...props
  })
});

export { ServiceInputType, ServiceOutputType };
