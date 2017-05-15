import { GraphQLObjectType, GraphQLString } from 'graphql';
import CoordinatesType from './Coordinates';

export default new GraphQLObjectType({
  name: 'SupplierAddress',
  fields: () => ({
    postCode: {
      type: GraphQLString
    },
    coordinates: {
      type: CoordinatesType
    },
    streetAddress: {
      type: GraphQLString,
      description: 'Street address.'
    },
    city: {
      type: GraphQLString,
      description: 'City.'
    },
    country: {
      type: GraphQLString,
      description: 'Country of supplier.'
    }
  })
});

