import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import { PassengerOutputType } from './TripPassenger';
import { CountryOutputType } from './Country';

export default new GraphQLObjectType({
  name: 'TripTripPlanner',
  description: 'The Trip object in Quickplan',
  fields: () => ({
    id: globalIdField('Trip'),
    _key: {
      type: GraphQLString
    },
    travelCompany: {
      type: GraphQLString,
      description: 'The Travel Company of the trip'
    },
    travelAgent: {
      type: GraphQLString,
      description: 'The Travel Agent (TA) of the trip'
    },
    mainPAX: {
      type: PassengerOutputType,
      description: 'Passenger of a trip'
    },
    startDate: {
      type: GraphQLString,
      description: 'The start date of the trip'
    },
    tripDuration: {
      type: GraphQLInt,
      description: 'The duration of the trip. Counted as nights.'
    },
    country: {
      type: GraphQLString,
      description: 'Origin country of the trip.'
    },
    city: {
      type: GraphQLString,
      description: 'Origin city of the trip.'
    },
    countryBookings: {
      type: new GraphQLList(CountryOutputType),
      description: 'Countries in the trip'
    }
  }),
  interfaces: [nodeInterface]
});
