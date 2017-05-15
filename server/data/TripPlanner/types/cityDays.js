import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
import { PassengerOutputType } from './TripPassenger';
import { CountryOutputType } from './Country';

export default new GraphQLObjectType({
  name: 'DayTripTripPlanner',
  description: 'The Trip object in Quickplan',
  fields: () => ({
    id: globalIdField('cityDays'),
    dayKey: {
      type: GraphQLInt
    },
    slot: {
      type: GraphQLString,
    }
  }),
  interfaces: [nodeInterface]
});
