import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { CityInputType, CityOutputType } from './City';

const props = {
  countryName: {
    type: GraphQLString,
    description: 'CountryBookings name'
  }
};


const CountryInputType = new GraphQLInputObjectType({
  name: 'CountryInputTripPlanner',
  description: 'Countrys in a trip',
  fields: () => ({
    ...props,
    cities: {
      type: new GraphQLList(CityInputType),
      description: 'City bookings'
    }
  })
});

const CountryOutputType = new GraphQLObjectType({
  name: 'CountryOutputTripPlanner',
  description: 'Countrys in a trip',
  fields: () => ({
    ...props,
    cities: {
      type: new GraphQLList(CityOutputType),
      description: 'City bookings'
    }
  })
});

export { CountryInputType, CountryOutputType };
