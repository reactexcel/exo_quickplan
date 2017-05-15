import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../../interface';
// import { PaxErrorType } from './PaxError';

const ErrorType = new GraphQLObjectType({
  name: 'Error',
  fields: () => ({
    severity: {
      type: GraphQLInt
    },
    message: {
      type: GraphQLString
    },
    errorType: {
      type: GraphQLString
    }
  })
});

export default new GraphQLObjectType({
  name: 'Pax',
  description: 'Passenger type',
  fields: () => ({
    id: globalIdField('Pax', pax => pax._key),
    _key: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString,
      resolve: ({ firstName }) => firstName || ''
    },
    lastName: {
      type: GraphQLString,
      resolve: ({ lastName }) => lastName || ''
    },
    gender: {
      type: GraphQLString
    },
    dateOfBirth: {
      type: GraphQLString
    },
    ageOnArrival: {
      type: GraphQLString
    },
    ageGroup: {
      type: GraphQLString
    },
    language: {
      type: GraphQLString
    },
    passportNr: {
      type: GraphQLString,
      resolve: ({ passportNr }) => passportNr || ''
    },
    passportImage: {
      type: GraphQLString
    },
    nationality: {
      type: GraphQLString,
      resolve: ({ nationality }) => nationality || ''
    },
    passportExpiresOn: {
      type: GraphQLString
    },
    diet: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ diet }) => diet || []
    },
    allergies: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ allergies }) => allergies || []
    },
    isMainPax: {
      type: GraphQLBoolean
    },
    paxError: {
      type: new GraphQLList(ErrorType)
    }
  })
  // ,interfaces: [nodeInterface]
});
