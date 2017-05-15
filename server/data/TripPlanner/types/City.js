import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { ServiceInputType, ServiceOutputType } from './Service';

const props = {
  cityName: {
    type: GraphQLString,
    description: 'City name'
  },
  tpCode: {
    type: GraphQLString,
    description: 'City code'
  },
  durationNights: {
    type: GraphQLInt,
    description: 'City duration nights'
  }
};


const CityInputType = new GraphQLInputObjectType({
  name: 'CityInputTripPlanner',
  description: 'Cities in a trip',
  fields: () => ({
    ...props,
    serviceBookings: {
      type: new GraphQLList(ServiceInputType),
      description: 'Service Bookings'
    }
  })
});

const CityOutputType = new GraphQLObjectType({
  name: 'CityOutputTripPlanner',
  description: 'Cities in a trip',
  fields: () => ({
    ...props,
    serviceBookings: {
      type: new GraphQLList(ServiceOutputType),
      description: 'Service Bookings'
    }
  })
});

export { CityInputType, CityOutputType };
