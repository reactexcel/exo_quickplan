import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import { DietaryInputType, DietaryOutputType } from './TripPassengerDietary';

const props = {
  title: {
    type: GraphQLString,
    description: 'Passenger\'s title'
  },
  firstName: {
    type: GraphQLString,
    description: 'Passenger\'s firstName'
  },
  lastName: {
    type: GraphQLString,
    description: 'Passenger\'s lastName'
  },
  passportNumber: {
    type: GraphQLString,
    description: 'Passenger\'s passport number'
  },
  passportCountry: {
    type: GraphQLString,
    description: 'Passenger\'s passport country'
  },
  adult: {
    type: GraphQLInt,
    description: 'Number of adult'
  },
  children: {
    type: GraphQLInt,
    description: 'Number of children'
  },
  infant: {
    type: GraphQLInt,
    description: 'Number of infant'
  },
  allergy: {
    type: GraphQLString,
    description: 'Allergies'
  }
};


const PassengerInputType = new GraphQLInputObjectType({
  name: 'PassengerInputTripPlanner',
  description: 'Passengers who join a new trip',
  fields: () => ({
    ...props,
    dietary: { type: DietaryInputType }
  })
});

const PassengerOutputType = new GraphQLObjectType({
  name: 'PassengerOutputTripPlanner',
  description: 'Passengers who join a trip',
  fields: () => ({
    ...props,
    dietary: { type: DietaryOutputType }
  })
});

export { PassengerInputType, PassengerOutputType };
